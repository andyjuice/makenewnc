#!/usr/bin/env python3
"""Regenerate the browser icon set from the [make]new bars mark.

Source of truth: public/images/makenew-icon.png (the header logo).
Outputs (all under public/, gitignore-free static assets):
  favicon.ico, favicon-16x16.png, favicon-32x32.png,
  apple-touch-icon.png, icon-192.png, icon-512.png

Run this again whenever the source logo changes:
  python3 scripts/generate-favicons.py

See decisions/2026-08-02-favicon-set.md and architecture/favicon.md for why
these sizes/format, and why "flush" vs. "padded" variants exist.

Requires Pillow: pip install Pillow
"""
import pathlib

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "images" / "makenew-icon.png"
OUT = ROOT / "public"

# Touch icons get extra padding because iOS/Android apply their own rounded
# corner + safe-zone masking; a flush-edge source gets visibly clipped.
TOUCH_ICON_PAD_RATIO = 0.16


def build_square_flush(src: Image.Image) -> Image.Image:
    """Pad the (wider-than-tall) source onto a black square, no margin.

    Used for the classic favicon sizes (16/32/48), which render in a tiny,
    unmasked square — flush edges keep the mark as large/legible as
    possible at those sizes.
    """
    w, h = src.size
    canvas = Image.new("RGB", (w, w), (0, 0, 0))
    canvas.paste(src, (0, (w - h) // 2))
    return canvas


def build_square_padded(flush: Image.Image, pad_ratio: float) -> Image.Image:
    size = flush.size[0]
    padded_size = int(size * (1 + pad_ratio))
    canvas = Image.new("RGB", (padded_size, padded_size), (0, 0, 0))
    offset = (padded_size - size) // 2
    canvas.paste(flush, (offset, offset))
    return canvas


def main() -> None:
    src = Image.open(SRC).convert("RGB")
    flush = build_square_flush(src)
    padded = build_square_padded(flush, TOUCH_ICON_PAD_RATIO)

    flush.resize((16, 16), Image.LANCZOS).save(OUT / "favicon-16x16.png")
    flush.resize((32, 32), Image.LANCZOS).save(OUT / "favicon-32x32.png")
    flush.save(OUT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    padded.resize((180, 180), Image.LANCZOS).save(OUT / "apple-touch-icon.png")
    padded.resize((192, 192), Image.LANCZOS).save(OUT / "icon-192.png")
    padded.resize((512, 512), Image.LANCZOS).save(OUT / "icon-512.png")

    print(f"Regenerated favicon set in {OUT} from {SRC}")


if __name__ == "__main__":
    main()
