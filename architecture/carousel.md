# Home carousel architecture

## Overview

```
public/images/carousel/*  ──┐
src/data/carousel.yaml   ──┼──► getCarouselCards() ──► index.astro ──► CardHandCarousel
                           │         (build time)              (props)      (client deck UI)
```

## Data flow

1. **Build time:** `content.ts` reads `carousel.yaml`, resolves `image` paths to public URLs, returns `CarouselCard[]`.
2. **SSR:** `index.astro` passes cards into `CardHandCarousel`; deck JSON is embedded in `data-deck`.
3. **Client:** `initPhotoStack` parses `data-deck` and renders the stack — no network requests.

## Component responsibilities

| Module | Role |
|--------|------|
| `src/data/carousel.yaml` | Human/AI-editable manifest |
| `src/lib/content.ts` | Path resolution, type exports |
| `src/components/CardHandCarousel.astro` | Stack animation, swipe, optional link overlay |
| `src/pages/index.astro` | Wires home layout |

## State management

- Ephemeral client state only: `index`, `paused`, `animating`, drag pointer
- No global store; one instance per `[data-photo-stack]` root

## Design choice: YAML manifest vs directory-only

**Chosen:** YAML manifest + image directory.

**Alternatives considered:**

- *Directory glob only* — cannot attach per-image links without sidecar files or EXIF.
- *Markdown frontmatter per image* — harder for bulk AI edits than one list file.

**Rationale:** Single file is easy to diff, reorder, and hand to an agent; images stay as binary assets in a conventional folder.

## Dependencies

- `js-yaml` (existing) for manifest parse
- Removed: `shared/instagram-api.ts`, Cloudflare `/api/instagram`, Vite dev middleware

## Dependents

- `docs/carousel.md` — editor guide
- `AGENTS.md` — content table
