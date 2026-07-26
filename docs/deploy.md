# Deploying [make]new to Cloudflare Pages

This site deploys via **git push** — no direct deploy from Cursor unless you install a Cloudflare MCP or run `wrangler` manually.

## Prerequisites

- GitHub account (for the church repo)
- Cloudflare account (free tier)
- Domain `makenewnc.org` in Cloudflare DNS (for production cutover)

## One-time setup

### 1. Push to GitHub

```bash
cd /path/to/makenew-2.0
git init   # if not already
git add .
git commit -m "Initial Astro prototypes for makenewnc.org"
git branch -M main
git remote add origin git@github.com:YOUR_ORG/makenewnc.git
git push -u origin main
```

Add church members as collaborators on the GitHub repo.

### 2. Connect Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Select the `makenewnc` repository
3. Build settings:
   - **Framework preset:** Astro (or None)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node version:** 20 (or 22 when available on Pages)
4. Deploy

Cloudflare assigns a URL like `https://makenewnc.pages.dev`.

### 3. Preview on your phone

Open:

- `https://YOUR_PROJECT.pages.dev/` — production home

## Home carousel

Edit `src/data/carousel.yaml` and add images under `public/images/carousel/`. See [docs/carousel.md](carousel.md).

## Ongoing deploys

Any push to `main` triggers a new build (~1–2 minutes).

**To publish a change:**

1. Edit content in `content/`, `src/data/site.yaml`, or `src/data/announcements.yaml`
2. Commit and push to `main`
3. Wait for Cloudflare build to finish

Church members with GitHub access can merge PRs to deploy — no Cursor required.

## Announcements (no deploy code changes)

Edit `src/data/announcements.yaml`:

```yaml
topBar:
  enabled: true    # thin bar above nav
  triggerPopup: false  # true = bar CTA opens popup
popup:
  enabled: true    # modal on load (and for triggerPopup)
```

Campus times and addresses: `src/data/campuses.yaml`

Commit and push. Both respect `expires` dates at build time.

## Production domain (after design selection)

1. Cloudflare Pages → your project → **Custom domains** → add `www.makenewnc.org`
2. DNS: CNAME `www` → `YOUR_PROJECT.pages.dev`
3. Redirect apex `makenewnc.org` → `www` (Cloudflare bulk redirect rule)

See `docs/production-promotion.md` after picking a prototype winner.

## Manual deploy (optional)

```bash
npm run build
npx wrangler pages deploy dist --project-name=makenewnc
```

Requires `npx wrangler login` once.
