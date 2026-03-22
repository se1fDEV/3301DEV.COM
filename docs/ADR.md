# Architecture Decision Records — 3301dev.com

> Lightweight ADR log for architectural and technical decisions.
> Format: [Michael Nygard's ADR template](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
> Status values: **Proposed** | **Accepted** | **Deprecated** | **Superseded**

---

## ADR-001: Static HTML/CSS/JS with No Frameworks

**Date:** 2026-03-21
**Status:** Accepted

### Context
The site targets SMBs looking for IT specialists. It needs fast load times, simple deployment, and minimal maintenance. Frameworks like React, Vue, or Next.js add complexity, build steps, and dependency management overhead.

### Decision
Use pure HTML5, CSS3, and vanilla JavaScript with no build step and no external dependencies.

### Consequences
- **Positive:** Zero build tooling, instant deploys, CDN-friendly, no dependency vulnerabilities, any developer can contribute without framework knowledge
- **Negative:** No component reuse across pages (header/footer duplicated), manual DOM manipulation, no hot-module reload during development

---

## ADR-002: Dark Theme via CSS Custom Properties

**Date:** 2026-03-21
**Status:** Accepted

### Context
The PRD originally specified a white/light theme. However, the target audience (developers, DevOps engineers, IT specialists) strongly prefers dark interfaces. CSS custom properties allow centralized theming.

### Decision
Implement a dark theme using CSS variables defined in `:root`:
- `--color-bg: #121212`
- `--color-bg-surface: #1E1E1E`
- `--color-bg-elevated: #252525`
- `--color-text: #E8E8E8`
- `--color-primary: #43A047`

All color values are referenced via `var()` — never hardcoded in HTML or component styles.

### Consequences
- **Positive:** Single source of truth for colors, easy to adjust or add a light-theme toggle later, consistent appearance across all pages
- **Negative:** Supersedes the PRD's original white theme specification

---

## ADR-003: Client-Side i18n Engine (EN/UA)

**Date:** 2026-03-21
**Status:** Accepted

### Context
The site must support English and Ukrainian. Options considered:
1. Separate HTML files per language (e.g., `index.ua.html`)
2. Third-party i18n library (i18next, FormatJS)
3. Custom lightweight translation engine

### Decision
Build a custom i18n IIFE (`js/i18n.js`) with:
- EN and UA translation dictionaries (200+ keys)
- `data-i18n` attribute for element innerHTML
- `data-i18n-ph` attribute for input placeholders
- `localStorage` persistence for language preference
- `window.i18n` API: `.t(key)`, `.lang()`, `.apply(lang)`
- Sets `document.documentElement.lang` for accessibility

### Consequences
- **Positive:** Zero external dependencies, full control over translation behavior, tiny payload (~8 KB), translations co-located in a single file for easy editing
- **Negative:** All translations live in one JS file (could grow unwieldy with more languages), no pluralization or ICU message format support, Jest coverage shows 0% because the file is loaded via `eval()` in tests

---

## ADR-004: Inline SVG Icons (No Icon Libraries)

**Date:** 2026-03-21
**Status:** Accepted

### Context
The site initially used emoji characters for icons. These render inconsistently across platforms and lack visual polish. Font icon libraries (Font Awesome, Material Icons) add external dependencies and large payloads.

### Decision
Replace all icons with inline SVG elements using Feather/Heroicons-style stroked paths. SVGs are embedded directly in HTML — no sprite sheets, no icon fonts.

### Consequences
- **Positive:** Pixel-perfect rendering on all platforms, no external requests, icons inherit `currentColor` for easy theming, zero additional payload beyond the SVG paths
- **Negative:** HTML files are slightly larger due to inline SVG markup, adding new icons requires manual SVG insertion

---

## ADR-005: AI Chat Widget with Pattern Matching

**Date:** 2026-03-21
**Status:** Accepted

### Context
The PRD requires an AI-powered chat on the support page to demonstrate the company's AI capabilities. A real AI backend is not available at launch.

### Decision
Implement a client-side chat widget on `support.html` that uses keyword-based pattern matching to simulate AI responses. Responses are hardcoded for common queries (pricing, services, support). User input is sanitized to prevent XSS.

### Consequences
- **Positive:** No backend dependency, instant responses, demonstrates the concept to visitors, XSS-safe output
- **Negative:** Limited to pre-programmed responses, cannot handle open-ended queries, clearly a demo — needs a real backend (LLM API) for production
- **Known Gap:** Tracked as a known gap in `.memory-bank/project.md`

---

## ADR-006: Three-Tier Subscription Pricing

**Date:** 2026-03-21
**Status:** Accepted

### Context
The business needs a clear pricing structure that scales from small teams to enterprise needs. A monthly/annual billing option encourages longer commitments.

### Decision
Three pricing tiers with monthly and annual billing (20% annual discount):

| Tier | Monthly | Annual (per month) |
|------|---------|-------------------|
| Basic | $25 | $20 |
| Professional | $100 | $80 |
| Premium | $250 | $200 |

A JavaScript toggle on `pricing.html` switches displayed prices. Tier data is stored in `data-monthly` and `data-annual` HTML attributes.

### Consequences
- **Positive:** Clean separation of pricing data and display logic, easy to update prices by changing data attributes, annual discount incentivizes longer subscriptions
- **Negative:** Pricing is hardcoded in HTML — dynamic pricing requires a backend

---

## ADR-007: Jest + jsdom for Testing

**Date:** 2026-03-21
**Status:** Accepted

### Context
The project has no build step or transpilation. Testing must work with raw HTML files and vanilla JS. Browser-based test runners (Cypress, Playwright) are heavyweight for a static site.

### Decision
Use Jest with `jest-environment-jsdom` to test HTML structure, navigation consistency, i18n completeness, interactive features, accessibility, and CSS properties. Test helpers (`__tests__/helpers.js`) provide `readPageHTML()` and `readI18nSource()` utilities.

**240 tests across 6 suites**, all passing.

### Consequences
- **Positive:** Fast test execution, no browser required, validates all 4 pages and the i18n engine, catches regressions in structure and content
- **Negative:** jsdom has quirks — `document.write()` executes inline scripts (must strip before setup), `form.name` collides with built-in property, `eval()` loading means no coverage for `i18n.js`
- **Workarounds:** Documented in `.memory-bank/project.md` under "Testing Gotchas"

---

## ADR-008: Language Switcher in Navigation Bar

**Date:** 2026-03-21
**Status:** Accepted

### Context
The language switcher (EN/UA) was initially placed as a standalone `<div>` in the header, outside the navigation. This created layout inconsistency and didn't collapse properly on mobile.

### Decision
Move the language switcher into the `<nav>` as a `<li class="lang-switcher">` element positioned between the "Support" and "Try Free" nav items. Styled as compact pill buttons (`EN | UA`) with the active language highlighted in `--color-primary`.

### Consequences
- **Positive:** Consistent with nav layout, collapses into mobile hamburger menu, no extra DOM structure outside nav
- **Negative:** Slightly unconventional placement (most sites put language switcher at the far right or in the footer)

---

## ADR-009: Form Validation — Client-Side Only

**Date:** 2026-03-21
**Status:** Accepted

### Context
The contact form (`support.html`) and trial form (`try-free.html`) collect user input. There is no backend server to process submissions at launch.

### Decision
Implement client-side validation only using inline JavaScript. Validate required fields (name, email format, message length). Display error messages using `window.i18n.t()` for localized feedback. Forms show a success message on valid submission but do not POST data.

### Consequences
- **Positive:** Immediate user feedback, i18n-compatible error messages, no backend dependency for validation logic
- **Negative:** No actual data submission — forms are presentational only until a backend is implemented
- **Known Gap:** Tracked in `.memory-bank/project.md`

---

## ADR-010: Responsive Design with Mobile-First Breakpoints

**Date:** 2026-03-21
**Status:** Accepted

### Context
SMB decision-makers browse on various devices. The site must work on desktop, tablet, and mobile.

### Decision
Use CSS Grid for page layouts with two responsive breakpoints:
- `768px` — tablet (2-column grids collapse to 1, nav becomes hamburger menu)
- `480px` — small mobile (further font/padding reductions)

The header uses a sticky position. Mobile nav is toggled via a `.nav-toggle` button that adds `.open` class to `#mainNav`.

### Consequences
- **Positive:** Fully responsive without a CSS framework, lightweight implementation, hamburger menu for mobile
- **Negative:** Breakpoint values are hardcoded in CSS (not configurable), no container queries for component-level responsiveness

---

## ADR-011: No External Dependencies

**Date:** 2026-03-21
**Status:** Accepted

### Context
External dependencies (CDN-hosted libraries, npm runtime packages) introduce supply chain risk, CORS issues, and performance penalties. The only dev dependencies are Jest and jsdom for testing.

### Decision
Zero runtime dependencies. All functionality is implemented with native browser APIs. The only `devDependencies` are `jest` and `jest-environment-jsdom` for testing.

### Consequences
- **Positive:** No supply chain vulnerabilities, no CDN failures, minimal `node_modules`, fast page loads
- **Negative:** More manual code for features that libraries would provide (i18n, form validation, chat), no automatic polyfills for older browsers
