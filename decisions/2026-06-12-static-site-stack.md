# Decision: Static Site Stack for makenewnc.org Migration

**Date:** 2026-06-12  
**Status:** Proposed (pending stakeholder approval)

## Decision

Migrate makenewnc.org from WordPress/Elementor to an **Astro static site** deployed on **Cloudflare Pages**, with content in **Markdown + YAML**, media curated from WP exports (R2 for large assets), and **Instagram as link + optional embed** rather than API-driven feed.

## Context

- Current WP site has 8 published pages, 75 media items, Elementor responsive duplicates, password-protected pastor page.
- User priorities: creative freedom, low budget, agent-friendly editing, mobile-first, simple/fast.
- Previous planning stalled on slow WebFetch; WP REST API + curl proved reliable.

## Alternatives Considered

1. **Keep WordPress, simplify theme** — Lower migration effort but ongoing hosting cost, Elementor weight, poor agent edit safety.
2. **Next.js on Vercel** — Strong ecosystem but ships more JS than needed; Vercel free tier limits vs Cloudflare.
3. **Netlify + Astro** — Equivalent to Cloudflare Pages; chosen CF for R2 media integration path.
4. **Decap CMS / TinaCMS** — Visual editing for non-technical editors; rejected for Phase 1 due to complexity; YAML banner pattern covers urgent edits.

## Tradeoffs

| Upside | Downside |
|--------|----------|
| Near-zero hosting cost | No WP admin; edits via git/files |
| Fast mobile performance | Our Pastor + CTPT need content export |
| Agent-friendly Markdown/YAML | Instagram auto-feed requires extra API work |
| Eliminates responsive duplicate sections | One-time migration effort (~2 weeks) |

## Final Rationale

Astro + Markdown matches the greenfield repo, user budget constraints, and agent-first documentation goals. Cloudflare Pages provides free global CDN with minimal ops. Defer CMS and Instagram API until proven necessary.
