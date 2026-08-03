# Cloudflare & SEO setup — step-by-step guide

This guide assumes your church website domain is **`makenewnc.org`** (what this repo is configured for). If you actually use a different name (e.g. `makenew.org`), replace `makenewnc.org` with your real domain everywhere below — but tell whoever maintains the code so `astro.config.mjs` matches.

---

## Glossary (read this first)

| Term | Plain English |
|------|----------------|
| **Domain** | The name people type in the browser, e.g. `makenewnc.org` |
| **www** | A prefix in front of the domain: `www.makenewnc.org` — not a separate purchase |
| **Apex** (also called **root** or **bare domain**) | The domain **without** `www`: `makenewnc.org` |
| **DNS** | Settings that tell the internet “when someone asks for this domain, send them to this server” |
| **Cloudflare Pages** | Where your Astro site is built and hosted (like the building) |
| **Redirect** | “If someone visits address A, automatically send them to address B” |
| **HTTPS** | The padlock / secure version (`https://`) |

### “I have two domains: makenew.org and www.makenew.org”

Usually you only **buy one** domain (e.g. `makenewnc.org`). The `www` version is **not** a second registration — it’s just another way to reach the same site, like a nickname.

- `makenewnc.org` → apex / bare domain  
- `www.makenewnc.org` → same site, with `www` in front  

**You want both to work for visitors, but Google should only index ONE primary address.** This project uses **`https://www.makenewnc.org`** as that primary address (the “canonical” URL in every page’s HTML).

So the goal is:

1. **`www.makenewnc.org`** → shows your website (hosted on Cloudflare Pages)  
2. **`makenewnc.org`** (no www) → automatically forwards to `www.makenewnc.org`  

That forward is what people mean by **“redirect apex to www.”** It is not a third domain — it’s a rule that says “bare domain → www version.”

---

## Part 1 — Cloudflare Pages (connect your website)

### Step 1: Open your Pages project

