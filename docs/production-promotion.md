# Production promotion — complete

**Status:** Promoted 2026-06-18. Instagram Gateway now lives at production routes under `/`.

## What changed

- Pages moved from `src/pages/prototypes/c/` to `src/pages/` with WordPress-aligned slugs
- `PrototypeC.astro` renamed to `Site.astro`; CSS classes renamed `proto-c` → `site`
- `prototypeBase()` / `protoLink()` replaced with `siteLink()` for root-relative paths
- Dark/light mode remains header toggle (`localStorage` key `makenew-theme`)

## Production routes

| Route | Source |
|-------|--------|
| `/` | Home |
| `/what-were-about` | About / pillars |
| `/locations` | Campus picker |
| `/locations/{slug}` | Campus detail |
| `/our-story` | Story |
| `/our-beliefs` | Beliefs |
| `/christian-themes-for-privileged-teens` | CTPT |
| `/privacy` | Privacy |

## Legacy redirects

Configured in `astro.config.mjs`:

- WordPress: `/messages`, `/our-pastor`, `/events`, `/privacy-policy`
- Prototype tree: `/prototypes`, `/prototypes/c/*`, `/prototypes/a`, `/prototypes/b`, `/prototypes/c-dark`
- Short slugs: `/about`, `/story`, `/beliefs`, `/ctpt`

## DNS cutover

Follow `docs/deploy.md` custom domain section when ready to point `makenewnc.org` at Cloudflare Pages.
