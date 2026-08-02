# What we're about — FART rework architecture

See `specs/about-page-fart-rework.md` for the problem statement and
user-facing behavior this implements.

## Component/data map

```
content/home.md (aboutIntro, differentiator, characteristics)
  └── getHome() [src/lib/content.ts]
        └── src/pages/what-were-about.astro
              ├── diff.intro            → split into <p class="about-body"> paragraphs
              ├── diff.items[].summary  → <p class="about-summary"> (bold, existing global style)
              └── diff.items[].body     → <p class="fart-item__body" set:html={...}> (muted, smaller)

content/home.md characteristics[].aboutAnchor
  └── src/components/GatewayTagline.astro → `${aboutPath}#${aboutAnchor}` (home page deep-links)
```

`content/home.md` no longer has a `pillars` field — the "Our values"
section and its three pillars were removed (see below), and the field was
deleted from both the content file and the `HomeContent` type rather than
left unused.

## Data flow

1. `content/home.md` is the single source of truth for all About-page copy
   (subheader, FART title/intro/items). No other file duplicates this
   content.
2. `getHome()` reads and parses the YAML front matter at build time (via
   `gray-matter`); no runtime fetch.
3. `what-were-about.astro` renders exactly two things: the title/subheader,
   then one `<section id="fart">` containing the FART intro paragraphs and
   the four cards. There is no "Our values" or "Always on" section anymore.
4. The home page's cycling tagline (`GatewayTagline.astro`) builds its
   href as `/what-were-about#{aboutAnchor}` per characteristic, so any
   `id` used in `what-were-about.astro` must have a matching
   `aboutAnchor` value in `content/home.md` for the ones that link there.
   Four of the five characteristics now point at `#fart` (or, for the
   Reason-specific one, `#fart-reason`) since that's the only remaining
   section — see "Removing 'Our values' and 'Always on' entirely" below.

## Why `set:html` for `DifferentiatorItem.body`

The Reason card needed two things previous plain-text bodies didn't:

