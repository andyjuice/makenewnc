# [make]new Website Migration — Specification

## Problem Statement

The current site (https://www.makenewnc.org) runs on WordPress + Elementor. It is slow, expensive to maintain, hard for agents to edit safely, and uses responsive-duplicate content blocks (separate desktop/mobile Elementor sections) that inflate complexity. The church needs a fast, mobile-first static site with creative freedom, minimal hosting cost, and easy banner/announcement editing.

## Goals

- **Mobile-first** single responsive layout (no desktop/mobile duplicate sections).
- **Fast & cheap**: static hosting (Cloudflare Pages or Netlify free tier).
- **Agent-friendly editing**: Markdown/YAML content, clear file structure, documented patterns.
- **Preserve core ministry content**: home pitch, events schedule, beliefs, story, CTPT resource.
- **Instagram prominence** (optional): link + embed on Events; no fragile scraping required.
- **Easy banner/popup editing** without a CMS login.

## Non-Goals

- Rebuilding WordPress admin or a full headless CMS.
- Automated Instagram feed scraping (API limits, token maintenance).
- Live streaming / virtual service infrastructure (Messages page already defers to Facebook).
- E-commerce, donations portal, or member login (unless added later).

## User-Facing Behavior

### Global

- Persistent header nav: Our Story, Our Beliefs, Events, Messages, Christian Themes for Privileged Teens.
- Footer: social links (Instagram, Facebook, YouTube), email `makenewchurch@gmail.com`.
- Optional dismissible site banner (announcements, schedule changes) editable via `src/data/banner.yaml`.
- All pages load in &lt;2s on mobile on typical connections.

### Pages

| Route | Behavior |
|-------|----------|
| `/` | Hero video/image, “church for people who don't like church”, 5 value pillars (merged responsive content), CTA to Events + CTPT link |
| `/our-story` | Timeline narrative Berkeley → Durham, photo gallery |
| `/our-beliefs` | Statement of faith (static prose) |
| `/events` | Friday + Sunday gatherings, address, map link, Instagram CTA + optional embed |
| `/messages` | Short note: recordings on Facebook; email for archived Zoom requests |
| `/christian-themes-for-privileged-teens` | CTPT intro + 8 chapter index linking to on-site MD pages OR external Google Docs |
| `/our-pastor` | Pastor bio (content currently password-protected on WP — must be supplied) |
| `/privacy` | Minimal privacy policy for static site (no comments/forms unless added) |

### Hidden / Legacy

- `/our-pastor` not in primary nav today; decide public vs internal.
- WP author archive, Hello World post — do not migrate.
- Privacy policy linked from footer only.

## System Constraints

- Domain: `makenewnc.org` (use `www` canonical; redirect apex).
- Gathering address: 721 Broad Street, Durham NC 27705.
- External dependencies: Google Maps short link, Instagram, Facebook videos, YouTube channel, Google Docs (CTPT chapters if not migrated inline).

## Edge Cases

- **Schedule changes**: Events page must be easy to update; banner pattern for urgent overrides.
- **Our Pastor**: WP content is password-protected; migration blocked until plaintext bio + photos provided.
- **CTPT**: 10 Google Doc links; migrating inline improves SEO and agent editability but is a large content lift.
- **Instagram embed**: oEmbed/blockquote may break without script; prefer link-out + optional static screenshot hero.
- **Video assets**: `makenew-reel-bw.mp4` and `video-1080p.mp4` are large; prefer compressed WebM + poster or YouTube upload.

## Content Inventory — Retain / Drop / Transform

### RETAIN (migrate)

| Asset | Notes |
|-------|-------|
| Home — hero + 5 pillars | Merge desktop/mobile variants into one adaptive section per pillar |
| Home — “I'm sold. What's next?” CTA | Link to `#about-us` / Events |
| Events — Fridays 6:30–8 PM | Intellectual talks + social time, dinner provided |
| Events — Sundays 11 AM–12 PM | Genesis worship, snacks after |
| Events — address + Get Directions | `https://goo.gl/maps/yjxDn7DZ12JVTvdS6` |
| Events — “24/7 church” Instagram pitch | Keep as Events footer section |
| Our Story — Berkeley 2012 origin | Remove duplicate responsive blocks |
| Our Story — Durham 2017, Duke focus | Photo gallery (~19 images in WP content) |
| Our Beliefs — Statement of Faith | Short doctrinal prose |
| CTPT — intro + 8 chapters | Chapters 1–8 with Google Doc links today |
| Messages — Facebook recordings note | Short page or fold into Events/Footer |
| Social links | IG `nc.makenew`, FB `makenewfellowship`, YT `@ncmakenew` |
| Brand assets | Logo `mn-logowebsite_black-01`, favicon, 2024 logo variants |
| Hero video | `makenew-reel-bw.mp4` (optimize or replace) |

### TRANSFORM

| Current | New approach |
|---------|--------------|
| Elementor responsive duplicates | Single CSS breakpoint layout |
| CTPT Google Docs | Phase 1: keep doc links; Phase 2: Markdown chapters in `src/content/ctpt/` |
| Messages page | Reduce to stub + prominent Facebook link |
| Instagram post embed | Optional static embed URL in `events.md` frontmatter |
| 75 WP media items | Curate ~25–30 used on site; optimize WebP; rest archive |

### DROP

| Asset | Reason |
|-------|--------|
| Hello World WP post | Default install cruft |
| WP author archive | Not linked, no value |
| Generic WP privacy policy boilerplate | Replace with minimal static policy |
| Elementor screenshots, Lottie JSON, unused stock photos | Not used in UX |
| Password-gated pastor page shell | Replace when real content available |
| Facebook duplicate path variants | Normalize to canonical URLs |

### BLOCKED (needs human input)

| Item | Action needed |
|------|----------------|
| Our Pastor bio, photos | Export from WP admin or rewrite |
| CTPT full text migration | Author decision: keep Google Docs vs on-site |
| Donations / giving | Not present today; confirm if wanted |

## Open Questions

1. Should **Our Pastor** be public in nav or remain secondary/hidden?
2. **CTPT**: migrate chapter bodies to Markdown now, or keep Google Docs for Phase 1?
3. **Messages**: standalone page vs footer link only?
4. **Instagram**: link-only vs embedded latest post on Events?
5. **Giving**: any planned donation flow?
