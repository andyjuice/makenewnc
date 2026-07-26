# [make]new Website Migration — Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Content (Markdown/YAML)     src/content/, src/data/        │
│  ├── pages/*.md              Page copy + frontmatter        │
│  ├── ctpt/*.md               CTPT chapters (phase 2)        │
│  └── data/banner.yaml        Active site announcement       │
└──────────────────────────┬──────────────────────────────────┘
                           │ build time
┌──────────────────────────▼──────────────────────────────────┐
│  Astro 5 Static Site          src/pages/, src/components/   │
│  ├── layouts/               BaseLayout, PageLayout          │
│  ├── components/            Nav, Footer, Banner, Gallery    │
│  └── styles/                Mobile-first tokens + utilities │
└──────────────────────────┬──────────────────────────────────┘
                           │ CI: npm run build
┌──────────────────────────▼──────────────────────────────────┐
│  Cloudflare Pages (preferred) or Netlify                    │
│  ├── CDN + HTTPS + custom domain                            │
│  └── Optional: Cloudflare R2 for large media                │
└─────────────────────────────────────────────────────────────┘

External (link/embed only):
  Instagram, Facebook, YouTube, Google Maps, Google Docs (CTPT phase 1)
```

## Why Astro (vs alternatives)

| Option | Fit |
|--------|-----|
| **Astro** ✓ | Static-first, Markdown collections, minimal JS shipped, excellent agent editability, fast builds |
| Next.js | Heavier; unnecessary for mostly static church site |
| Eleventy | Fine but less component ecosystem than Astro for galleries/video |
| Plain HTML | Poor content reuse and banner pattern |

## Data Flow

1. **Build**: Astro reads Markdown/YAML → generates static HTML.
2. **Deploy**: Git push → Cloudflare Pages webhook → `dist/` served globally.
3. **Banner updates**: Edit `src/data/banner.yaml` → commit → auto-deploy (~2 min).
4. **Page updates**: Edit `src/content/pages/events.md` (or equivalent) → deploy.
5. **Media**: Images in `public/images/` (small) or R2 URLs in frontmatter (large/video).

## Component Responsibilities

| Component | Responsibility |
|-----------|----------------|
| `BaseLayout` | Meta, fonts, banner slot, header, footer |
| `SiteBanner` | Reads `banner.yaml`; dismissible; optional link |
| `HeaderNav` | Mobile hamburger + desktop horizontal nav (6 items) |
| `Footer` | Social icons, email, privacy link |
| `HeroVideo` | Poster + lazy-loaded video (mobile: image fallback) |
| `ValuePillars` | 5 accordion/cards on mobile, grid on desktop — **single content source** |
| `PhotoGallery` | Our Story images with lazy loading |
| `CTPTChapterList` | Chapter cards from content collection |
| `InstagramCTA` | Link + optional oEmbed blockquote from frontmatter URL |
| `MapLink` | External Google Maps link (no embedded iframe needed) |

## State Management

- **No client state framework.** Banner dismiss uses `localStorage` only (optional).
- All content is build-time static.

## Media Strategy

### Inventory (from WP REST API)

- **75 media items** total in WP library.
- **Curate** ~25–30 used in pages; download via `curl` script in `scripts/export-wp-media.sh`.
- **Images**: Convert to WebP, max width 1920px, generate `srcset`.
- **Videos**: `makenew-reel-bw.mp4`, `video-1080p.mp4` — re-encode to WebM 720p OR upload to YouTube and embed.
- **Favicon/logo**: Ship from `public/`.
- **Large gallery**: Consider Cloudflare R2 (`media.makenewnc.org`) to keep git lean.

### Repo vs CDN threshold

- &lt;500KB per asset → `public/images/`
- &gt;500KB or video → R2 or YouTube

## Instagram Integration

**Phase 1 (recommended):** Prominent link + copy on Events (“follow for weekly updates”). Optional static embed URL in frontmatter:

```yaml
instagram:
  profile: https://www.instagram.com/nc.makenew
  featuredPost: https://www.instagram.com/p/DYVXdwMvaTJ/
```

Render as Instagram blockquote + `embed.js` (same as current site) OR screenshot + link for zero-JS.

**Phase 2 (optional):** Meta Graph API token in Cloudflare Worker — only if auto-feed is required (adds ops cost).

## Banner / Popup Editing Pattern

`src/data/banner.yaml`:

```yaml
enabled: true
message: "Friday service moved to 7 PM this week."
link: /events
linkText: "Details"
style: info  # info | urgent
dismissible: true
expires: 2026-06-20
```

- Agents edit one YAML file; no component code changes.
- `expires` auto-hides after date at build time.
- For true popups (modal), same data drives a `ModalAnnouncement` component — use sparingly for mobile UX.

## Mobile-First Approach

1. Design 375px first; pillars as vertical stack / accordion.
2. **Eliminate Elementor duplicates** documented on current site:
   - Home item 2: merge “former atheist” + “college-focused church” into one pillar or two sequential cards.
   - Home item 4: use longer “living in community” copy once.
   - Our Story: remove duplicated Berkeley + Durham paragraphs.
3. Touch targets ≥44px; video does not autoplay with sound on mobile.
4. Performance budget: LCP &lt;2.5s, total page &lt;1MB excluding video stream.

## Responsive Duplicate Map (current WP → new site)

| Location | Desktop-only | Mobile-only | New site action |
|----------|--------------|-------------|-----------------|
| Home pillar 2 | Being pastored by former atheist | Being college-focused church | Two pillars OR combined narrative |
| Home pillar 4 | Long “living life together” | Short variant | Single canonical copy |
| Our Story | Duplicate Berkeley intro | Same text repeated | One paragraph |
| Our Story | Duplicate Durham evolution | Same text repeated | One paragraph |

## Dependencies

- Astro, `@astrojs/mdx` (optional), `sharp` (image opt in build)
- No React required (Astro components sufficient)

## Deployment

- **Cloudflare Pages**: connect GitHub repo, build `npm run build`, output `dist/`
- **DNS**: CNAME `www` → Pages; apex redirect
- **Cost**: $0 on free tier for expected traffic

## Alternatives Considered

| Alternative | Rejected because |
|-------------|------------------|
| Stay on WordPress | Cost, speed, Elementor bloat, poor agent safety |
| Webflow/Squarespace | Less agent-friendly, recurring cost, less creative control at scale |
| Netlify only | Cloudflare R2 + Pages is cheaper integrated media path |
| Decap CMS / Tina | Adds CMS complexity; YAML+Markdown sufficient for this team |

## Implementation Phases

### Phase 0 — Export (1 day)
- Run WP export scripts (pages JSON, media curl, HTML archive)
- Obtain Our Pastor content from WP admin

### Phase 1 — Scaffold + core pages (3–5 days)
- Astro repo, layout, nav, footer, banner pattern
- Home, Events, Our Story, Our Beliefs, Privacy
- Deploy to Cloudflare Pages staging subdomain

### Phase 2 — CTPT + Messages (2 days)
- CTPT index with Google Doc links OR first 2 chapters as MD
- Messages stub page

### Phase 3 — Media + polish (2–3 days)
- Image optimization, hero video strategy
- Our Pastor page when content ready
- Instagram block on Events
- DNS cutover

### Phase 4 — Optional enhancements
- Full CTPT Markdown migration
- R2 media bucket
- Giving link
