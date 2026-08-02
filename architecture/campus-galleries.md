# Campus location galleries architecture

## Overview

Each campus detail page (`/locations/{slug}`) can render a `CardHandCarousel` fed by campus-specific YAML and image folders. This mirrors the home carousel architecture without duplicating component logic.

## Data flow

```
src/data/campus-carousels.yaml
        ↓ getCampusCarouselCards(slug)
src/pages/locations/[slug].astro
        ↓ props
src/components/CardHandCarousel.astro
        ↓ public URLs
public/images/locations/{slug}/*
```

## Component responsibilities

| Module | Role |
|--------|------|
| `campus-carousels.yaml` | Per-slug card manifests |
| `getCampusCarouselCards()` | Resolves image paths to `/images/locations/{slug}/...` |
| `CardHandCarousel.astro` | Swipe deck UI (shared with home) |
| `[slug].astro` | Renders gallery when cards exist |

## Campus contact

`campuses.yaml` now supports optional `contact.phone` and `contact.email` per campus. The detail page renders `tel:` and `mailto:` links with 44px min touch targets.

## Instagram mobile picker

`CampusInstagramMenu` uses a fixed bottom sheet (`role="dialog"`, `aria-modal`) on viewports &lt;640px for both home CTA and footer. Desktop retains the anchored dropdown panel. Focus trap and Escape close the sheet.

## Why this design

- **Reuse CardHandCarousel** — one interaction model site-wide; no second carousel implementation.
- **Per-slug folders** — editors drop assets per campus without cross-contamination.
- **Bottom sheet on mobile** — footer dropdown was clipped/unusable in the sticky social bar; a fixed sheet provides full-width touch targets and proper dialog semantics.

## Dependencies

- `src/lib/content.ts` — types and loaders
- `src/data/campuses.yaml` — contact + slug keys
- `src/layouts/Site.astro` — sheet CSS, nav Home link
