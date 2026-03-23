# 3301dev.com — Project Memory Bank

> **Purpose:** Shared context for all collaborators and AI assistants working on this project.
> Update this file when architecture, conventions, or key decisions change.

---

## Overview
- Commercial static website for SMBs to find IT specialists, developers, DevOps engineers, and support agents
- Repo: `github.com/ur3vau/3301DEV`
- PRD: `PRD.md` (v1.1, status: Implemented)

## Tech Stack
- Pure HTML5 + CSS3 + vanilla JS — **no frameworks**
- Dark theme (#121212 bg, #E8E8E8 text, #43A047 primary green)
- CSS variables in `:root` for theming (`css/styles.css`)

## Pages (4 total)
| Page | File | Key Content |
|------|------|-------------|
| Products | `index.html` | Services showcase (4 cards), teams (Human + AI), AI CTA |
| Plans & Pricing | `pricing.html` | 3 tiers (Basic $25, Pro $100, Premium $250), billing toggle, comparison table |
| Support | `support.html` | Contact form, FAQ (5 items), AI chat widget, contact links |
| Try Free | `try-free.html` | Trial signup form, 4 benefits, testimonial |

## Key JS Features (`js/i18n.js`)
- Full EN/UA translation engine as IIFE
- `window.i18n` API: `.t(key)`, `.lang()`, `.apply(lang)`
- Uses `data-i18n` for innerHTML, `data-i18n-ph` for placeholders
- Persists language to `localStorage`
- Sets `document.documentElement.lang` to `uk` for UA, `en` for EN

## Inline Scripts (per page)
- **All pages:** mobile nav toggle (`.nav-toggle` → `#mainNav.open`)
- **pricing.html:** billing toggle (monthly/annual, 20% discount)
- **support.html:** form validation (name, email, message fields), AI chat (pattern-matched responses, XSS-safe)
- **try-free.html:** trial form validation (`fullName`, `workEmail`)

## Conventions
- No build step — edit HTML/CSS/JS directly
- All user-visible text uses `data-i18n` keys (both EN and UA must be kept in sync)
- New pages must include: header with nav, footer grid, `js/i18n.js` script, mobile nav toggle
- CSS uses BEM-like class naming (`.pricing-card`, `.chat-bubble`, `.form-group`)
- Colors only via CSS variables — never hardcode hex in HTML

## File Structure
```
index.html              # Products page
pricing.html            # Plans & Pricing page
support.html            # Support page
try-free.html           # Try Free / trial page
PRD.md                  # Product Requirements Document (v1.1)
css/
  styles.css            # All styles, CSS variables, responsive breakpoints
js/
  i18n.js               # EN/UA translation engine
docs/
  ADR.md                # Architecture Decision Records (11 ADRs)
jest.config.js          # Jest configuration
package.json            # npm scripts (test)
__tests__/
  helpers.js            # Test utilities (readPageHTML, readI18nSource, ALL_PAGES)
  html-structure.test.js
  navigation.test.js
  i18n.test.js
  interactive.test.js
  accessibility-seo.test.js
  css-styles.test.js
.github/
  copilot-instructions.md  # Main Copilot instructions (auto-loaded)
.memory-bank/
  project.md            # This file
```

## Testing
- **Framework:** Jest + jest-environment-jsdom
- **Run:** `npm test` (= `jest --verbose --coverage`)
- **240 tests, 6 suites, all passing**

| Suite | Tests | Coverage Area |
|-------|-------|---------------|
| `html-structure.test.js` | 74 | DOCTYPE, meta, CSS/JS refs, page-specific elements |
| `navigation.test.js` | 34 | Nav consistency, active states, footer, lang switcher, link validity |
| `i18n.test.js` | 24 | EN/UA key completeness, engine behavior, localStorage, API |
| `interactive.test.js` | 30 | Form validation, billing toggle, AI chat, mobile nav |
| `accessibility-seo.test.js` | 46 | ARIA, labels, h1 count, SEO meta, PRD content requirements |
| `css-styles.test.js` | 32 | Variables, layout classes, components, responsive, dark theme |

### Testing Gotchas (jsdom)
- `document.write()` executes inline `<script>` tags — strip them before DOM setup in tests
- `form.name` collides with HTMLFormElement's built-in `name` property — use `document.getElementById()` instead
- Load i18n via `eval(readI18nSource())` — Jest coverage won't track eval'd code
- `new JSDOM()` constructor fails with "TextEncoder is not defined" — use the test environment's global `document` instead

## Known Gaps
- AI chat is demo-only (simulated pattern-matched responses) — needs backend for production
- Forms have client-side validation only — no backend submission endpoint
- Jest coverage shows 0% for `i18n.js` because it's loaded via `eval()`, not `require()`

## Decision Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-21 | Dark theme instead of PRD's white theme | Better developer/tech aesthetic for target audience |
| 2026-03-21 | Vanilla JS only, no frameworks | PRD requirement: fast, lightweight, CDN-friendly |
| 2026-03-21 | i18n via custom IIFE, not a library | Zero dependencies, full control, small payload |
| 2026-03-21 | Jest + jsdom for testing | Works with static HTML/CSS/JS without build tools |
