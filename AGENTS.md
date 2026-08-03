# AGENTS.md — makenewnc.org

## Purpose

Astro site for [make]new church. **Instagram Gateway** is the production design at `/` with dark/light mode via header toggle.

## Read first

- `decisions/2026-06-13-production-design-lock.md` — locked UX decisions
- `specs/prototype-c-evolution.md` — home, carousel, locations behavior
- `docs/carousel.md` — home carousel images & links
- `docs/deploy.md` — Cloudflare Pages

## Editing content

| What | Where |
|------|-------|
| Top bar / popup | `src/data/announcements.yaml` |
| Brand, social, contact | `src/data/site.yaml` |
| Campuses | `src/data/campuses.yaml` |
| Campus galleries | `src/data/campus-carousels.yaml` + `public/images/locations/{slug}/` |
| Hero characteristics + pillars + FART | `content/home.md` (see `specs/about-page-fart-rework.md`) |
| Home carousel (images + links) | `src/data/carousel.yaml` + `public/images/carousel/` |
| Story, beliefs, CTPT | `content/*.md` |
| Favicon / tab icon | `public/images/makenew-icon.png` + `scripts/generate-favicons.py` (see `docs/favicon.md`) |
| SEO meta descriptions | `seoDescription` in `content/*.md` frontmatter (see `docs/cloudflare-seo-checklist.md`) |
| Social share image | `public/images/og-default.jpg` (1200×630; run `scripts/generate-og-image.py` after logo changes) |

## Commands

```bash
npm install
npm run dev      # http://localhost:4321/
npm run build
```

## Header

- [make]new icon (not text)
- Dark mode toggle (persists in localStorage)
- Hamburger menu → drawer nav (focus-trapped while open; current page marked via `aria-current`)

## Home

- Side-by-side layout: cycling tagline + card-hand carousel
- Carousel: curated images from `carousel.yaml`; optional external link on front card

## Constraints

- Mobile-first; tagline cycling respects `prefers-reduced-motion` (JS-gated auto-advance) and all CSS transitions respect it too (sitewide `@media (prefers-reduced-motion: reduce)` override in `Site.astro`)
- Legacy `/prototypes/*` URLs redirect to production routes

## Cursor Cloud specific instructions

- Fully static Astro site — no backend, database, or external service is required to run or test it. The Instagram/Meta API integration is deprecated (see `decisions/`) and not wired into `src/`; the carousel uses static images from `src/data/carousel.yaml`.
- Dev/build/preview commands live in `package.json` (`npm run dev`, `npm run build`, `npm run preview`); see `## Commands` above. There is no lint or automated-test script configured.
- `npm run dev` serves at `http://localhost:4321/` and binds to localhost only. To reach it from another host, run with `--host` (e.g. `npm run dev -- --host`).
- Node `>=20` is required (`.node-version` pins `20`; newer majors such as 22 also work).
