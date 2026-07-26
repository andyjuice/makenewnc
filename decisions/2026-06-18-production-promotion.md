# Production promotion — Instagram Gateway to `/`

**Date:** 2026-06-18  
**Status:** Accepted

## Decision

Promote Instagram Gateway from the `/prototypes/c/` pre-production tree to production routes at `/`. The site is no longer a prototype comparison — it is the site.

## Changes

- `Site.astro` layout (renamed from `PrototypeC.astro`) with `site--dark` / light theme classes
- Production slugs: `/what-were-about`, `/our-story`, `/our-beliefs`, `/locations`, `/christian-themes-for-privileged-teens`
- `siteLink()` helper replaces `prototypeBase()` + `protoLink()`
- Legacy redirects preserve bookmarks from WordPress and prototype URLs

## Dark + light mode

Single route tree; theme toggle in header persists via `localStorage('makenew-theme')`. No separate dark-variant route.

## Rationale

Stakeholders locked on design C. Keeping `/prototypes/c/` added friction for content editors and obscured the real URL structure for launch.
