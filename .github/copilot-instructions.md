# 3301dev.com — Copilot Instructions

## Project Overview

Commercial static website for SMBs to find IT specialists, developers, DevOps engineers, and support agents.
Repo: `github.com/ur3vau/3301DEV` · PRD: `PRD.md` (v1.1, Implemented)

## Tech Stack

- Pure HTML5 + CSS3 + vanilla JS — **no frameworks, no build step**
- Dark theme via CSS variables in `:root` (`#121212` bg, `#E8E8E8` text, `#43A047` primary)
- i18n engine in `js/i18n.js` — EN/UA, `data-i18n` attributes, localStorage persistence

## Conventions

- All user-visible text must use `data-i18n` keys — keep EN and UA translations in sync
- Colors only via CSS variables — never hardcode hex values in HTML
- New pages must include: header with nav, footer grid, `js/i18n.js` script, mobile nav toggle inline script
- CSS uses BEM-like class naming (`.pricing-card`, `.chat-bubble`, `.form-group`)
- No external dependencies — keep the site lightweight and CDN-friendly

## Testing

- Jest + jest-environment-jsdom · Run: `npm test`
- 240 tests across 6 suites, all passing
- See `__tests__/helpers.js` for shared utilities (`readPageHTML`, `readI18nSource`, `ALL_PAGES`)

## Git & PR Workflow

- **Remotes:** `origin` → `ur3vau/3301DEV` (master) · `se1fdev` → `se1fDEV/3301DEV.COM` (main)
- **Direct push** to `origin master` — no PR required
- **PR workflow** for `se1fDEV/3301DEV.COM`:
  1. Create a feature branch from `master`: `git checkout -b <branch-name>`
  2. Push to se1fdev remote: `git push se1fdev <branch-name>`
  3. Open PR via CLI: `gh pr create --repo se1fDEV/3301DEV.COM --base main --head <branch-name> --title "..." --body "..."`
  4. After merge, clean up: `git checkout master && git branch -d <branch-name>`
- Always push to **both remotes** after work is complete

## Memory Bank

**Location:** `.memory-bank/project.md` (git-tracked)

Single source of truth for all project context — shared with collaborators and AI assistants.
Contains: architecture, conventions, file structure, testing details, decision log, known gaps.

### Workflow

1. **Starting work:** Read `.memory-bank/project.md` to load project context
2. **After significant changes:** Update `.memory-bank/project.md` with new decisions, conventions, or structural changes

### Rules for Memory Updates

- Keep entries concise — bullet points and tables, not prose
- Add to the Decision Log table when making architectural or tooling choices
- Update Known Gaps when issues are resolved or new ones are discovered
- Never remove history from the Decision Log — append only
