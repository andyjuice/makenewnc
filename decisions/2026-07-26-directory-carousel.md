# Directory-based home carousel (replace Instagram API)

**Date:** 2026-07-26  
**Status:** Accepted

## Decision

Replace the Instagram Graph API carousel feed with a static manifest (`src/data/carousel.yaml`) and images in `public/images/carousel/`. Optional per-card `link` drives an external-link button on the front card.

## Context

- Instagram API required Meta app setup, token refresh every ~60 days, and Cloudflare env vars.
- Editorial need is a small set of curated photos, sometimes linking to Instagram or other URLs — not a live feed.
- Editors and AI agents need a single obvious template to update.

## Alternatives considered

1. **Keep API + static cards merged** — ongoing ops burden; duplicate content paths.
2. **Directory-only (no YAML)** — no clean way to attach links per image.
3. **JSON manifest** — equivalent to YAML but less comment-friendly for humans.

## Tradeoffs

| Gain | Cost |
|------|------|
| No API secrets or token refresh | Manual updates when photos change |
| Build-time only, faster first paint | No automatic new Instagram posts |
| One file to edit | Must keep YAML in sync with image files |

## Final rationale

Static curated carousel matches actual editorial workflow; YAML + folder is the smallest surface for humans and agents to maintain.

## Follow-up

- Removed `/api/instagram`, `shared/instagram-api.ts`, `gateway-cards.yaml`, `instagram-fallback.yaml`
- `docs/instagram-setup.md` retained but deprecated for carousel use; campus Instagram links unchanged
