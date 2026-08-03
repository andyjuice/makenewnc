#!/usr/bin/env python3
"""Generate public/images/og-default.jpg for Open Graph / Twitter link previews.

Source: public/images/makenew-icon.png (white [make]new bars on black).
Output: 1200×630 JPEG — the standard og:image aspect ratio — with the logo
centered on the site's dark background (#0a0a0a).

Regenerate when the source logo changes:
  pip install Pillow   # once
  python3 scripts/generate-og-image.py

Consumed at build time by src/components/SeoHead.astro (see specs/seo.md).
"""
import pathlib

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "public" / "images" / "makenew-icon.png"
OUT = ROOT / "public" / "images" / "og-default.jpg"

OG_WIDTH = 1200
OG_HEIGHT = 630
# Site dark background — matches Site.astro --bg and theme-color.
BG_COLOR = (10, 10, 10)
# Logo occupies at most this fraction of canvas width (breathing room for crops).
MAX_LOGO_WIDTH_RATIO = 0.72
JPEG_QUALITY = 90


def build_og_image(src: Image.Image) -> Image.Image:
    """Composite the logo centered on a 1200×630 dark canvas."""
    canvas = Image.new("RGB", (OG_WIDTH, OG_HEIGHT), BG_COLOR)

    max_logo_w = int(OG_WIDTH * MAX_LOGO_WIDTH_RATIO)
    scale = min(max_logo_w / src.width, (OG_HEIGHT * 0.55) / src.height)
    logo_w = max(1, int(src.width * scale))
    logo_h = max(1, int(src.height * scale))
    logo = src.resize((logo_w, logo_h), Image.Resampling.LANCZOS)

    x = (OG_WIDTH - logo_w) // 2
    y = (OG_HEIGHT - logo_h) // 2
    canvas.paste(logo, (x, y))
    return canvas


def main() -> None:
    if not SRC.is_file():
        raise SystemExit(f"Missing source logo: {SRC}")

    src = Image.open(SRC).convert("RGB")
    og = build_og_image(src)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    og.save(OUT, "JPEG", quality=JPEG_QUALITY, optimize=True)
    print(f"Wrote {OUT.relative_to(ROOT)} ({OG_WIDTH}×{OG_HEIGHT})")


if __name__ == "__main__":
    main()
