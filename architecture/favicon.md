# Favicon / tab icon

See `decisions/2026-08-02-favicon-set.md` for why this exists and why these
formats/sizes were chosen.

## Source of truth

`public/images/makenew-icon.png` — the same "bars" mark already used as the
header logo (`Site.astro`). There is no separate square/vector logo asset.

## Generated assets

`scripts/generate-favicons.py` reads the source PNG and writes:

| File | Size | Variant | Used for |
|---|---|---|---|
| `public/favicon.ico` | 16/32/48 | flush | Legacy browsers, bookmarks |
| `public/favicon-16x16.png` | 16 | flush | Modern browsers (small tab) |
| `public/favicon-32x32.png` | 32 | flush | Modern browsers (retina tab) |
| `public/apple-touch-icon.png` | 180 | padded | iOS home screen |
| `public/icon-192.png` | 192 | padded | Android/PWA install |
| `public/icon-512.png` | 512 | padded | Android/PWA install (splash) |

"Flush" = the source logo padded onto a square black canvas with no extra
margin (maximizes size/legibility in an unmasked browser-tab square).
"Padded" = flush + ~16% margin on all sides, because iOS/Android apply
their own rounded-corner and safe-zone masking to home-screen/install icons
and will visibly clip a flush-edge image.

`public/site.webmanifest` references `icon-192.png`/`icon-512.png` and sets
`theme_color`/`background_color` to the site's dark background (`#0a0a0a`)
to match the default theme.

## Wiring

All `<link>`/`<meta>` tags live in `src/layouts/Site.astro`'s `<head>` (one
place, applies to every page since every page renders through this
layout):

```
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#0a0a0a">
```

## Regenerating (logo change)

See `docs/favicon.md` for the human-facing quick steps. In short:

```bash
pip install Pillow   # if not already available
python3 scripts/generate-favicons.py
```

The script is deterministic and safe to re-run; it always overwrites the
same output files from the current `public/images/makenew-icon.png`.
