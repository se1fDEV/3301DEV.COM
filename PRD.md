# Product Requirements Document — 3301dev.com

## 1. Overview

| Field            | Value                                                        |
| ---------------- | ------------------------------------------------------------ |
| **Product Name** | 3301dev.com                                                  |
| **Author**       |                                                              |
| **Date**         | 2026-03-21                                                   |
| **Version**      | 1.0                                                          |
| **Status**       | Draft                                                        |
| **Description**  | Commercial website that helps small and medium-sized businesses (SMBs) find IT specialists, software developers, DevOps specialists, and support agents to solve various technical issues. |

## 2. Problem Statement

Small and medium-sized businesses often lack in-house IT expertise and struggle to find reliable, affordable IT specialists, software developers, DevOps engineers, and support agents. Searching across multiple platforms is time-consuming and expensive. **3301dev.com** provides a single destination where SMBs can browse services, choose a subscription plan, and get matched with the right human or AI-powered specialists.

## 3. Goals & Objectives

- Provide SMBs with easy access to IT specialists, developers, DevOps engineers, and support agents
- Offer transparent, tiered subscription pricing (Basic, Professional, Premium)
- Enable users to contact an AI agent for custom work-scope estimation and additional services
- Deliver a fast, lightweight website using only HTML/CSS — no frameworks

## 4. Target Users

| Persona              | Description                                                   | Key Needs                                        |
| -------------------- | ------------------------------------------------------------- | ------------------------------------------------ |
| SMB Owner / Manager  | Non-technical decision-maker at a small or medium business    | Affordable IT help, clear pricing, easy onboarding |
| SMB IT Lead          | Technical lead with limited team capacity                     | Access to specialized developers, DevOps, support |
| Startup Founder      | Early-stage founder needing on-demand technical resources     | Flexible plans, AI-assisted scoping              |

## 5. User Stories

| ID   | As a...            | I want to...                                     | So that...                                              | Priority |
| ---- | ------------------ | ------------------------------------------------ | ------------------------------------------------------- | -------- |
| US-1 | SMB owner          | browse available IT services and specialists      | I can understand what 3301dev.com offers                 | Must     |
| US-2 | SMB owner          | compare subscription plans and pricing            | I can choose the plan that fits my budget                | Must     |
| US-3 | SMB IT lead        | contact support via the Support page              | I can get help with onboarding or technical questions    | Must     |
| US-4 | User               | start a free trial                                | I can evaluate the service before committing             | Must     |
| US-5 | User               | chat with an AI agent about additional services   | I can get a work-scope estimate without waiting for a human | Should |
| US-6 | User               | see which team members are human vs AI agents     | I understand who will be handling my request             | Should   |

## 6. Site Structure (Pages)

| #  | Page                  | Purpose                                                                       |
| -- | --------------------- | ----------------------------------------------------------------------------- |
| 1  | **Products**          | Showcase services: IT specialists, software developers, DevOps, support agents |
| 2  | **Plans & Pricing**   | Display subscription tiers and pricing details                                |
| 3  | **Support**           | Contact form, FAQ, and AI agent chat for work-scope estimation                |
| 4  | **Try Free**          | Free-trial sign-up / call-to-action landing page                             |

## 7. Teams

| Team              | Description                                                                 |
| ----------------- | --------------------------------------------------------------------------- |
| **Human Agents**  | IT specialists, software developers, DevOps engineers, and support staff    |
| **AI Agents**     | AI-powered assistants that handle work-scope estimation, initial triage, and automated support |

## 8. Subscription Plans

| Plan             | Price        | Includes                                                                 |
| ---------------- | ------------ | ------------------------------------------------------------------------ |
| **Basic**        | From $25/mo  | Access to support agents, basic issue resolution                         |
| **Professional** | From $100/mo | Everything in Basic + dedicated developers and DevOps specialists        |
| **Premium**      | From $250/mo | Everything in Professional + priority response, AI agent consultations, custom scoping |

> **Additional services:** Users who need work beyond their plan can contact an AI agent to estimate the scope and cost of additional work.

## 9. Functional Requirements

