# SEO — Architecture

## High-level design

```
content/*.md (seoDescription, seoIntro)
        │
        ▼
src/pages/*.astro  ──►  Site.astro  ──►  SeoHead.astro
        │                      │
        │                      └── buildOrganizationJsonLd(site)
        │
        └── locations/[slug] ──► buildCampusPlaceJsonLd + buildCampusEventJsonLd
                                        │
                                        ▼
                              <head> canonical, meta, OG, JSON-LD

npm run build
        │
        ├── dist/**/*.html
        ├── dist/robots.txt (from public/)
        └── dist/sitemap-index.xml (@astrojs/sitemap)
```

## Component responsibilities

| Module | Role |
|--------|------|
| `src/lib/seo.ts` | Canonical URL builder, OG asset URLs, JSON-LD factories, campus meta descriptions |
| `src/components/SeoHead.astro` | Renders `<link rel="canonical">`, description, OG/Twitter tags, JSON-LD scripts |
| `src/layouts/Site.astro` | Merges page-level `jsonLd` with site-wide Organization schema; passes SEO props to SeoHead |
| `@astrojs/sitemap` | Emits sitemap from built routes at `astro:build:done` |
| `public/robots.txt` | Static allow-all + sitemap pointer |

## Data flow

1. Page loads content via `getHome()`, `getStory()`, etc.
2. Page passes `title`, `description`, optional `jsonLd` / `ogImage` to `<Site>`.
3. `Site.astro` computes `metaDescription` (prop or `site.tagline` fallback).
4. `SeoHead` resolves OG image path (prefers `og-default.jpg` on disk).
5. Build emits static HTML with all tags inlined.

## State management

None — fully static. SEO values change only when content or code is committed and redeployed.

## Dependencies

- `astro.config.mjs`: `site: 'https://www.makenewnc.org'`, `integrations: [sitemap()]`
- `src/data/site.yaml`: brand, tagline, social URLs for Organization schema
- `src/data/campuses.yaml`: address + service times for Duke Place/Event schema

## Alternatives considered

| Alternative | Rejected because |
|-------------|------------------|
| `astro-seo` package | Adds dependency for ~30 lines of head tags we control directly |
| Runtime sitemap API route | Unnecessary on static Cloudflare Pages |
| `@astrojs/sitemap@3.7` | Breaks on Astro 4 (`_routes` undefined) |
| `noindex` entire home (gateway-heavy) | Home is the brand entry; added `seoIntro` instead |

## Why this design

Minimal surface area, no CMS lock-in, editors already use Markdown frontmatter. JSON-LD in TypeScript keeps campus logic type-safe and testable at build time.