1. Log in at [https://dash.cloudflare.com](https://dash.cloudflare.com)  
2. Left sidebar → **Workers & Pages**  
3. Click your site project (the one that builds from GitHub when you push `main`)

### Step 2: Add the www address to Pages

1. In the project, open the **Custom domains** tab  
2. Click **Set up a custom domain** (or **Add domain**)  
3. Type: **`www.makenewnc.org`**  
4. Click **Continue** / **Activate domain**

Cloudflare will usually add a DNS record for you automatically:

- **Type:** CNAME  
- **Name:** `www`  
- **Target:** something like `your-project-name.pages.dev`

**How to check it worked:** After DNS propagates (often 5–30 minutes, sometimes up to a few hours), open `https://www.makenewnc.org` in a browser. You should see your Astro site, not a Cloudflare error page.

---

## Part 2 — Make `makenewnc.org` forward to `www.makenewnc.org`

Cloudflare **often does not** show a “Redirect to www” button when you add the bare domain. That’s normal. You create a **Redirect Rule** instead (takes about 2 minutes).

### Before you start — DNS check

The bare domain must exist in DNS with the **orange cloud ON** (proxied):

1. Cloudflare home → click **`makenewnc.org`** (the domain, not Pages)  
2. **DNS** → **Records**  
3. Look for a row where **Name** is **`@`** (that means the bare domain)

| If you see… | Do this |
|-------------|---------|
| **No `@` record** | Pages → your project → **Custom domains** → add **`makenewnc.org`** (no www). Cloudflare should create DNS for you. You do **not** need a redirect checkbox. |
| **`@` record exists, grey cloud** | Click the cloud so it turns **orange** (proxied). Redirect rules only work when proxied. |
| **`@` already points to Pages and shows the site** | That’s OK — add the Redirect Rule below anyway; it runs before the site is served. |

---

### Step 3: Create the redirect rule (recommended method — wildcard)

1. Cloudflare home → click **`makenewnc.org`**  
2. Left sidebar → **Rules**  
3. Click **Redirect Rules** (under Rules, not “Page Rules”)  
4. Click **Create rule** (or **+ Create rule**)

**Rule name:** `Bare domain to www`

**When incoming requests match** — choose **Wildcard pattern** (not “Custom filter” unless you prefer that):

| Field | Value |
|-------|-------|
| **Request URL** | `https://makenewnc.org/*` |

**Then** — URL redirect:

| Field | Value |
|-------|-------|
| **Type** | Static (wildcard) — *not* Dynamic, for this method* |
| **Target URL** | `https://www.makenewnc.org/${1}` |
| **Status code** | **301** |
| **Preserve query string** | **ON** / checked |

\*If your UI only shows “Dynamic”, use Method B below instead.

5. Click **Deploy** (top right)

**Optional second rule for HTTP:** Repeat with Request URL `http://makenewnc.org/*` → same target. Or turn on **Always Use HTTPS** in Part 3 (usually enough).

---

### Method B — if you don’t see “Wildcard pattern”

Use **Custom filter expression** (or the visual builder):

**When incoming requests match:**

| Field | Operator | Value |
|-------|----------|-------|
| Hostname | equals | `makenewnc.org` |

**Then:**

| Field | Value |
|-------|-------|
| Type | **Dynamic** |
| Expression | `concat("https://www.makenewnc.org", http.request.uri.path)` |
| Status code | **301** |
| Preserve query string | **ON** |

Deploy the rule.

---

### Step 4: Test (no terminal needed)

Open a **private/incognito** browser window:

1. Go to `https://makenewnc.org`  
2. The address bar should change to `https://www.makenewnc.org`  
3. Try `https://makenewnc.org/our-story` → should land on `https://www.makenewnc.org/our-story/`

**If it doesn’t redirect:**

- Wait 5–10 minutes and try again (rules can take a moment)  
- Confirm the Redirect Rule shows **Active** under Rules → Redirect Rules  
- Confirm DNS has `@` with **orange cloud**  
- Confirm you edited rules on **`makenewnc.org`**, not a different zone

---

### What if adding `makenewnc.org` in Pages made the site load on both addresses?

That’s fine short-term. The Redirect Rule still sends bare-domain visitors to www. Long-term you want only **www** serving the site and **bare domain** only redirecting — the rule above does that.

**Do not** use “Page Rules” (older feature) unless Redirect Rules aren’t available on your plan — Redirect Rules are the current approach.

---

## Part 3 — HTTPS (padlock)

1. Cloudflare dashboard → your domain → **SSL/TLS**  
2. **Overview** → encryption mode: **Full (strict)** (if Pages + Cloudflare; use **Full** if strict causes errors)  
3. **Edge Certificates** → turn **Always Use HTTPS** **ON**

---

## Part 4 — Confirm SEO files after deploy

After your latest code is deployed to Pages, visit these URLs in a browser:

| URL | What you should see |
|-----|---------------------|
| `https://www.makenewnc.org/robots.txt` | Text mentioning `Sitemap: https://www.makenewnc.org/sitemap-index.xml` |
| `https://www.makenewnc.org/sitemap-index.xml` | XML file (browser may show tags) |
| `https://www.makenewnc.org/` → right-click → **View page source** | Search for `canonical` and `og:title` |

---

## Part 5 — Google Search Console (tell Google about the new site)

1. Go to [https://search.google.com/search-console](https://search.google.com/search-console)  
2. **Add property** → choose **URL prefix** → enter `https://www.makenewnc.org`  
3. **Verify ownership** — easiest method with Cloudflare:
   - Choose **Domain name provider** or **DNS record**
   - Copy the TXT record Google gives you
   - Cloudflare → **DNS** → **Add record** → Type **TXT**, paste value, save
   - Back in Search Console, click **Verify**
4. Left menu → **Sitemaps** → add: `https://www.makenewnc.org/sitemap-index.xml` → **Submit**
5. Optional: **URL inspection** → paste `https://www.makenewnc.org/` → **Request indexing** for home and a few key pages

Check back weekly for a month or two under **Pages** and **Performance** to see if old WordPress URLs are being replaced.

---

## Part 6 — Google Business Profile (local “church near me”)

This is separate from the website but important for Durham search.

1. [https://business.google.com](https://business.google.com) → find or claim **[make]new**  
2. Make sure these match `src/data/campuses.yaml`:
   - Address: **721 Broad Street, Durham, NC 27705**
   - Phone: **(919) 407-8578**
   - Website: **https://www.makenewnc.org**
3. Set hours: Friday 6:30–8 PM, Sunday 11 AM–12 PM (Duke campus)

---

## Part 7 — Optional but recommended

### Social preview image

Add a file **`public/images/og-default.jpg`** (1200×630 pixels) to the repo, commit, and push. Until then, link previews use the small logo.

### Bing

[https://www.bing.com/webmasters](https://www.bing.com/webmasters) → add site → can import from Google Search Console.

---

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| `www` shows “host error” or SSL warning | Wait 30–60 min for DNS; confirm CNAME in DNS tab points to `.pages.dev` |
| Bare domain doesn’t redirect | Add `makenewnc.org` in Pages custom domains **or** fix Redirect Rule in Part 2 |
| Site works on `*.pages.dev` but not custom domain | Custom domain not added in Pages, or DNS not proxied (orange cloud) |
| Wrong domain entirely (`makenew.org` vs `makenewnc.org`) | Confirm which domain the church actually uses publicly; update DNS for **that** domain and ask dev to update `astro.config.mjs` `site:` URL |

---

## Editing SEO text later (no Cloudflare needed)

| What | File |
|------|------|
| Page descriptions in Google results | `seoDescription` in `content/*.md` |
| Home paragraph for search engines | `seoIntro` in `content/home.md` |
| Campus address / hours | `src/data/campuses.yaml` |

Push to `main` → Cloudflare rebuilds automatically.
