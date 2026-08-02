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

## Amendment (same review pass): black background flipped to white

The first version of this icon set used the source logo as-is — a solid
black square background. Review feedback called this "unappealing" in a
browser tab (it reads as a black hole rather than a mark). Fixed by
inverting the source palette before building the icon canvas: black bars on
a white background instead of white bars on black.

This reuses a transform the codebase already applies elsewhere for a
different reason — `Site.astro`'s `.site:not(.site--dark) .header__logo`
rule does `filter: invert(1)` on this same PNG so the header logo reads
correctly against the light theme's white header background. The favicon
needed the same transform for a different reason (tab-icon friendliness,
independent of site theme — favicons don't switch with `prefers-color-scheme`
reliably across browsers, so one fixed light-background icon was chosen
over a black or theme-dependent one).

`scripts/generate-favicons.py` now calls `ImageOps.invert()` on the source
before compositing, and canvas fill color changed from black to white.
`public/site.webmanifest`'s `background_color` updated from `#0a0a0a` to
`#ffffff` to match the icon's new background (this is the PWA splash-screen
color, distinct from `theme_color`, which stays `#0a0a0a` to match the
site's actual dark-by-default UI).

## Amendment (2026-08-02, later same day): truly transparent favicon background

The white-background fix above solved the "black hole in the tab" problem,
but a white square is still a visible background — it looks like a small
white sticker in dark browser tab bars instead of blending in. Follow-up
request: make the actual browser-tab favicon (not the touch/install icons)
have a real transparent background instead of a white fill, so it reads as
just "black bars" against whatever chrome color the browser uses.

### Decision

Split the single black-on-white pipeline into two, both driven off the same
`public/images/makenew-icon.png` source:

1. **Browser-tab favicon** (`favicon.ico`, `favicon-16x16.png`,
   `favicon-32x32.png`): black bars, **fully transparent background**.
   Built by `build_black_on_transparent()` — the source's grayscale
   luminance becomes the alpha channel (white bars → opaque, black
   background → transparent), then RGB is flattened to solid black.
2. **Home-screen/install icons** (`apple-touch-icon.png`, `icon-192.png`,
   `icon-512.png`): unchanged — black bars on **opaque white**, via the
   original `ImageOps.invert()` approach.

### Context / why not transparent everywhere

Researched current (2026) iOS/Android behavior before making this change:
iOS Safari does not honor alpha on `apple-touch-icon` — any transparent
pixel is filled with solid black at render time, before the home-screen
"squircle" mask is applied. Shipping a transparent PNG there wouldn't
produce a transparent icon; it would produce a black-cornered icon, which
is strictly worse than the current opaque-white one. Android/PWA launcher
behavior on transparent install icons is inconsistent across OEMs, so the
same "keep it opaque" choice was extended to `icon-192.png`/`icon-512.png`
rather than special-casing just Apple.

The actual browser-tab favicon has no such platform restriction — Chrome,
Firefox, and Edge all composite alpha correctly in tab bars — so
transparency is a strict improvement there with no offsetting risk.

### Alternatives considered

1. **Transparent everywhere, including touch/install icons.** Rejected —
   would visibly regress the iOS home-screen icon (black-filled corners)
   for a platform that doesn't support the thing being requested.
2. **Pick a single non-white, non-black fill (e.g. a brand accent color)
   for the favicon instead of true transparency.** Rejected — doesn't
   solve the actual ask (a genuinely transparent background), and adds a
   new color choice with no clear source of truth (no brand accent is
   defined for icon backgrounds elsewhere in the codebase).
3. **Reuse `ImageOps.invert()` output and just strip white pixels to
   transparent via a color-key.** Rejected in favor of the luminance-as-alpha
   approach — a hard color-key produces jagged/aliased edges on the
   antialiased bar outlines in the source art, while treating luminance as
   alpha preserves the existing antialiasing as smooth partial transparency
   "for free."

### Tradeoffs

| Gain | Cost |
|---|---|
| Favicon blends into any browser tab-chrome color (light or dark) instead of showing a white square | Two generation pipelines instead of one in `scripts/generate-favicons.py` (more code, but each half stays simple) |
| No visual regression on iOS/Android home-screen icons | `public/site.webmanifest`'s `background_color` (`#ffffff`) still only describes the opaque icons — a future reader could wonder why it doesn't match the (now transparent) favicon; noted here and in `architecture/favicon.md` to preempt that confusion |

### Final rationale

Transparency is a real win for the favicon specifically (no platform
caveats, strictly better in every browser tested), but is not a universal
win across every icon surface this codebase generates — iOS actively
punishes transparent home-screen icons. Splitting the pipeline by surface,
rather than picking one background for all six files, matches how each
surface actually renders the asset instead of optimizing for pipeline
simplicity over correctness.

### Follow-up

- `scripts/generate-favicons.py`: added `build_black_on_transparent()` and
  `build_square_flush_transparent()`; `main()` now runs both the opaque
  (touch/install) and transparent (favicon) pipelines from the same source
  image.
- `docs/favicon.md` and `architecture/favicon.md` updated to describe the
  two-variant output and why they differ.
- `public/site.webmanifest` left unchanged — its `background_color:
  "#ffffff"` still accurately describes `icon-192.png`/`icon-512.png`,
  which remain opaque.
