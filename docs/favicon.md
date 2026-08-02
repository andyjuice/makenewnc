# Favicon / tab icon

The browser tab icon (and iOS/Android home-screen icon) is generated from
the existing header logo — there's one source image to update.

## Quick steps (logo changed)

1. **Replace** `public/images/makenew-icon.png` with the new logo (same
   role as today: header icon + favicon source). The generator assumes
   light-on-dark art (like the current white-bars-on-black mark) and
   produces two outputs from it: an opaque black-on-white version (touch
   icons) and a truly transparent black-bars version (browser-tab favicon)
   — if the new logo is already dark-on-light, both `build_black_on_transparent()`
   and the `ImageOps.invert()` call in `scripts/generate-favicons.py` need
   inverting logic removed/adjusted.
2. **Regenerate** the icon set:

   ```bash
   pip install Pillow   # once, if not already installed
   python3 scripts/generate-favicons.py
   ```

3. **Preview**: `npm run dev` and check the browser tab, then
   `npm run build` to verify the production build still works.

## What gets generated

`favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png` — the actual
browser-tab favicon — are **truly transparent** (black bars, no background
fill). `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` stay **opaque
white**, because iOS ignores alpha on home-screen icons and fills
transparent pixels with solid black instead (see the amendment in
`decisions/2026-08-02-favicon-set.md` for why the two variants differ).
All six files land in `public/`. `public/site.webmanifest` is hand-written
(name/theme colors) and doesn't need regenerating unless the site name or
theme color changes.

## For AI agents

- Source image: `public/images/makenew-icon.png`
- Generator: `scripts/generate-favicons.py`
- `<head>` wiring: `src/layouts/Site.astro`
- Architecture/rationale: `architecture/favicon.md`
- Decision record: `decisions/2026-08-02-favicon-set.md`
