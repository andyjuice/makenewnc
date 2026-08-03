# Decision: SEO foundation for Astro migration

**Date:** 2026-08-03  
**Status:** Accepted

## Context

WordPress + Elementor previously relied on plugins for sitemaps, meta tags, and schema. The Astro site launched with only a basic `<meta name="description">`. Migration also changed URLs (`/events` → `/locations`) and replaced the text-heavy home with an Instagram Gateway layout where most taglines cycle via JavaScript.

## Decision

Implement a first-party SEO layer:

1. `@astrojs/sitemap@3.1.6` + `public/robots.txt`
2. `SeoHead.astro` for canonical, Open Graph, Twitter Cards
3. `src/lib/seo.ts` for JSON-LD (Organization + campus Place/Event)
4. Per-page `seoDescription` in Markdown frontmatter
5. Crawlable `seoIntro` block on home (`content/home.md`)
6. Restore `/messages` as a static stub page (remove redirect to `/`)
7. Canonical host `https://www.makenewnc.org`

## Alternatives considered

- **Defer SEO until post-launch:** Rejected — migration is the highest-risk window for ranking loss.
- **Third-party SEO Astro integration (`astro-seo`):** Rejected — small head markup doesn't justify another dependency.
- **Rely on JS tagline text for home keywords:** Rejected — only first phrase is in static HTML; added explicit `seoIntro`.
- **Keep `/messages` redirect to home:** Rejected — loses indexed URL and user intent for sermon recordings.

## Tradeoffs

- Editors must set `seoDescription` in frontmatter (documented in `docs/cloudflare-seo-checklist.md`).
- OG image is logo fallback until someone uploads `public/images/og-default.jpg` (1200×630).
- NC State / UNC lack full local schema until addresses and service times are published.
- Sitemap package pinned to 3.1.6 until Astro is upgraded to v6+.

## Manual follow-up (not automatable in repo)

Cloudflare www redirect, Search Console verification, sitemap submission, Google Business Profile — see `docs/cloudflare-seo-checklist.md`.
