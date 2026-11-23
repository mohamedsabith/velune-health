# Engineering decisions

Decisions taken while building Velune Hospital, with the reasons. Versions checked on 23 November 2026.

## Framework

- **Next.js 16.4 (App Router, Turbopack), React 19.3, TypeScript 6.** Every page is statically generated. Dynamic work is limited to `/api/availability`, two Server Actions (booking, contact) and Markdown negotiation in `src/proxy.ts`.
- **Built on the AZURE project's foundation.** Security headers, rate limiting, env validation, smooth scrolling, the llms.txt/Markdown pipeline and the CI setup were carried over and adapted, so they arrive already tested.
- **Hook rules from the React Compiler era are enforced.** No `setState` inside effects: the booking step comes from a lazy initial state, the confirmation screen uses `useSyncExternalStore`, and the mobile menu closes from link clicks.

## Design direction

The homepage follows the "Moments" direction the owner chose from three: three columns of hospital photographs that drift at different speeds beside the headline, after a short opening where the logo's plus opens into the page. Every other page uses the same type, colour and spacing system.

Owner decisions: no 3D, no Theatre.js (GSAP covers the timelines), no cursor or tilt effects, no pinned sections, HD photos only. Rive was left out for now; small icon motion is done in GSAP. No video was made.

## Motion

| GSAP                                                    | Motion (`motion/react`)        |
| ------------------------------------------------------- | ------------------------------ |
| The opening, the hero entrance and the drifting columns | Booking step panels            |
| Scroll reveals, photo masks, SplitText headings         | Reduced-motion detection there |
| The emergency band, facilities slideshow, map drawing   |                                |
| Doctor filter (Flip), the lit quote, parallax           |                                |

- Scroll setup runs when the browser is idle, and reads every element's position before writing any style, so the browser lays the page out once. This took mobile Total Blocking Time on Home from about 490 ms to 210–360 ms.
- Only content below the fold starts hidden. With reduced motion, or without JavaScript, everything is visible.
- First-screen text is revealed with `clip-path` and transforms, not opacity, so an accessibility check that runs mid-animation never sees half-faded text. The lit quote starts at 55% opacity, which keeps its large text above 3:1 contrast.
- The opening plays once per browser session and can be replayed from the footer.

## Booking

- Four steps: department, doctor, date and time, your details. A summary beside the form shows every choice and links back to each step.
- The URL pre-fills it (`/book?doctor=meera-k&date=…&time=…`). Doctor pages, departments and AI agents use this.
- Free times come from `/api/availability`. They are generated deterministically per doctor and date, in Kochi time whatever the server's time zone, and days with no free time left are not offered.
- The server action validates with the same Zod schema as the browser, rate-limits, re-checks the slot, then posts to `BOOKING_WEBHOOK_URL` signed with HMAC-SHA256. Without a webhook it answers in labelled demonstration mode.
- The draft is kept in `sessionStorage` (Zustand persist) so a refresh doesn't lose it.
- Before the browser reads the URL, the server renders step one with the same layout, so nothing moves when the live form takes over (layout shift 0).

## Agent readiness

- llms.txt, llms-full.txt and a Markdown rendition of every page; `Accept: text/markdown` is honoured on normal URLs through `src/proxy.ts`.
- `/doctors.json`, `/api/availability` and `/openapi.json` describe the read-only data.
- `/.well-known/ard.json` follows the Agentic Resource Discovery draft (v0.91), which Lighthouse 13 checks. It is advertised with a `Link: rel="ard"` header. An `Agentmap:` line in robots.txt was tried and removed, because Lighthouse's robots.txt audit reports it as an unknown directive.
- WebMCP: imperative tools are registered with `document.modelContext.registerTool` (falling back to `navigator.modelContext`). The four forms also carry declarative `toolname` / `tooldescription` / `toolparamdescription` attributes. None auto-submits.

## Images and fonts

- Photos are local files imported statically, so `next/image` serves AVIF/WebP at the right width with a blur placeholder, and no third-party image host is involved.
- Newsreader and Figtree are self-hosted with `next/font/local`.

## Zod in the browser

Zod 4 probes `Function('')` to decide whether to compile parsers. Under a CSP without `'unsafe-eval'`, Chrome records that probe as a violation, and Lighthouse Best Practices dropped to 96. `z.config({ jitless: true })` removes the probe.
