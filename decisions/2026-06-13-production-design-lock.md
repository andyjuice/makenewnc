# Production design lock — Instagram Gateway

**Date:** 2026-06-13  
**Status:** Locked

## Decision

Prototype C (Instagram Gateway) is the production design. Prototypes A and B are retired.

## Locked UX

| Area | Choice |
|------|--------|
| Home layout | Side-by-side (hero left, card carousel right on ≥640px; stacked on mobile) |
| Media | Hand-of-cards carousel — Instagram API posts + static images in `gateway-cards.yaml` |
| Doodle frames | Removed |
| Layout/theme preview toggles | Removed from home; dark mode is a header toggle only |
| Header | [make]new icon, dark-mode toggle, hamburger menu (no "More" text) |
| Typography | Small `[make]new` brand; large cycling characteristic (h1) |

## Instagram cards

- Top card hover shows **View on Instagram** overlay (links to post or profile)
- Static cards have no overlay link
- Swipe, arrow buttons, and keyboard navigation

## Routes

- Site lives at `/` (WordPress-aligned slugs for inner pages)
- Legacy `/prototypes/*` URLs redirect to production routes
