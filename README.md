# Velune Hospital — concept website

A Next.js website for **Velune Hospital**, a fictional 250-bed multi-speciality hospital in Kochi, Kerala. It has 44 public pages: departments, doctors, treatments, a four-step appointment booking flow, emergency information, a health library and patient pages. It is built to work well for patients, search engines and AI agents.

> Velune Hospital is a concept. The hospital, its doctors, phone numbers, prices and patient stories are placeholders. The site says so in the footer and on every booking and contact confirmation. Bookings are not sent anywhere unless a webhook is configured.

## Quick start

```bash
nvm use            # Node 22 (>= 20.9 supported)
npm ci
npm run dev        # http://localhost:3000
```

Production build: `npm run build && npm start`.

## Scripts

| Script                    | What it does                                                                                            |
| ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `dev` / `build` / `start` | Next.js (Turbopack)                                                                                     |
| `lint` / `lint:fix`       | ESLint flat config (`eslint-config-next` core-web-vitals, TypeScript, Prettier)                         |
| `format` / `format:check` | Prettier with Tailwind class sorting                                                                    |
| `typecheck`               | `tsc --noEmit` (strict, `noUncheckedIndexedAccess`)                                                     |
| `test`                    | Vitest unit tests: booking slots, form validation, content integrity, llms.txt, ARD, CSP                |
| `test:e2e`                | Playwright: every page, the booking flow, agent endpoints and axe WCAG 2.2 AA checks, desktop and phone |
| `audit:deps`              | `npm audit` for production dependencies (high and above)                                                |
| `analyze`                 | Turbopack bundle analyzer                                                                               |
| `check`                   | lint + format + types + unit tests + build                                                              |

Run the browser tests against a running build with `E2E_BASE_URL=http://localhost:3100 PW_CHANNEL=chrome npm run test:e2e`.

## Stack

| Concern          | Choice                                                                             |
| ---------------- | ---------------------------------------------------------------------------------- |
| Framework        | Next.js 16.4 App Router, React 19.3, TypeScript 6 (strict)                         |
| Styling          | Tailwind CSS 4 (`@theme` tokens) plus component CSS in `src/app/globals.css`       |
| UI primitives    | Radix (Dialog for the mobile menu, Accordion for FAQs, Slot), cva, tailwind-merge  |
| Motion           | GSAP 3.15 (ScrollTrigger, SplitText, Flip), Motion for the booking steps, Lenis    |
| Data and state   | TanStack Query (live appointment times), Zustand (booking draft), Zod 4            |
| Server           | Server Actions for booking and contact, Route Handlers for the public API          |
| Fonts and images | Newsreader and Figtree, self-hosted; local photos through `next/image` (AVIF/WebP) |

## Where things live

```
src/
  app/                 routes, metadata files, llms.txt, /md, /api, /.well-known/ard.json
  content/             all copy and data: site, departments, doctors, care, library, routes
  components/          ui, layout, booking, doctors, contact, motion, agents
  sections/            page sections (home/*, shared/*)
  animations/          GSAP setup, scroll motion (MotionScope), smooth scrolling
  lib/                 booking, seo, ai, security, env
  assets/photos/       the photographs (stand-ins, see docs/ASSETS.md)
```

To change a doctor, department, price or phone number, edit the matching file in `src/content/`. Pages, JSON-LD, llms.txt, the Markdown renditions, `/doctors.json` and the sitemap all read from there.

## For search engines and AI agents

- Structured data on every page: `Hospital`, `Physician`, `MedicalWebPage`, `MedicalProcedure`, `FAQPage`, `BreadcrumbList`.
- `/llms.txt` and `/llms-full.txt`, plus a Markdown version of every page at `/md/...`. Requests that prefer `text/markdown` get it from the normal URL.
- `/doctors.json`, `GET /api/availability` and an OpenAPI description at `/openapi.json`.
- An Agentic Resource Discovery manifest at `/.well-known/ard.json`, advertised with a `Link: rel="ard"` header.
- WebMCP: five imperative tools (`search_doctors`, `list_departments`, `get_available_slots`, `start_appointment_booking`, `get_emergency_information`), and declarative `toolname` annotations on the search, doctor finder, booking and contact forms. An agent can only fill in the booking form; a person confirms every appointment.

WebMCP is behind a Chrome origin trial. Register the production domain at https://developer.chrome.com/origintrials and put the token in `NEXT_PUBLIC_WEBMCP_TOKEN`.

Lighthouse 13.6 (desktop) on the main pages: Performance 99–100, Accessibility 100, Best Practices 100, SEO 100, Agentic Browsing 100. Home on mobile (4× CPU throttle) scores 91–96 for Performance.

## Environment

See `.env.example`. Nothing is required for a demo deployment. For production set `NEXT_PUBLIC_SITE_URL`, and `BOOKING_WEBHOOK_URL` / `BOOKING_WEBHOOK_SECRET` to send bookings to a real system (each request is signed with HMAC-SHA256 in `X-Velune-Signature`).

## Deploying

Any Node host works (Vercel, Netlify, a container). Every page is static except `/api/availability`, the Server Actions and the Markdown negotiation in `src/proxy.ts`. Preview deployments are `noindex` automatically (`SITE_INDEXING=auto`).

## Docs

- `docs/DECISIONS.md`: why things are built the way they are
- `docs/SECURITY.md`: headers, CSP, inputs and rate limits
- `docs/ASSETS.md`: photographs, fonts and generated assets
- `AGENTS.md`: notes for coding agents working on this repo
