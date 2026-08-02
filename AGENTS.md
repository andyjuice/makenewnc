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
| Hero characteristics + pillars | `content/home.md` |
| Home carousel (images + links) | `src/data/carousel.yaml` + `public/images/carousel/` |
| Story, beliefs, CTPT | `content/*.md` |

## Commands

```bash
npm install
npm run dev      # http://localhost:4321/
npm run build
```

## Header

- [make]new icon (not text)
- Dark mode toggle (persists in localStorage)
- Hamburger menu → drawer nav

## Home

- Side-by-side layout: cycling tagline + card-hand carousel
- Carousel: curated images from `carousel.yaml`; optional external link on front card

## Constraints

- Mobile-first; tagline cycling respects `prefers-reduced-motion`
- Legacy `/prototypes/*` URLs redirect to production routes

## Cursor Cloud specific instructions

- Fully static Astro site — no backend, database, or external service is required to run or test it. The Instagram/Meta API integration is deprecated (see `decisions/`) and not wired into `src/`; the carousel uses static images from `src/data/carousel.yaml`.
- Dev/build/preview commands live in `package.json` (`npm run dev`, `npm run build`, `npm run preview`); see `## Commands` above. There is no lint or automated-test script configured.
- `npm run dev` serves at `http://localhost:4321/` and binds to localhost only. To reach it from another host, run with `--host` (e.g. `npm run dev -- --host`).
- Node `>=20` is required (`.node-version` pins `20`; newer majors such as 22 also work).
