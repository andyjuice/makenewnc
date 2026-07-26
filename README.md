# [make]new website (Astro)

Mobile-first static site replacing WordPress/Elementor. **Instagram Gateway** is the production design with dark/light mode via the header toggle.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:4321/](http://localhost:4321/) on your phone or desktop.

## Site routes

| Route | Page |
|-------|------|
| `/` | Home — tagline + photo carousel |
| `/what-were-about` | What we're about |
| `/locations` | Campus picker (Duke, NC State, UNC) |
| `/our-story` | Our Story |
| `/our-beliefs` | Our Beliefs |
| `/christian-themes-for-privileged-teens` | CTPT |
| `/privacy` | Privacy policy |

## Edit content (no code)

| What | Where |
|------|-------|
| Announcements | `src/data/announcements.yaml` |
| Hero taglines & pillars | `content/home.md` |
| Home carousel | `src/data/carousel.yaml` + `public/images/carousel/` |
| Campuses | `src/data/campuses.yaml` |
| Brand & social | `src/data/site.yaml` |

## Deploy

Push to GitHub → Cloudflare Pages. See [docs/deploy.md](docs/deploy.md).

Agent guide: [AGENTS.md](AGENTS.md)
