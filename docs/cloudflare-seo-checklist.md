# SEO launch checklist — Cloudflare & manual steps

Complete these after merging and deploying the SEO PR. The codebase handles sitemaps, meta tags, schema, and `/messages`; **you** must configure DNS, redirects, and search consoles.

---

## 1. Cloudflare DNS & domain (required)

### A. Point `www` at Cloudflare Pages

1. Cloudflare Dashboard → **Workers & Pages** → your project → **Custom domains**
2. Add **`www.makenewnc.org`**
3. DNS should auto-create: `CNAME www → <project>.pages.dev`

### B. Redirect apex → www (canonical host)

The site emits canonical URLs as `https://www.makenewnc.org/...`. Apex must redirect.

1. Cloudflare Dashboard → **Rules** → **Redirect Rules** (or Bulk Redirects)
2. Create rule:
   - **If:** Hostname equals `makenewnc.org`
   - **Then:** Dynamic redirect to `https://www.makenewnc.org${uri.path}` (301, preserve path + query)
3. Test: `curl -I https://makenewnc.org/our-story` → should 301 to `https://www.makenewnc.org/our-story/`

### C. Enforce HTTPS

Cloudflare → **SSL/TLS** → **Full (strict)**  
Edge Certificates → **Always Use HTTPS**: ON

---

## 2. Verify deploy artifacts (5 minutes after push to `main`)

Open in a browser (replace with your Pages URL before cutover):

| URL | Expected |
|-----|----------|
| `/robots.txt` | `Sitemap: https://www.makenewnc.org/sitemap-index.xml` |
| `/sitemap-index.xml` | XML index listing sitemap |
| `/sitemap-0.xml` | 11 URLs (home, about, story, beliefs, CTPT, locations × 4, messages, privacy) |
| `/` View Source | `<link rel="canonical"`, `og:title`, `application/ld+json` |
| `/locations/duke/` View Source | Place + Event JSON-LD blocks |

---

## 3. Google Search Console (required)

1. Go to [Google Search Console](https://search.google.com/search-console)
2. **Add property:** `https://www.makenewnc.org` (URL-prefix or Domain property)
3. Verify via DNS TXT record (Cloudflare DNS → Add record) or HTML file upload
4. **Sitemaps** → Submit: `https://www.makenewnc.org/sitemap-index.xml`
5. **URL Inspection** → Test a few URLs (`/`, `/locations/duke/`, `/our-story/`)
6. **Settings → Change of address** (if replacing old WP on same domain): point old property to new if applicable

### Monitor for 4–8 weeks

- **Pages** → Indexed vs not indexed
- **Performance** → Queries that dropped (especially `events`, `messages`)
- **Page indexing** → Fix any "Redirect" or "Duplicate" issues

---

## 4. Bing Webmaster Tools (recommended)

1. [Bing Webmaster](https://www.bing.com/webmasters) → Add site `https://www.makenewnc.org`
2. Import from Google Search Console (fastest) or verify separately
3. Submit same sitemap URL

---

## 5. Google Business Profile (high impact for local search)

Not configurable in code. Do this manually:

1. [Google Business Profile](https://business.google.com) → claim or update listing for **[make]new**
2. **NAP must match** `src/data/campuses.yaml` exactly:
   - Name: `[make]new` (or consistent variant)
   - Address: 721 Broad Street, Durham, NC 27705 (Duke campus)
   - Phone: (919) 407-8578
   - Website: `https://www.makenewnc.org`
3. Add categories: Church, Religious organization
4. Add Friday / Sunday hours to match campus page
5. Link to Instagram/Facebook/YouTube from profile

Repeat or create listings for NC State / UNC when you have physical addresses.

---

## 6. Assets you should upload (one-time)

### Social preview image (recommended)

Add **`public/images/og-default.jpg`** — **1200 × 630 px**, branded (logo + tagline or photo).  
Until this exists, shares use `makenew-icon.png` (small, not ideal for Facebook/iMessage previews).

After adding, commit and push — no code changes needed.

---

## 7. Optional Cloudflare enhancements

| Feature | Where | Benefit |
|---------|-------|---------|
| **Cloudflare Web Analytics** | Pages project → Metrics | Free traffic stats, no cookie banner |
| **Brotli** | Speed → Optimization | Smaller HTML (already gzip’d by build) |
| **Polish** (Pro) | Speed → Image Optimization | Lossless/lossy image compression at edge |

---

## 8. Editing SEO copy going forward

| What | Where |
|------|-------|
| Page meta descriptions | `seoDescription` in `content/*.md` frontmatter |
| Home crawlable intro | `seoIntro` in `content/home.md` |
| Site tagline (fallback description) | `src/data/site.yaml` → `tagline` |
| Campus local SEO text | `src/data/campuses.yaml` → `description`, `address`, `services` |
| Carousel image alt text | `src/data/carousel.yaml` → `alt` per card |
| Default share image | `public/images/og-default.jpg` |

Commit → push to `main` → Cloudflare rebuilds (~1–2 min).

---

## 9. Post-launch content wins (your team, not code)

- [ ] Update external links that still point to `/events` → `/locations`
- [ ] Add `/messages` link somewhere visible if you want that traffic (page exists; not in nav today)
- [ ] Migrate 1–2 CTPT chapters on-site (big long-tail SEO lift vs Google Doc links)
- [ ] Publish 2–4 `/updates` posts per year (optional future route)

---

## Quick test commands

```bash
curl -sI https://www.makenewnc.org/ | head -5
curl -s https://www.makenewnc.org/robots.txt
curl -s https://www.makenewnc.org/sitemap-index.xml
```
