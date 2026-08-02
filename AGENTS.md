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
- Accessibility: see `specs/accessibility-audit.md` / `architecture/accessibility-audit.md` for the drawer/popup focus-trap pattern (mirror `CampusInstagramMenu`'s mobile sheet for any new overlay/dialog), contrast-checking approach, and other audited patterns to follow for new UI
