# SEO — Specification

## Problem statement

After migrating from WordPress to Astro, the site lost the convenience of Yoast-style plugins (sitemap, meta tags, schema, Open Graph). Without replacing that infrastructure, search visibility and social sharing quality would regress — especially during the URL/layout transition (`/events` → `/locations`, new home layout with JS-driven taglines).

## Goals

- Replace core WordPress SEO plugin behavior with a small, maintainable Astro layer.
- Preserve and improve indexability of all public pages.
- Emit structured data for local church search (Organization, Place, recurring Events).
- Give editors a clear place to update meta copy (`seoDescription` in Markdown frontmatter).
- Document manual steps required on Cloudflare and Google Search Console.

## Non-goals

- Rank-tracking dashboards, keyword tooling, or paid SEO SaaS.
- Blog/CMS for ongoing content marketing (future work).
- Migrating CTPT chapter bodies from Google Docs (improves SEO but is a separate content project).
- Automatic Google Business Profile management.

## User-facing behavior

- Every public page has a unique `<title>`, meta description, canonical URL, Open Graph tags, and Twitter Card tags.
- Shared links show a title, description, and preview image (logo fallback until `og-default.jpg` is added).
- `/messages` is a real page again (Facebook recordings + email for archives), not a redirect to home.
- Home page includes crawlable introductory copy below the Instagram Gateway hero (in addition to the cycling tagline).
- `/robots.txt` allows all crawlers and points to the sitemap.
- `/sitemap-index.xml` lists all indexable routes (generated at build time).

## System constraints

- Canonical host: `https://www.makenewnc.org` (apex redirects to www via Cloudflare — manual setup).
- `@astrojs/sitemap@3.1.6` pinned for Astro 4 compatibility (3.7+ requires Astro 6).
- JSON-LD is static at build time; no runtime personalization.
- Default OG image: `public/images/og-default.jpg` when present, else `makenew-icon.png`.

## Edge cases

- **Campuses without street addresses** (NC State, UNC): Place schema without `openingHours`; Events omitted until times/addresses are published.
- **Trailing slashes**: Canonical URLs use trailing slashes on subpages to match directory build output.
- **Redirect routes** (`/events`, `/about`, etc.): Not in sitemap; handled by `astro.config.mjs` redirects.
- **Privacy page**: Indexed (standard practice); use `noindex` prop on `Site` if policy changes.

## Open questions

1. Add `/messages` to drawer nav? (Currently page exists; not in nav — matches production nav lock.)
2. When to add `public/images/og-default.jpg` (1200×630 branded share image)?
3. Phase 2: migrate CTPT chapters on-site for long-tail search traffic.
