/* =========================================================
   Nuru Tech - script.js
   Vanilla JavaScript, no libraries. Each feature lives in its
   own init function and is started at the bottom of the file.

   Features
   1.  Mobile navigation toggle
   2.  Smooth scrolling (and prefilling the contact form)
   3.  Sticky header and back-to-top behaviour
   4.  Active link highlighting while scrolling
   5.  Portfolio category filtering
   6.  Project details dialog
   7.  Testimonial slider
   8.  Contact form validation (demonstration only)
   9.  Dynamic copyright year
   10. Scroll reveal animations and counting statistics
   11. Image fallback
   ========================================================= */

(() => {
  'use strict';

  /* ---------- Small helpers ---------- */
  const $  = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollBehavior = () => (reducedMotion.matches ? 'auto' : 'smooth');

  /* ---------- 1. Mobile navigation toggle ---------- */
  function initNavToggle() {
    const toggle = $('.nav-toggle');
    const nav = $('#primary-nav');
    if (!toggle || !nav) return;

    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    toggle.addEventListener('click', () => {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close the menu after choosing a link
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });

    // Escape closes the menu and returns focus to the button
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    // Reset when the window grows to desktop width
    window.matchMedia('(min-width: 900px)').addEventListener('change', (event) => {
      if (event.matches) setOpen(false);
    });
  }

  /* ---------- 2. Smooth scrolling ---------- */
  function initSmoothScroll() {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute('href');
      if (hash.length < 2) return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;

      event.preventDefault();

      // Buttons such as "Request this service" fill in the contact form first
      if (link.hasAttribute('data-service')) {
        prefillContactForm(link.dataset.service, link.dataset.message);
      }

      target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });

      // Keep keyboard and screen reader users in sync with the scroll
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });

      try { history.pushState(null, '', hash); } catch (error) { /* some browsers block this on file:// pages */ }
    });

    // Back-to-top buttons (floating and footer)
    $$('[data-back-to-top]').forEach((button) => {
      button.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: scrollBehavior() });
        const brand = $('.site-header .brand');
        if (brand) brand.focus({ preventScroll: true });
      });
    });
  }

  /* ---------- 3. Sticky header and back-to-top visibility ---------- */
  function initScrollEffects() {
    const header = $('.site-header');
    const backToTop = $('.back-to-top');
    let waiting = false;

    const update = () => {
      const y = window.scrollY;
      if (header) header.classList.toggle('is-scrolled', y > 24);
      if (backToTop) backToTop.classList.toggle('is-visible', y > 600);
      waiting = false;
    };

    // requestAnimationFrame keeps the scroll handler cheap
    window.addEventListener('scroll', () => {
      if (!waiting) {
        waiting = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });

    update();
  }

  /* ---------- 4. Highlight the current section in the nav ---------- */
  function initActiveNav() {
    if (!('IntersectionObserver' in window)) return;

    const links = $$('.nav-list a');
    const sections = links
      .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- 5. Portfolio category filtering ---------- */
  function initPortfolioFilter() {
    const buttons = $$('.filter-btn');
    const cards = $$('.project-card');
    const status = $('#filter-status');
    if (!buttons.length || !cards.length) return;

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        let shown = 0;

        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));

        cards.forEach((card) => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.hidden = !match;
          if (match) {
            shown += 1;
            // Restart the small fade-in each time a card appears
            card.classList.remove('is-entering');
            void card.offsetWidth;
            card.classList.add('is-entering');
          }
        });

        // Announced to screen readers through the aria-live region
        if (status) {
          const label = filter === 'all' ? '' : ` in ${button.textContent}`;
          status.textContent = `Showing ${shown} of ${cards.length} projects${label}`;
        }
      });
    });
  }

  /* ---------- 6. Project details dialog ---------- */
  function initProjectDialog() {
    const dialog = $('#project-dialog');
    if (!dialog) return;

    const image = $('#project-dialog-img');
    const tag = $('#project-dialog-tag');
    const title = $('#project-dialog-title');
    const body = $('#project-dialog-body');
    const cta = $('#project-dialog-cta');

    const open = (card) => {
      const cardImage = $('img', card);
      const details = $('.project-details', card);

      image.src = cardImage.getAttribute('src');
      image.alt = cardImage.alt;
      tag.textContent = $('.project-tag', card).textContent;
      title.textContent = $('h3', card).textContent;

      // Copy the hidden details from the card (the content lives in the HTML)
      const copy = details.cloneNode(true);
      copy.hidden = false;
      body.replaceChildren(copy);

      cta.dataset.service = card.dataset.service || '';
      cta.dataset.message = `I'd like a project similar to ${title.textContent}.`;

      document.body.classList.add('modal-open');
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    };

    $$('.js-project-open').forEach((button) => {
      button.addEventListener('click', () => open(button.closest('.project-card')));
    });

    dialog.addEventListener('click', (event) => {
      const clickedBackdrop = event.target === dialog;
      if (clickedBackdrop || event.target.closest('[data-close-dialog], #project-dialog-cta')) {
        dialog.close();
      }
    });

    dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  }

  /* ---------- 7. Testimonial slider ---------- */
  function initTestimonialSlider() {
    const root = $('.slider');
    const track = $('#testimonial-track');
    if (!root || !track) return;

    const slides = $$('.slide', track);
    const dotsWrap = $('.slider-dots', root);
    const prev = $('.slider-prev', root);
    const next = $('.slider-next', root);
    const toggle = $('.slider-toggle', root);
    const INTERVAL = 6500;

    let index = 0;
    let timer = null;
    let playing = !reducedMotion.matches; // never start moving on its own for reduced-motion users
    let hovering = false;

    // One dot per slide
    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slider-dot';
      dot.setAttribute('aria-label', `Show testimonial ${i + 1} of ${slides.length}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(${-index * 100}%)`;
      slides.forEach((slide, k) => {
        const active = k === index;
        slide.toggleAttribute('inert', !active); // hidden slides cannot be focused
        slide.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach((dot, k) => {
        if (k === index) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    }

    function start() {
      stop();
      if (playing && !hovering) timer = setInterval(() => goTo(index + 1), INTERVAL);
    }
    function stop() { clearInterval(timer); timer = null; }

    function setPlaying(value) {
      playing = value;
      toggle.dataset.state = playing ? 'playing' : 'paused';
      toggle.setAttribute('aria-label', playing ? 'Pause automatic slideshow' : 'Start automatic slideshow');
      track.setAttribute('aria-live', playing ? 'off' : 'polite'); // announce changes only when not auto-rotating
      start();
    }

    prev.addEventListener('click', () => goTo(index - 1));
    next.addEventListener('click', () => goTo(index + 1));
    toggle.addEventListener('click', () => setPlaying(!playing));

    // Pause while the pointer or keyboard focus is inside the slider
    root.addEventListener('mouseenter', () => { hovering = true; stop(); });
    root.addEventListener('mouseleave', () => { hovering = false; start(); });
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    // Arrow keys move between slides
    root.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') goTo(index - 1);
      if (event.key === 'ArrowRight') goTo(index + 1);
    });

    // Swipe on touch screens
    let touchStartX = 0;
    root.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', (event) => {
      const distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) > 50) goTo(index + (distance < 0 ? 1 : -1));
    }, { passive: true });

    goTo(0);
    setPlaying(playing);
  }

  /* ---------- 8. Contact form validation ---------- */
  const fieldLabels = {
    name: 'Full name',
    email: 'Email address',
    phone: 'Phone number',
    service: 'Service',
    message: 'Project details',
  };

  // One rule per field. Each returns an error message, or an empty string when the value is valid.
  const rules = {
    name: (value) => (/^[A-Za-z]+ [A-Za-z]+$/.test(value.trim()) ? '' : 'Enter exactly two names using letters only.'),
    email: (value) => (/^[A-Za-z0-9._%+-]+@gmail\.com$/i.test(value.trim()) ? '' : 'Enter a valid Gmail address, for example name@gmail.com.'),
    phone: (value) => {
      const digits = value.replace(/[\s\-().]/g, '');
      const kenyan = /^(?:\+?254|0)[17]\d{8}$/.test(digits);   // 07xx, 01xx or +254 formats
      const international = /^\+[1-9]\d{7,14}$/.test(digits);
      return kenyan || international ? '' : 'Enter a valid phone number, for example 0712 345 678 or +254 712 345 678.';
    },
    service: (value) => (value ? '' : 'Choose the service you need.'),
    message: (value) => (value.trim().length >= 10 ? '' : 'Write at least 10 characters so we understand your request.'),
  };

  function validateField(field) {
    let message = '';
    if (field.required && !field.value.trim()) message = `${fieldLabels[field.name]} is required.`;
    else if (rules[field.name]) message = rules[field.name](field.value);

    const errorBox = document.getElementById(`${field.id}-error`);
    if (errorBox) errorBox.textContent = message;
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    return message === '';
  }

  // Called by the "Request this service" / "Choose ..." buttons
  function prefillContactForm(service, message) {
    const select = $('#service');
    const textarea = $('#message');
    if (select && service && Array.from(select.options).some((o) => o.value === service)) {
      select.value = service;
      validateField(select);
    }
    // Only overwrite the message when it is empty or was filled in by a previous button
    if (textarea && message && (!textarea.value.trim() || textarea.dataset.autofilled === 'true')) {
      textarea.value = message;
      textarea.dataset.autofilled = 'true';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;

    const fields = $$('input, select, textarea', form);
    const status = $('#form-status');
    const submit = $('#submit-btn');
    const message = $('#message');
    const counter = $('#message-count');

    const showStatus = (type, text) => {
      status.className = `form-status is-${type}`;
      status.textContent = text;
    };

    // Validate when leaving a field, then re-check on every keystroke once an error is showing
    fields.forEach((field) => {
      field.addEventListener('blur', () => {
        if (field.value !== '' || field.dataset.touched) validateField(field);
      });
      field.addEventListener('input', () => {
        field.dataset.touched = 'true';
        if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      });
      field.addEventListener('change', () => validateField(field));
    });

    message.addEventListener('input', () => {
      counter.textContent = `${message.value.length} / ${message.maxLength}`;
      if (message.dataset.autofilled === 'true' && document.activeElement === message) delete message.dataset.autofilled;
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const invalid = fields.filter((field) => !validateField(field));
      if (invalid.length) {
        const count = invalid.length;
        showStatus('error', `Please fix ${count} ${count === 1 ? 'field' : 'fields'} below and try again.`);
        invalid[0].focus();
        return;
      }

      // Demonstration only: there is no server, so we simulate a short "sending" delay
      submit.disabled = true;
      submit.textContent = 'Sending...';
      showStatus('info', 'Checking your details...');

      setTimeout(() => {
        const firstName = $('#name').value.trim().split(/\s+/)[0];
        form.reset();
        fields.forEach((field) => {
          field.setAttribute('aria-invalid', 'false');
          delete field.dataset.touched;
        });
        $$('.field-error', form).forEach((box) => { box.textContent = ''; });
        delete message.dataset.autofilled;
        counter.textContent = `0 / ${message.maxLength}`;

        submit.disabled = false;
        submit.textContent = 'Send message';
        showStatus('success', `Thank you, ${firstName}. Your details passed validation.`);
      }, 900);
    });
  }

  /* ---------- 9. Dynamic copyright year ---------- */
  function initYear() {
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ---------- 10. Scroll reveal and counting statistics ---------- */
  function initReveal() {
    const items = $$('.reveal');
    if (!items.length) return;

    // Show everything straight away when animation is not wanted or not supported
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    // Stagger siblings slightly so grids do not appear all at once
    const counters = new Map();
    items.forEach((item) => {
      const n = counters.get(item.parentElement) || 0;
      item.style.setProperty('--reveal-delay', `${Math.min(n, 5) * 70}ms`);
      counters.set(item.parentElement, n + 1);
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach((item) => observer.observe(item));
  }

  function initCounters() {
    const counters = $$('[data-count]');
    if (!counters.length || reducedMotion.matches || !('IntersectionObserver' in window)) return;

    const animate = (el) => {
      const end = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out
        el.textContent = Math.round(end * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach((el) => {
      el.textContent = '0' + (el.dataset.suffix || '');
      observer.observe(el);
    });
  }

  /* ---------- 11. Image fallback ---------- */
  function initImageFallback() {
    const placeholder = 'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><rect width="800" height="500" fill="#1A2A5A"/>' +
      '<text x="400" y="255" font-family="Arial, sans-serif" font-size="28" fill="#CBD5E1" text-anchor="middle">Image unavailable</text></svg>'
    );

    const useFallback = (img) => {
      if (img.dataset.fallback) return; // avoid an endless error loop
      img.dataset.fallback = 'true';
      img.src = placeholder;
    };

    $$('img').forEach((img) => {
      img.addEventListener('error', () => useFallback(img));
      // Handle images that already failed before this script ran
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) useFallback(img);
    });
  }

  /* ---------- Start everything ---------- */
  initNavToggle();
  initSmoothScroll();
  initScrollEffects();
  initActiveNav();
  initPortfolioFilter();
  initProjectDialog();
  initTestimonialSlider();
  initContactForm();
  initYear();
  initReveal();
  initCounters();
  initImageFallback();
})();