1. A definition tooltip for "apologetics" (a term most visitors won't know).
2. A link to `/christian-themes-for-privileged-teens` (CTPT) so the "we take
   this seriously" claim points somewhere concrete.

### Alternatives considered

| Approach | Why not |
|---|---|
| Special-case the Reason card in the `.map()` loop (hardcode the link/tooltip markup in the `.astro` file, keep `body` as plain text) | Splits the Reason copy across two files (partial copy in YAML, partial in template); harder for a non-technical editor to find and change the full sentence. |
| Build a reusable interactive tooltip component (button + `role="tooltip"` panel, like `GatewayTagline`'s footnote) | Overkill for a single inline word — that component exists to solve touch-accessibility for a *timed, disappearing* cycling phrase. A static paragraph doesn't have that problem; a native `<abbr title="...">` already works on hover *and* is reachable via keyboard focus in most browsers, with zero JS. |
| Add a generic `bodyHtml?: string` field alongside `body: string` | Redundant — nothing currently needs both a plain-text and rich-text version of the same field, so keeping one `body: string` field that is documented as "may contain trusted inline HTML" is simpler. |

### Tradeoffs of the chosen approach (plain `body` field, rendered via `set:html`)

| Gain | Cost |
|---|---|
| One field, one place to edit a FART card's full copy | `content/home.md` becomes a place where an editor *could* accidentally break HTML (unclosed tag) — acceptable because this file is edited by trusted maintainers/agents, not end users |
| No new component/JS needed for the tooltip | `set:html` bypasses Astro's automatic escaping, so this field must stay writer-trusted (documented on the `DifferentiatorItem.body` type in `src/lib/content.ts`) |
| `<abbr title="...">` tooltip works with zero JavaScript and is keyboard/hover accessible by default | No touch-tap "click to reveal" behavior on mobile (acceptable for a nice-to-have definition, unlike the home-page footnote which is load-bearing information) |

### Scoping note

Astro's `<style>` blocks scope selectors by adding a `data-astro-cid-*`
attribute to elements it compiles. Markup injected via `set:html` (the
`<a>`/`<abbr>` inside `item.body`) is **not** touched by that scoping, so
descendant selectors targeting it must use `:global()`:

```css
.fart-item__body :global(abbr) { ... }
.fart-item__body :global(a) { ... }
```

## Why "Intellectual rigor" was removed, not just reworded

The pillar's summary ("College-level seriousness about faith questions.")
was already identical to the FART Reason card's summary, and its body
covered the same ground (hard questions, "just believe" isn't good enough,
[make]new Fridays). Rather than keep two sections saying the same thing in
slightly different words, its unique details (fine-tuned universe,
historicity of the Bible, the "just believe" framing) were folded into the
Reason card's body, and the home-page tagline anchor that pointed at
`#intellectual-rigor` was repointed at `#fart-reason`.

## Removing "Our values" and "Always on" entirely (follow-up, same review pass)

After the FART cards got real content (see above), review feedback judged
that "Our values" (Mobility, Living life together, Sharing the Gospel) and
"Always on" (the Instagram pitch) no longer added anything FART didn't
already cover in more depth, and asked for them to be cut rather than
further trimmed.

**What changed:**

- `content/home.md`: removed the `pillars` list entirely (all three
  entries, not just the previously-folded "Intellectual rigor").
- `src/lib/content.ts`: removed the now-unused `Pillar` type and the
  `pillars` field from `HomeContent` — deleted outright rather than left as
  dead content-model surface, since its one consumer was gone.
- `what-were-about.astro`: removed the `<section id="values">` header, the
  pillar-mapping loop, and the `<section id="always-on">` block (and its
  now-unused `getSite()` import/`site` variable, since `site.instagramPitch`
  was its only use on this page — `site.instagramPitch` itself was **not**
  removed from `site.yaml`, since Locations pages still use it).
- Removed the standalone large `<p class="fart-acronym">{diff.acronym}</p>`
  display line and its `.fart-acronym` CSS — the section label ("Come FART
  with us") already contains the word "FART," so a second, larger
  restatement of the same four letters added visual weight without adding
  information.
- `content/home.md` `characteristics[]`: three entries (`mobility`,
  `always-on`, `gospel`) had `aboutAnchor` values pointing at sections that
  no longer exist (`mobility`, `always-on`, `sharing-the-gospel`). Repointed
  all three to `fart` — the only section left on the page — rather than
  leaving a dead anchor (which wouldn't error, but would silently fail to
  scroll to anything relevant).

**Why not preserve per-topic anchors another way** (e.g. point "meets in a
dance studio" at `/locations` instead of the About page): that would change
`GatewayTagline`'s contract from "always links within the About page" to
"links vary per characteristic," a bigger change than this feedback round
asked for. Flagged as an open question in
`specs/about-page-fart-rework.md` instead of solved speculatively.

## FART section flyer image (follow-up, 2026-08-02)

Added an optional `image`/`imageAlt` pair to the `differentiator` block in
`content/home.md`, surfaced in `src/lib/content.ts`'s `Differentiator` type,
and rendered by `what-were-about.astro`:

```
content/home.md differentiator.image / differentiator.imageAlt
  └── getHome() [src/lib/content.ts] → Differentiator.image?, Differentiator.imageAlt?
        └── what-were-about.astro
              {diff.image && <img class="fart-flyer" src={diff.image} alt={diff.imageAlt ?? ''} ... />}
              — rendered immediately after <h2 class="section-label"> and
                before the intro <p> paragraphs, i.e. the first thing under
                the "Come FART with us" heading.
```

**Why a content field instead of hardcoding the `<img>` in the template:**
every other piece of FART-section copy already lives in `content/home.md`
via `getHome()`; hardcoding a one-off image path directly in
`what-were-about.astro` would create a second place editors need to know
about to change this section, inconsistent with how the rest of the page
is built.

**Why optional (`image?`/`imageAlt?`) rather than required:** the FART
section itself already renders correctly without an image (that was true
before this change); making the field optional means an editor can drop
the flyer later (or swap it out entirely) by just deleting two lines from
YAML, with no `.astro`/`.ts` change needed either way.

**Asset:** `public/images/FART.jpg` — the original church-provided flyer
graphic (1080×1350), added directly to `main` rather than generated. It's a
single static promo graphic, not a carousel, so it doesn't use the
`carousel.yaml`/`getCarouselCards()` machinery built for
`CardHandCarousel`; that machinery exists specifically for the home page's
multi-card deck, which this single image isn't part of.

**Styling:** `.fart-flyer` in `what-were-about.astro`'s `<style>` block
caps the image at `max-width: 22rem`, centers it, and reuses the same
`border: 1px solid var(--border); border-radius: 12px;` treatment already
used by `.fart-item`, so it reads as part of the same section rather than
an unrelated inserted graphic.

## Favicon (related, same PR)

See `architecture/favicon.md` for the separate favicon/tab-icon change
bundled into this same review pass.
