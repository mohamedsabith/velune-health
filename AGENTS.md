<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Working on Velune Hospital

- Content and data live in `src/content/`. Change copy there, not in components; pages, JSON-LD, llms.txt, `/md` and `/doctors.json` all read from it.
- Run `npm run check` before committing, and `npm run test:e2e` against a production build when you touch pages, the booking flow or motion.
- Design rules the owner set:
  - no cursor-following, custom cursors or 3D tilt effects;
  - no pinned sections and no empty full-screen gaps while scrolling;
  - photographs are sharp and high resolution, never blurred, with no third-party logos;
  - colours are royal blue and gold; fonts are Newsreader (headings) and Figtree (text).
- Motion: GSAP for timelines and scroll, Motion only for the booking step transitions. Respect `prefers-reduced-motion` and keep text animations clip- or transform-based in the first screen, so contrast checks never catch half-faded text.
- Agents may fill in the booking form (WebMCP) but must never submit it: a person confirms every appointment.
- Everything about the hospital is a placeholder. Keep the demo notice in the footer and the confirmation screens.
