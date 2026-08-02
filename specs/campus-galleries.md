# Campus location galleries specification

## Purpose

Per-campus photo carousel on each `/locations/{slug}` detail page — same card-hand UX as the home carousel, with campus-specific image folders.

## Goals

- Editors add images to `public/images/locations/{slug}/` and list them in `src/data/campus-carousels.yaml`
- Placeholder SVGs ship for Duke, NC State, and UNC until real photos are ready
- Reuse `CardHandCarousel` component and swipe/keyboard/auto-advance behavior

## Non-goals

- Live Instagram sync per campus
- Shared carousel across campuses

## User-facing behavior

1. Gallery section appears on each campus detail page when that campus has cards in the manifest.
2. Same interaction model as home: swipe, arrow keys, optional external link on front card.
3. Section labeled "Gallery" with campus-specific alt text.

## Data model

`src/data/campus-carousels.yaml` — top-level keys are campus slugs (`duke`, `nc-state`, `unc`):

| Field | Required | Description |
|-------|----------|-------------|
| `image` | yes | Filename under `public/images/locations/{slug}/` or path starting with `/` |
| `alt` | yes | Accessible description |
| `link` | no | HTTPS URL for external-link control on front card |

## Campus contact

Per-campus `contact.phone` and `contact.email` in `src/data/campuses.yaml` render on detail pages. Duke values are canonical; other campuses use placeholders until campus-specific info is available.

## Edge cases

- Empty campus manifest → no gallery section on that page
- Missing images → browser broken-image UI
- NC State / UNC without service blocks still show gallery and contact

## Open questions

- None
