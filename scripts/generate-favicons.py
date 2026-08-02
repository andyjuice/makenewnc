#!/usr/bin/env python3
"""Regenerate the browser icon set from the [make]new bars mark.

Source of truth: public/images/makenew-icon.png (the header logo — white
bars on a black background). Two different backgrounds are produced from it,
because "the" right background depends on which OS/browser surface an icon
renders on (see decisions/2026-08-02-favicon-set.md, "Amendment: truly
transparent favicon background", for the full why):

- Browser-tab favicon (favicon.ico, favicon-16x16.png, favicon-32x32.png):
  TRULY TRANSPARENT background, black bars. Modern browsers composite
  favicon alpha correctly against light or dark tab chrome, so transparency
  is strictly better here than picking one fixed fill color.
- Home-screen / install icons (apple-touch-icon.png, icon-192.png,
  icon-512.png): OPAQUE white background, black bars (unchanged from the
  original amendment). iOS in particular does not honor alpha on
  apple-touch-icon — it fills transparent pixels with solid black — so
  shipping a transparent PNG there would look broken, not "transparent."
  Android/PWA install icons are kept opaque too for the same
  belt-and-suspenders reason (behavior varies by launcher).

This mirrors the CSS `filter: invert(1)` already applied to the header logo
on the site's light theme (see `.site:not(.site--dark) .header__logo` in
Site.astro) — same "flip the mark to black-on-light" idea, different reason
(readability there; tab-icon/platform-compatibility here).

Outputs (all under public/, gitignore-free static assets):
  favicon.ico, favicon-16x16.png, favicon-32x32.png (transparent),
  apple-touch-icon.png, icon-192.png, icon-512.png (opaque white)

Run this again whenever the source logo changes:
  python3 scripts/generate-favicons.py

See decisions/2026-08-02-favicon-set.md and architecture/favicon.md for why
these sizes/format, and why "flush" vs. "padded" variants exist.

Requires Pillow: pip install Pillow
"""
import pathlib

from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "images" / "makenew-icon.png"
OUT = ROOT / "public"

# Touch icons get extra padding because iOS/Android apply their own rounded
# corner + safe-zone masking; a flush-edge source gets visibly clipped.
TOUCH_ICON_PAD_RATIO = 0.16

WHITE = (255, 255, 255)
TRANSPARENT = (0, 0, 0, 0)


def build_square_flush(src: Image.Image) -> Image.Image:
    """Pad the (wider-than-tall) source onto a white square, no margin.

    Used for the classic favicon sizes (16/32/48), which render in a tiny,
    unmasked square — flush edges keep the mark as large/legible as
    possible at those sizes.
    """
    w, h = src.size
    canvas = Image.new("RGB", (w, w), WHITE)
    canvas.paste(src, (0, (w - h) // 2))
    return canvas


def build_square_padded(flush: Image.Image, pad_ratio: float) -> Image.Image:
    size = flush.size[0]
    padded_size = int(size * (1 + pad_ratio))
    canvas = Image.new("RGB", (padded_size, padded_size), WHITE)
    offset = (padded_size - size) // 2
    canvas.paste(flush, (offset, offset))
    return canvas


def build_black_on_transparent(src_rgb: Image.Image) -> Image.Image:
    """Convert the white-bars-on-black source into black bars on a fully
    transparent (RGBA) background, instead of an opaque fill color.

    Why not just `ImageOps.invert()` like the opaque variant does: inverting
    swaps white<->black but every pixel stays fully opaque, so the result is
    still a solid-fill square (just white instead of black) — there is no
    way to get transparency out of a plain color invert.

    How this gets transparency instead: the source's per-pixel luminance
    becomes the alpha channel. The white bars are already the brightest
    pixels in the source, so they become fully opaque; the black background
    is already the darkest, so it becomes fully transparent; antialiased
    bar edges fall in between and get partial alpha "for free" (no separate
    edge-detection step needed). The RGB channels are then flattened to
    solid black — we want crisp black bars on transparency, not a
    grayscale ghost of the original shading.
    """
    alpha = src_rgb.convert("L")
    black_rgba = Image.new("RGBA", src_rgb.size, (0, 0, 0, 255))
    black_rgba.putalpha(alpha)
    return black_rgba


def build_square_flush_transparent(mark: Image.Image) -> Image.Image:
    """Same edge-to-edge padding as build_square_flush, but onto a
    transparent RGBA canvas instead of an opaque white one. Pastes using
    `mark` as its own mask so the alpha channel (see
    build_black_on_transparent) is preserved rather than flattened."""
    w, h = mark.size
    canvas = Image.new("RGBA", (w, w), TRANSPARENT)
    canvas.paste(mark, (0, (w - h) // 2), mark)
    return canvas


def main() -> None:
    raw = Image.open(SRC).convert("RGB")

    # Opaque black-on-white variant — home-screen/install icons, where
    # iOS/Android do not reliably honor a transparent background.
    opaque_mark = ImageOps.invert(raw)
    opaque_flush = build_square_flush(opaque_mark)
    opaque_padded = build_square_padded(opaque_flush, TOUCH_ICON_PAD_RATIO)

    opaque_padded.resize((180, 180), Image.LANCZOS).save(OUT / "apple-touch-icon.png")
    opaque_padded.resize((192, 192), Image.LANCZOS).save(OUT / "icon-192.png")
    opaque_padded.resize((512, 512), Image.LANCZOS).save(OUT / "icon-512.png")

    # Transparent variant — the actual browser-tab favicon, where modern
    # browsers composite alpha correctly against any tab-chrome color.
    transparent_mark = build_black_on_transparent(raw)
    transparent_flush = build_square_flush_transparent(transparent_mark)

    transparent_flush.resize((16, 16), Image.LANCZOS).save(OUT / "favicon-16x16.png")
    transparent_flush.resize((32, 32), Image.LANCZOS).save(OUT / "favicon-32x32.png")
    transparent_flush.save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    print(f"Regenerated favicon set in {OUT} from {SRC}")


if __name__ == "__main__":
    main()
