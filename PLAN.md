# [make]new Website Migration — Actionable Plan

> **Status:** Ready to execute  
> **Source audit:** WP REST API + curl HTML (2026-06-12)  
> **Workspace:** `/Users/andyju/Code/makenew-2.0` (greenfield)

## Executive Summary

Replace WordPress/Elementor with a **mobile-first Astro static site** on **Cloudflare Pages** ($0). Content lives in Markdown/YAML for agent-friendly edits. Migrate 6 core pages + CTPT resource; simplify Messages; unblock Our Pastor with exported content. Eliminate Elementor desktop/mobile duplicate sections by using single responsive components.

---

## 1. Site Audit Results

### Published Pages (WP REST + sitemap — 8 total)

| ID | Slug | Title | Nav? | Last modified |
|----|------|-------|------|---------------|
| 11 | `elementor-11` | Home | — | 2026-05-15 |
| 46 | our-story | Our Story | ✓ | 2025-08-11 |
| 48 | our-beliefs | Our Beliefs | ✓ | 2023-09-02 |
| 50 | our-pastor | Our Pastor | ✗ | 2023-08-04 |
| 52 | christian-themes-for-privileged-teens | CTPT | ✓ | 2023-09-10 |
| 54 | messages | Messages | ✓ | 2025-08-11 |
| 66 | events | Events | ✓ | 2025-08-11 |
| 3 | privacy-policy | Privacy Policy | footer | 2023-08-31 |

### Navigation (from homepage HTML)

- Our Story → `/our-story/`
- Our Beliefs → `/our-beliefs/`
- Events → `/events/`
- Messages → `/messages/`
- Christian Themes for Privileged Teens → `/christian-themes-for-privileged-teens/`

### Social & Contact

| Channel | URL |
|---------|-----|
| Instagram | https://www.instagram.com/nc.makenew |
| Facebook | https://www.facebook.com/makenewfellowship |
| YouTube | https://www.youtube.com/@ncmakenew |
| Email | makenewchurch@gmail.com |
| Maps | https://goo.gl/maps/yjxDn7DZ12JVTvdS6 |

### Media Library

- **75 items** (images, videos, SVG, Lottie JSON)
- Key assets: logo, favicon, hero videos (`makenew-reel-bw.mp4`), Our Story gallery (~19 images), 2024 logo variants

### Elementor Responsive Duplicates (consolidate in migration)

**Home — “church looks like” pillars:**

| # | Desktop-visible | Mobile-visible | Canonical copy strategy |
|---|-----------------|----------------|-------------------------|
| 1 | Meeting in dance studio | same | Keep |
| 2 | Being pastored by former atheist | Being college-focused church | **Split into 2 pillars** OR one merged “Who we are” section |
| 3 | Encouraging questions | same | Keep |
| 4 | Living life together (long) | Living life together (short) | **Use long copy** |
| 5 | Sharing the Gospel | same | Keep |

**Our Story:** Berkeley intro and Durham evolution paragraphs each appear **twice** (responsive duplication) — use one instance each.

### Blocked Content

- **Our Pastor:** Password-protected on live site; WP API `content.rendered` is empty. Requires WP admin export or new copy.

### CTPT Chapters (8 + Google Docs)

1. Who cares  
2. Is Atheism Absurd?  
3. Does God Exist?  
4. Missing God  
5. Finding God  
6. Heaven and Hell  
7. Jesus and the Cross  
8. Decisions  

Each chapter links to a Google Doc (10 doc URLs in page content).

---

## 2. Retain / Drop Matrix

| Content | Action | Priority |
|---------|--------|----------|
| Home hero + pillars + CTA | **Retain, redesign** | P0 |
| Events (Fri/Sun schedule, address) | **Retain** | P0 |
| Our Story + gallery | **Retain, dedupe** | P0 |
| Our Beliefs | **Retain** | P0 |
| CTPT index + chapters | **Retain** (docs phase 1) | P1 |
| Messages (Facebook note) | **Minimize** | P1 |
| Privacy | **Retain, simplify** | P2 |
| Our Pastor | **Retain when unblocked** | P2 |
| Hello World post | **Drop** | — |
| Author archive | **Drop** | — |
| Unused WP media | **Drop / archive** | P2 |

---

## 3. Technical Stack

