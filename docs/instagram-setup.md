# Instagram API setup for [make]new

> **Deprecated for the home carousel** (2026-07-26). The landing-page photo stack now uses `src/data/carousel.yaml` — see [carousel.md](carousel.md). This doc is kept for reference only. Campus Instagram profile links in the site are unaffected.

One-time wiring to auto-fetch the last 5–7 posts for the home carousel. **Free** from Meta; token refresh ~every 60 days is the only ongoing task.

## Prerequisites

1. `@nc.makenew` is an Instagram **Business** or **Creator** account
2. Account is linked to a Facebook Page you admin
3. Free [Meta Developer](https://developers.facebook.com) account

## Step 1 — Create a Meta app

1. [developers.facebook.com/apps](https://developers.facebook.com/apps) → **Create App**
2. Add **Instagram Graph API** product
3. Note your **App ID** and **App Secret** (Settings → Basic)

## Step 2 — Get Instagram User ID

Use [Graph API Explorer](https://developers.facebook.com/tools/explorer/):

1. Select your app
2. Add permissions: `instagram_basic`, `pages_show_list`, `pages_read_engagement`
3. Generate User Access Token (log in as Page admin)
4. Query: `GET /me/accounts` → find your Page ID
5. Query: `GET /{page-id}?fields=instagram_business_account` → save `instagram_business_account.id`

This is your **`INSTAGRAM_USER_ID`**.

## Step 3 — Long-lived access token

Short-lived tokens expire in ~1 hour. Exchange for a 60-day token:

```
GET https://graph.facebook.com/v21.0/oauth/access_token
  ?grant_type=fb_exchange_token
  &client_id={APP_ID}
  &client_secret={APP_SECRET}
  &fb_exchange_token={SHORT_LIVED_TOKEN}
```

Save the result as **`INSTAGRAM_ACCESS_TOKEN`**.

## Step 4 — Cloudflare Pages secrets

Cloudflare Dashboard → Workers & Pages → your project → **Settings** → **Environment variables**:

| Variable | Value |
|----------|-------|
| `INSTAGRAM_ACCESS_TOKEN` | Long-lived token from step 3 |
| `INSTAGRAM_USER_ID` | Numeric ID from step 2 |

Apply to **Production** (and Preview if desired). Redeploy after adding.

## Step 5 — Verify

After deploy, open:

```
https://YOUR_PROJECT.pages.dev/api/instagram
```

Should return JSON: `{ posts: [...], profileUrl: "..." }`.

## Local dev — test the live API

`npm run dev` does not use Cloudflare Functions, but a Vite middleware serves the same `/api/instagram` route when credentials are present.

1. Copy the example env file:

   ```bash
   cp .env.example .env
   ```

2. Fill in `INSTAGRAM_ACCESS_TOKEN` and `INSTAGRAM_USER_ID` (steps 2–3 below).

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Verify the endpoint:

   ```bash
   curl http://localhost:4321/api/instagram
   ```

   You should get `{ "posts": [...], "profileUrl": "..." }` with real image URLs from Instagram.

5. Open the home page — `http://localhost:4321/` — the carousel should show live posts (hover to see “View on Instagram”).

Without `.env` credentials, the carousel falls back to `src/data/instagram-fallback.yaml` automatically.

## Token refresh (every ~50 days)

1. Generate new short-lived token in Graph API Explorer
2. Exchange for new long-lived token (step 3)
3. Update `INSTAGRAM_ACCESS_TOKEN` in Cloudflare

Set a calendar reminder — Meta does not auto-refresh for you.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 503 from `/api/instagram` | Env vars missing in Cloudflare |
| Empty posts array | Account not Business/Creator, or token expired |
| App Review required | Submit for `instagram_basic` if token works in dev but not production |

## Cost

- Meta Graph API: **free**
- Cloudflare Pages Functions: **free** at this traffic level
