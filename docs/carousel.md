# Home carousel content

The landing-page photo stack is **fully static** — no Instagram API. Update it by editing one manifest and dropping images in a folder.

## Quick steps

1. **Add images** to `public/images/carousel/` (`.jpg`, `.png`, `.webp`, `.svg`).
2. **Edit** `src/data/carousel.yaml` — add one entry per image, in display order.

## Manifest template

```yaml
cards:
  - image: my-photo.jpg          # filename in public/images/carousel/
    alt: Short description       # required (screen readers)
    link: https://example.com    # optional — shows external-link button on front card

  - image: /images/hero-poster.svg   # or a full site path starting with /
    alt: "[make]new community"       # no link = no button on that card
```

## Behavior

- **Order** in YAML = order in the swipe deck (first entry shows first).
- **`link`** — when set, the front card shows an external-link icon (top-right) on hover/tap; opens in a new tab.
- **No link** — card is display-only (swipe still works).
- There is no hard cap on card count; five cards are visible in the stack at once.

## After editing

```bash
npm run dev    # preview at http://localhost:4321/
npm run build  # verify production build
```

Commit and push to deploy on Cloudflare Pages.

## For AI agents

- Manifest: `src/data/carousel.yaml`
- Loader: `getCarouselCards()` in `src/lib/content.ts`
- Component: `src/components/CardHandCarousel.astro`
- Spec: `specs/carousel.md`
