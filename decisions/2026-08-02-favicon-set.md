# Generate a real favicon/tab-icon set from the [make]new bars mark

**Date:** 2026-08-02
**Status:** Accepted

## Decision

Generate a standard browser icon set from the existing header logo
(`public/images/makenew-icon.png` — the "[make]new" bars mark) and wire it
up in `<head>` via `Site.astro`:

- `public/favicon.ico` (16/32/48px, legacy browsers)
- `public/favicon-16x16.png`, `public/favicon-32x32.png` (modern browsers)
- `public/apple-touch-icon.png` (180×180, iOS home screen)
- `public/icon-192.png`, `public/icon-512.png` (Android/PWA install icons)
- `public/site.webmanifest` (references the 192/512 PNGs)

See `architecture/favicon.md` for how these were generated and how to
regenerate them if the source logo changes.

## Context

The site had no favicon at all — browser tabs showed the default
blank/globe icon. The header already uses a square-ish "bars" mark
(`makenew-icon.png`, 1024×602, white/outlined bars on black) as the closest
thing to a brand mark; no separate square logo file exists.

## Alternatives considered

1. **Commission/design a new square icon.** Rejected for this pass — no
   design asset was provided, and the existing bars mark is already the
   site's de facto icon (used in the header); reusing it keeps the tab icon
   and header icon visually consistent.
2. **Use an SVG favicon only.** Rejected as the sole format — SVG favicons
   have inconsistent support (notably Safari/iOS), so a PNG/ICO set is
   still required for broad compatibility; adding an SVG on top wasn't
   necessary given the source art is a flat two-tone raster already.
3. **Crop only the left 3 (solid) bars for a simpler tiny-size icon.**
   Rejected — that would drop the outlined-bar half of the mark, changing
   the shape people already recognize from the header, for a marginal
   legibility gain at 16px (the full mark still reads as a distinct striped
   shape at 16px, just with softer edges on the outlined bars).

## Tradeoffs

| Gain | Cost |
|---|---|
| Standard, broadly-compatible icon set (ICO + PNG + manifest) | One-time generation step; not automated as part of the build (see `architecture/favicon.md` for the regeneration script) |
| Reuses existing brand art — no new design asset needed | The mark's fine detail (2 outlined bars) softens at 16×16; still recognizable as a striped mark |
| Touch icons get extra padding so iOS/Android corner-masking doesn't clip the outer bars | Touch icons are visually "smaller" than a flush-edge icon would be |

## Final rationale

Shipping a real favicon from the existing brand mark is a strict
improvement over no favicon, reuses art that's already the site's visual
shorthand, and needs no new design work. Format choice (ICO + PNG set +
manifest, no dedicated SVG) matches the old WordPress site's own icon
convention (see `archive/wp-html/*.html`, which used 32/192/180px PNG
variants) — the same age of practice made this a "convert to formats
browsers need" task, not a redesign.

## Follow-up

- `src/layouts/Site.astro`: added `<link rel="icon">` (ico + 16/32 PNG),
  `<link rel="apple-touch-icon">`, `<link rel="manifest">`, and
  `<meta name="theme-color">` to `<head>`.
- `public/site.webmanifest` added (name, icons, theme/background color).
- `docs/favicon.md` added with the regeneration steps for future logo
  changes.
