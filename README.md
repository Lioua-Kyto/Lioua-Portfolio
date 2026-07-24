# Lioua Zeddam — Portfolio

My personal site. An editorial, motion-forward portfolio built around one
idea: show the work plainly and let the systems behind it speak.

**Live:** _coming soon_

## Stack

- **Next.js 15** (App Router, React 19) · TypeScript, `strict`
- **Tailwind CSS v4** with a token-driven design system
- **GSAP** (ScrollTrigger, Flip) + **Lenis** for the scroll choreography
- **Zod** for typed, validated content
- **Vitest** (unit) · **Playwright** (Chromium + WebKit) · **Lighthouse CI**

## Getting started

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Scripts

| Command             | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the dev server                           |
| `npm run build`     | Production build                               |
| `npm run start`     | Serve the production build                     |
| `npm run typecheck` | `tsc --noEmit`                                 |
| `npm run lint`      | ESLint (strict, zero warnings)                 |
| `npm run test`      | Unit tests (Vitest)                            |
| `npm run e2e`       | End-to-end smoke suite (Playwright)            |

## Notes

- All copy and data live as typed, schema-validated content in
  `src/content` — components never hard-code text.
- The whole scroll experience respects the keyboard and never hijacks native
  scrolling.

## License

© Lioua Zeddam. All rights reserved.
