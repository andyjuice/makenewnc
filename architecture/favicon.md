# Favicon / tab icon

See `decisions/2026-08-02-favicon-set.md` for why this exists and why these
formats/sizes were chosen.

## Source of truth

`public/images/makenew-icon.png` — the same "bars" mark already used as the
header logo (`Site.astro`). There is no separate square/vector logo asset.

## Generated assets

`scripts/generate-favicons.py` reads the source PNG and writes:

| File | Size | Variant | Background | Used for |
|---|---|---|---|---|
| `public/favicon.ico` | 16/32/48 | flush | **transparent** | Legacy browsers, bookmarks |
| `public/favicon-16x16.png` | 16 | flush | **transparent** | Modern browsers (small tab) |
| `public/favicon-32x32.png` | 32 | flush | **transparent** | Modern browsers (retina tab) |
| `public/apple-touch-icon.png` | 180 | padded | opaque white | iOS home screen |
| `public/icon-192.png` | 192 | padded | opaque white | Android/PWA install |
| `public/icon-512.png` | 512 | padded | opaque white | Android/PWA install (splash) |

Two different backgrounds come out of the same source mark, because the
right answer differs by platform (see the "truly transparent favicon
background" amendment in `decisions/2026-08-02-favicon-set.md` for the full
history):

- **Browser-tab favicon** (`favicon.ico`, `favicon-16x16.png`,
  `favicon-32x32.png`): black bars with a genuinely transparent
  background. `build_black_on_transparent()` uses the source's per-pixel
  luminance as an alpha mask (white bars → opaque, black background →
  transparent) and flattens the RGB channels to solid black. Modern
  browsers composite this correctly against any tab-chrome color, light or
  dark, so transparency beats picking one fixed fill.
- **Home-screen / install icons** (`apple-touch-icon.png`, `icon-192.png`,
  `icon-512.png`): black bars on an **opaque white** square, built the
  original way — `ImageOps.invert()` on the whole source image (white bars
  on black → black bars on white), since every pixel of an inverted RGB
  image stays fully opaque. This variant is kept because iOS does not
  honor alpha on `apple-touch-icon`: it fills transparent pixels with
  solid black, which would defeat the purpose of "transparent" and look
  like a rendering bug instead. Android/PWA install icons are kept opaque
  too, for the same belt-and-suspenders reason (behavior varies by
  launcher/OS version).

"Flush" = the mark padded onto a square canvas with no extra margin
(maximizes size/legibility in an unmasked browser-tab square). "Padded" =
flush + ~16% margin on all sides, because iOS/Android apply their own
rounded-corner and safe-zone masking to home-screen/install icons and will
visibly clip a flush-edge image.

`public/site.webmanifest` references `icon-192.png`/`icon-512.png`, sets
`background_color` to `#ffffff` (matching the icon canvas — this is the
PWA splash-screen color), and `theme_color` to the site's dark UI
(`#0a0a0a`) — the two are independent: one describes the icon/splash, the
other the app's actual chrome color.

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
