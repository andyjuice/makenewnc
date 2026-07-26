# Home carousel specification

## Purpose

Hand-of-cards photo stack on `/` — curated images with optional outbound links. Replaces the former Instagram Graph API feed.

## Goals

- Editors add images to `public/images/carousel/` and list them in `src/data/carousel.yaml`
- Optional per-card `link` opens from an external-link control on the front card
- Build-time content only (no client fetch, no API secrets)
- Same swipe / keyboard / auto-advance UX as before

## Non-goals

- Live Instagram sync
- Video cards
- In-carousel captions or titles (alt text only)

## User-facing behavior

1. Cards render in YAML list order; user swipes or uses arrow keys to cycle.
2. Up to five cards visible in the stack (four peeking + one front).
3. When the front card has a `link`, hover (desktop) or persistent affordance (touch) shows an external-link button top-right.
4. Auto-advance every 12s when motion is allowed and the carousel is not focused/hovered.
5. `prefers-reduced-motion`: no auto-advance (unchanged from tagline behavior).

## Data model

| Field | Required | Description |
|-------|----------|-------------|
| `image` | yes | Filename under `public/images/carousel/` or path starting with `/` |
| `alt` | yes | Accessible description |
| `link` | no | HTTPS URL; omit for display-only cards |

## Edge cases

- Empty manifest → “No photos yet.” placeholder
- Single card → no swipe hint, no auto-advance
- Broken image URL → browser broken-image UI (no runtime validation)
- External links use `rel="noopener noreferrer"` and `target="_blank"`

## Open questions

- None