| ID   | Requirement                  | Description                                                                 | Priority | Status      |
| ---- | ---------------------------- | --------------------------------------------------------------------------- | -------- | ----------- |
| FR-1 | Products page                | Display all service categories (IT, Dev, DevOps, Support) with descriptions | Must     | Not Started |
| FR-2 | Plans & Pricing page         | Show three subscription tiers with features and pricing                     | Must     | Not Started |
| FR-3 | Support page                 | Provide contact form and FAQ section                                        | Must     | Not Started |
| FR-4 | Try Free page                | Free-trial sign-up form with CTA                                           | Must     | Not Started |
| FR-5 | AI Agent chat widget         | Embedded chat on Support page for work-scope estimation                     | Should   | Not Started |
| FR-6 | Responsive layout            | Pages must render correctly on desktop and mobile                           | Must     | Not Started |
| FR-7 | Consistent navigation        | Shared header/footer nav across all 4 pages                                | Must     | Not Started |
| FR-8 | Language switcher (EN/UA)    | User can toggle between English and Ukrainian via a header control. All visible text is translated. Language preference is saved to localStorage. | Must     | Not Started |

## 10. Non-Functional Requirements

| Category      | Requirement                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| Performance   | Pages load in under 2 seconds on 3G connections (no framework overhead)     |
| Security      | HTTPS enforced; form inputs sanitized server-side                           |
| Scalability   | Static HTML/CSS — easily served via CDN                                     |
| Accessibility | WCAG 2.1 AA compliance; keyboard-navigable; sufficient color contrast       |
| Reliability   | 99.9% uptime target via static hosting                                      |

## 11. Design & UX

### Color Palette

| Role       | Color   | Hex (suggested) |
| ---------- | ------- | --------------- |
| Primary    | Green   | #2E7D32         |
| Background | White   | #FFFFFF         |
| Text       | Black   | #1A1A1A         |
| Accent     | Green   | #43A047         |

### Tech Stack

- **HTML5** — semantic markup
- **CSS3** — custom styles, CSS variables for theming
- **No frameworks** — no Bootstrap, Tailwind, React, etc.

### Layout Guidelines

- Clean, professional design targeting business users
- Green CTA buttons on white backgrounds
- Black text for readability
- Consistent spacing and typography across all 4 pages

## 12. Technical Considerations

- Pure HTML/CSS — no JavaScript frameworks; vanilla JS only where necessary (e.g., AI agent chat widget)
- Static site can be hosted on any CDN or static hosting provider
- AI agent integration will require a lightweight JS embed or iframe for the chat widget on the Support page
- Forms on Support and Try Free pages will need a backend endpoint or third-party form service

## 13. Success Metrics

| Metric                    | Target        | Measurement Method          |
| ------------------------- | ------------- | --------------------------- |
| Monthly unique visitors   | 1,000+        | Analytics                   |
| Free trial sign-ups       | 5% of visitors | Form submissions            |
| Plan conversion rate      | 2% of trials  | Subscription tracking       |
| Support response time     | < 24 hours    | Ticket / chat logs          |
| Page load time            | < 2 seconds   | Lighthouse / WebPageTest    |

## 14. Timeline & Milestones

| Milestone                        | Target Date | Owner |
| -------------------------------- | ----------- | ----- |
| PRD finalized                    |             |       |
| Design mockups approved          |             |       |
| HTML/CSS development complete    |             |       |
| AI agent chat integration        |             |       |
| QA & cross-browser testing       |             |       |
| Launch                           |             |       |

## 15. Risks & Mitigations

| Risk                                        | Impact | Likelihood | Mitigation                                      |
| ------------------------------------------- | ------ | ---------- | ----------------------------------------------- |
| AI agent chat adds JS complexity             | Medium | Medium     | Keep widget isolated; lazy-load script           |
| Limited styling options without frameworks   | Low    | Low        | Use CSS custom properties and modern CSS layouts |
| Low initial traffic                          | High   | Medium     | SEO optimization, content marketing, paid ads    |

## 16. Out of Scope

- User authentication / dashboard (future phase)
- Payment processing (handled off-site or in a future phase)
- Blog or content management system
- Mobile native apps

## 17. Open Questions

- Which AI agent platform will be used for the chat widget?
- Will form submissions go to email, a CRM, or a custom backend?
- Are there specific SEO keywords to target for SMB IT services?

## 18. Appendix

### Page Map

```
3301dev.com
├── index.html          → Products
├── pricing.html        → Plans & Pricing
├── support.html        → Support
└── try-free.html       → Try Free
```

### Asset Structure

```
3301dev.com
├── css/
│   └── styles.css
├── images/
├── index.html
├── pricing.html
├── support.html
├── try-free.html
└── PRD.md
```
