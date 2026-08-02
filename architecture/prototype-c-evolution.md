# Instagram Gateway — architecture

## Component map

```
Site.astro (layout, theme via localStorage + data-theme)
├── TopBarAnnouncement (optional triggerPopup)
├── GatewayTagline (home only)
├── CardHandCarousel (home only)
├── PopupAnnouncement
└── social-bar (fixed bottom)

Pages:
  index.astro              — home gateway (side-by-side grid)
  what-were-about.astro    — what we're about
  locations/index          — campus picker
  locations/[slug]         — campus detail
  our-story.astro          — two-font era layout
  our-beliefs.astro, christian-themes-for-privileged-teens.astro
```

## Data flow

### Campuses

```
campuses.yaml → getCampuses() / getCampus(slug)
site.yaml     → getSite() (brand, social, contact)
```

### Characteristics, pillars, carousel

```
content/home.md → getHome()
  ├── characteristics[] → GatewayTagline
  ├── differentiator    → what-were-about.astro FART section (see architecture/about-page-fart-rework.md)
  └── pillars[]         → what-were-about.astro "Our values" sections

carousel.yaml + public/images/carousel/ → getCarouselCards() → CardHandCarousel
```

See `architecture/carousel.md` for carousel detail.

### Instagram feed (retired for home carousel)

Home carousel no longer calls `/api/instagram`. Campus Instagram profile links (footer, locations) are unchanged. Historical API setup: `docs/instagram-setup.md` (deprecated for carousel).

## Card hand carousel

- Vanilla JS; no Swiper dependency
- Deck built at build time from `carousel.yaml`; embedded in `data-deck` on the page
- Front card shows external-link overlay when `link` is set
- Swipe threshold ~52px; keyboard Left/Right when region focused

## Why build-time carousel (2026-07-26)

Curated photos with optional links do not need a live API. Static manifest removes token maintenance and speeds first paint. See `decisions/2026-07-26-directory-carousel.md`.

## Why campuses split from site.yaml

Multi-campus ministry requires per-location address and services. `site.yaml` keeps brand-wide config; `campuses.yaml` owns location data.

## Design decisions

| Decision | Rationale |
|----------|-----------|
| Card hand vs doodle frames | Cleaner production look; swipe still feels tactile |
| Side-by-side locked | User sign-off; no home layout toggle |
| Header theme toggle | One C route tree; no c-dark mirror |
| Curated carousel YAML | No API secrets; see `docs/carousel.md` |
| Events → Locations redirect | Service times are campus-scoped |
| Retire A/B prototypes | Reduce maintenance; redirects preserve old URLs |

## Favicon

Tab/home-screen icons are generated from `public/images/makenew-icon.png`.
See `architecture/favicon.md`.

## Dependencies

- `gray-matter`, `js-yaml` — content loading
- Google Fonts — Space Grotesk (site), DM Serif + Inter (story)
