# Campus location galleries

Per-campus photo stacks on `/locations/{slug}` — same editing model as the home carousel.

## Quick steps

1. **Add images** to `public/images/locations/{slug}/` (e.g. `duke/`, `nc-state/`, `unc/`).
2. **Edit** `src/data/campus-carousels.yaml` — add entries under the campus slug key.

## Manifest template

```yaml
duke:
  cards:
    - image: my-photo.jpg
      alt: Friday night gathering at ADF
    - image: placeholder-1.svg
      alt: Duke campus gallery placeholder
```

## After editing

```bash
npm run dev
npm run build
```

## For AI agents

- Manifest: `src/data/campus-carousels.yaml`
- Loader: `getCampusCarouselCards(slug)` in `src/lib/content.ts`
- Component: `src/components/CardHandCarousel.astro` (reused from home)
- Spec: `specs/campus-galleries.md`
