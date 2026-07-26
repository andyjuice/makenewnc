# Design specification — Instagram Gateway

## Purpose

Single production design for makenewnc.org. Prototypes A and B are retired; see `decisions/2026-06-13-production-design-lock.md`.

## Shared content layer

| File | Purpose |
|------|---------|
| `content/home.md` | Brand, characteristics, pillars, CTA |
| `content/story.md` | Berkeley → Durham narrative |
| `content/beliefs.md` | Statement of faith |
| `content/ctpt.md` | Chapter index + Google Doc URLs |
| `content/privacy.md` | Static privacy policy |
| `src/data/site.yaml` | Brand, social, contact, instagramPitch |
| `src/data/campuses.yaml` | Per-campus address, services (Duke, NC State, UNC) |
| `src/data/announcements.yaml` | Top bar + popup toggles |
| `src/data/carousel.yaml` | Home carousel images and optional links |

## Routes

`/{home,what-were-about,locations,our-story,our-beliefs,christian-themes-for-privileged-teens}`

Legacy `/prototypes/*` and short slugs redirect to production routes (see `astro.config.mjs`).

## Header

- [make]new icon
- Dark mode toggle (localStorage `makenew-theme`)
- Hamburger menu → drawer: Locations, What we're about, Story, Beliefs, CTPT

## Home

- **Layout:** Side-by-side at ≥640px (tagline left, carousel right); stacked on mobile
- **Hero:** Small brand + large cycling characteristics → `/about#{anchor}`
- **Carousel:** iMessage-style photo stack — back cards peek right; drag/swipe front card to advance
- **Instagram cards:** Hover overlay → View on Instagram (post or profile)
- **Static cards:** No overlay link
- **CTAs:** Follow on Instagram, campus line, footer links

## Locations

Campus picker + per-campus pages (Duke active; NC State/UNC coming-soon). Events redirects to Locations.

## About

Casual practical-values page from pillars + always-on pitch.

## Announcements

- `TopBarAnnouncement` — `topBar.enabled`; `triggerPopup` opens modal
- `PopupAnnouncement` — `popup.enabled`; localStorage dismiss

## Non-goals

- Past sermons / Messages
- Our Pastor page (redirects to Story)
- Giving
- Auto Instagram token refresh
- Doodle frames or layout preview toggles