```
Astro 5 + TypeScript
├── Content: src/content/pages/*.md, src/content/ctpt/*.md
├── Config: src/data/banner.yaml, src/data/site.yaml (social, address)
├── Components: Astro (.astro) — no React unless needed
├── Styles: mobile-first CSS (or Tailwind if preferred)
└── Build output: dist/

Hosting: Cloudflare Pages (primary) | Netlify (fallback)
Media: public/images/ + optional Cloudflare R2
CI: GitHub Actions or Cloudflare built-in
```

### Banner editing (agents)

Edit `src/data/banner.yaml`:

```yaml
enabled: true
message: "Schedule change this Friday."
link: /events
expires: 2026-06-20
```

### Site config (agents)

Edit `src/data/site.yaml` for social URLs, address, service times.

---

## 4. Implementation Checklist

### Phase 0 — Export & unblock (Day 1)

- [ ] `scripts/export-wp-content.sh` — curl WP JSON for all pages
- [ ] `scripts/export-wp-media.sh` — download curated media list
- [ ] Archive HTML snapshots to `archive/wp-html/` for reference
- [ ] **Human:** Export Our Pastor from WP or provide new bio + photos
- [ ] **Human:** Confirm CTPT strategy (Google Docs vs Markdown)

### Phase 1 — Scaffold (Days 2–3)

- [ ] `npm create astro@latest` with strict TS
- [ ] `BaseLayout`, `HeaderNav`, `Footer`, `SiteBanner`
- [ ] `src/data/site.yaml` with audited social/address data
- [ ] Mobile nav pattern (hamburger)
- [ ] AGENTS.md with edit instructions

### Phase 2 — Core pages (Days 4–6)

- [ ] Home: `HeroVideo`, `ValuePillars` (5 items, no duplicates), CTA
- [ ] Events: service cards, map link, Instagram CTA
- [ ] Our Story: narrative + `PhotoGallery`
- [ ] Our Beliefs: statement of faith
- [ ] Privacy: minimal static policy

### Phase 3 — Secondary content (Days 7–8)

- [ ] CTPT index page + chapter links (Google Docs phase 1)
- [ ] Messages stub → Facebook link + email note
- [ ] Our Pastor page (when content available)

### Phase 4 — Media & perf (Days 9–10)

- [ ] Optimize images → WebP + srcset
- [ ] Hero video: WebM 720p or YouTube embed
- [ ] Lighthouse mobile ≥90 performance
- [ ] `public/robots.txt`, `sitemap` via `@astrojs/sitemap`

### Phase 5 — Deploy & cutover (Day 11)

- [ ] Cloudflare Pages project from GitHub
- [ ] Staging URL review
- [ ] DNS: `www.makenewnc.org` → Pages, apex redirect
- [ ] Redirect map: all old slugs → new paths (same slugs preserved)
- [ ] Decommission WP hosting after 30-day rollback window

---

## 5. Redirect Map (preserve URLs)

| Old path | New path |
|----------|----------|
| `/` | `/` |
| `/our-story/` | `/our-story/` |
| `/our-beliefs/` | `/our-beliefs/` |
| `/events/` | `/events/` |
| `/messages/` | `/messages/` |
| `/christian-themes-for-privileged-teens/` | `/christian-themes-for-privileged-teens/` |
| `/our-pastor/` | `/our-pastor/` |
| `/privacy-policy/` | `/privacy/` |

---

## 6. Cost Estimate

| Item | Monthly cost |
|------|--------------|
| Cloudflare Pages | $0 |
| Domain (existing) | ~$12–15/year |
| R2 (optional) | $0–2 |
| **Total** | **~$0–2/mo** |

---

## 7. Locked Decisions (2026-06-12)

| Decision | Choice |
|----------|--------|
| Our Pastor | **Drop** — page not migrating |
| CTPT | **Keep Google Docs** — index page links out to existing docs |
| Messages | **Footer/social only** — remove from main nav |
| Instagram | **Link only** — no API/embed in v1 |
| Giving | **Not in v1** |

---

## 8. Next Command (when approved)

```bash
cd /Users/andyju/Code/makenew-2.0
npm create astro@latest . -- --template minimal --typescript strict --install --git
```

Then implement Phase 1 scaffold per `architecture/makenew-website-migration.md`.
