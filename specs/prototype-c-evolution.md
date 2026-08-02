# Instagram Gateway specification

## Purpose

Production home and site IA for [make]new. Locked design — see `decisions/2026-06-13-production-design-lock.md`.

## Goals

- Side-by-side home: cycling tagline + card-hand carousel
- Curated photo carousel with optional per-card links
- Multi-campus Locations (Duke, NC State, UNC)
- Casual About page from pillars
- Header dark-mode toggle + hamburger nav
- Announcement bar with optional popup trigger

## Non-goals

- Prototypes A/B or picker UI
- Doodle phone/post frames
- Layout preview toggles on home
- Production promotion to `/` — **complete** (see `decisions/2026-06-18-production-promotion.md`)
- Auto Instagram token refresh worker
- Live Instagram feed on home (replaced by `carousel.yaml` — see `decisions/2026-07-26-directory-carousel.md`)

## Home behavior

1. **Hero:** static `[make]new` brand with Duke · NC State · UNC on the same line; cycling characteristics from `content/home.md` → `/about#{anchor}`; mobility address includes a `*` footnote for Duke-only service times
2. **Carousel:** stacked card deck (4 visible in hand); `src/data/carousel.yaml` + `public/images/carousel/`
3. **IG hover:** replaced by optional external-link button when a card has `link` in `carousel.yaml`
4. **Follow CTA:** home button opens a campus picker (Duke, NC State, UNC) — fixed bottom sheet on viewports &lt;640px; dropdown on wider screens. Footer Instagram uses the same picker.
5. **Locations line:** link to campus picker
6. **Footer links:** Home · Locations · Beliefs · Story · About · CTPT

`prefers-reduced-motion`: freeze tagline on first characteristic.

## Layout

| Viewport | Structure |
|----------|-----------|
| &lt;640px | Stacked: hero → carousel → actions |
| ≥640px | Two columns: hero | carousel; actions span full width |

## Locations

- Index at `/locations` lists Duke, NC State, and UNC — cards link to per-campus detail pages
- Hover states use each school’s brand colors (Duke blue, NC State red, Carolina blue)
- Per-campus pages show address, contact, gallery carousel, Fri/Sun services when available, and link to that campus's Instagram profile
- Data in `src/data/campuses.yaml`
- Events route redirects to Locations

## About page

- Route: `/what-were-about`
- Sections: intro, FART differentiator (Faith, Art, Reason, Technology), 4 pillars (anchored), always-on (from `instagramPitch`)
- Tone: casual practical values, not formal beliefs

## Carousel

- Cards from `src/data/carousel.yaml` at build time; images in `public/images/carousel/`
- Optional `link` per card → external-link control on front card
- See `specs/carousel.md` and `docs/carousel.md`

## Theme

- Dark default; light via header toggle
- Persisted in `localStorage` key `makenew-theme`
- Applied via `data-theme` on `<html>`

## Edge cases

- NC State / UNC: coming-soon badge, no service blocks until data added
- Missing carousel images: broken image in card; empty manifest shows placeholder text
- Expired announcement dates: hidden at build time
