# Favicon / tab icon

The browser tab icon (and iOS/Android home-screen icon) is generated from
the existing header logo — there's one source image to update.

## Quick steps (logo changed)

1. **Replace** `public/images/makenew-icon.png` with the new logo (same
   role as today: header icon + favicon source). The generator inverts this
   image (assumes light-on-dark art, like the current white-bars-on-black
   mark) to build a white-background favicon — if the new logo is already
   dark-on-light, remove the `ImageOps.invert()` call in
   `scripts/generate-favicons.py`.
2. **Regenerate** the icon set:

   ```bash
   pip install Pillow   # once, if not already installed
   python3 scripts/generate-favicons.py
   ```

3. **Preview**: `npm run dev` and check the browser tab, then
   `npm run build` to verify the production build still works.

## What gets generated

`favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`,
`apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, all in `public/`.
`public/site.webmanifest` is hand-written (name/theme colors) and doesn't
need regenerating unless the site name or theme color changes.

## For AI agents

- Source image: `public/images/makenew-icon.png`
- Generator: `scripts/generate-favicons.py`
- `<head>` wiring: `src/layouts/Site.astro`
- Architecture/rationale: `architecture/favicon.md`
- Decision record: `decisions/2026-08-02-favicon-set.md`
