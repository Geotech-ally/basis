# Nuru Tech

A responsive, accessible business services website for a fictional technology agency in Kenya. The site presents agency services, pricing, portfolio work, client testimonials and a project enquiry form.

## Overview

Nuru Tech is a static front-end project built with HTML5, CSS3 and vanilla JavaScript. It demonstrates how to create a complete, production-style marketing website without frameworks, external component libraries or a build step.

The included company information and project examples are sample content for demonstration purposes. The contact form validates submissions in the browser only and does not send or store data.

## Features

- Responsive single-page layout for mobile, tablet and desktop screens
- Sticky navigation with active-section highlighting
- Accessible mobile menu with keyboard and ARIA support
- Hero section, company profile, values and animated statistics
- Six technology services with direct enquiry actions
- Three pricing packages in Kenyan shillings
- Filterable portfolio with six project examples
- Native modal dialogs for project details
- Keyboard, swipe and autoplay-capable testimonial carousel
- Client-side contact form validation
- Smooth in-page navigation and back-to-top controls
- Scroll reveal effects and reduced-motion support
- Local SVG assets with image fallback handling
- SEO and social metadata

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure, forms and accessible interface markup |
| CSS3 | Responsive layouts, design tokens, transitions and animations |
| Vanilla JavaScript | Navigation, filtering, dialogs, validation and UI interactions |
| SVG | Logo, favicon, icons, project artwork and avatars |
| Google Fonts | Optional Bricolage Grotesque and DM Sans typography |

No package manager or build tool is required.

## Project Structure

```text
.
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── icons/
│   │   ├── favicon.svg
│   │   └── logo.svg
│   └── images/
│       ├── avatar-achieng.svg
│       ├── avatar-brian.svg
│       ├── avatar-faith.svg
│       ├── project-afyatrack.svg
│       ├── project-duka-fresh.svg
│       ├── project-maji-safi.svg
│       ├── project-pesa-wallet.svg
│       ├── project-sacco-ledger.svg
│       └── project-shamba-market.svg
└── README.md
```

## Getting Started

### Open Directly

Open `index.html` in a modern web browser. This is sufficient for basic viewing.

### Run a Local Server

Using Python:

```bash
cd /path/to/nuru-tech
python3 -m http.server 8000
```

Visit `http://localhost:8000`.

Alternatively, use the Live Server extension in VS Code or any static file server.

## Main Interactions

### Navigation

The header remains visible while scrolling and highlights the section currently in view. The navigation menu opens and closes from the menu button and supports Escape-key dismissal.

### Portfolio

Portfolio cards can be filtered by websites, web applications, UI/UX or databases. Selecting **View details** opens a native dialog populated from the selected project's HTML content.

### Testimonials

The testimonial carousel supports:

- Previous and next controls
- Direct navigation dots
- Arrow-key navigation
- Touch and swipe gestures
- Automatic playback with hover and focus pausing
- A visible pause/play control
- Reduced-motion support

### Enquiry Form

The form provides real-time field validation for names, email addresses, phone numbers, service selection and message content. Errors are associated with inputs using `aria-describedby`, and focus moves to the first invalid field.

Because the project has no backend, submissions are only simulated in the browser. To receive enquiries, connect the submit handler in `js/script.js` to a form service or server endpoint.

## Accessibility

The implementation includes:

- Semantic HTML landmarks and a clear heading hierarchy
- A skip-to-main-content link
- Visible keyboard focus styles
- Labelled form controls and descriptive error messages
- ARIA states for navigation and filters
- Live regions for dynamic status updates
- Keyboard-accessible dialogs and carousel controls
- Respects for `prefers-reduced-motion`
- Layouts that remain usable at narrow viewport widths

## Responsive Design

CSS uses a mobile-first approach with flexible grid and flex layouts. Layouts expand at viewport breakpoints to present additional columns, wider navigation and larger content sections on tablets and desktops.

## Customising the Site

1. Update the company name, page title and metadata in `index.html`.
2. Replace placeholder contact details and social URLs.
3. Update service, pricing and portfolio content directly in `index.html`.
4. Replace the sample project artwork and testimonial avatars in `assets/`.
5. Change the shared colour, typography and spacing values in `css/style.css`.
6. Add the required form submission endpoint in `js/script.js`.

## Deployment

This project can be deployed to any static hosting provider.

For GitHub Pages:

1. Push the repository to GitHub.
2. Open **Settings > Pages**.
3. Select the repository branch and `/ (root)` folder.
4. Save to publish the site.

It can also be deployed to Netlify, Cloudflare Pages, Vercel or an internal static web server.

## Browser Compatibility

The site targets modern evergreen browsers, including Chrome, Edge, Firefox and Safari. Some features—such as native dialogs and `IntersectionObserver`—require support or a local fallback.

## Known Limitations

- Business details, statistics, prices and testimonials are demonstration content.
- The contact form does not send email or persist submissions.
- Portfolio and testimonial assets are illustrative SVG artwork rather than verified client case studies.
- External Google Fonts require an internet connection; local system fonts provide a fallback.

## Future Improvements

- Connect the enquiry form to a backend or form provider
- Add automated HTML, CSS and JavaScript tests
- Add analytics and privacy-consistent cookie handling
- Replace sample content with verified client material
- Add English and Swahili language options
- Introduce an accessible dark theme

## License

Add a project license before distributing or publishing this repository.
