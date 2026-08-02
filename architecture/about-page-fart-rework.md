# What we're about — FART rework architecture

See `specs/about-page-fart-rework.md` for the problem statement and
user-facing behavior this implements.

## Component/data map

```
content/home.md (aboutIntro, differentiator, pillars, characteristics)
  └── getHome() [src/lib/content.ts]
        └── src/pages/what-were-about.astro
              ├── diff.intro            → split into <p class="about-body"> paragraphs
              ├── diff.items[].summary  → <p class="about-summary"> (bold, existing global style)
              ├── diff.items[].body     → <p class="fart-item__body" set:html={...}> (muted, smaller)
              └── home.pillars[]        → remaining "Our values" <section>s

content/home.md characteristics[].aboutAnchor
  └── src/components/GatewayTagline.astro → `${aboutPath}#${aboutAnchor}` (home page deep-links)
```

## Data flow

1. `content/home.md` is the single source of truth for all About-page copy
   (subheader, FART title/intro/items, pillars). No other file duplicates
   this content.
2. `getHome()` reads and parses the YAML front matter at build time (via
   `gray-matter`); no runtime fetch.
3. `what-were-about.astro` renders sections in a fixed order: title →
   subheader (`id="intro"`) → FART (`id="fart"`) → values header
   (`id="values"`) → one `<section>` per remaining pillar → always-on.
4. The home page's cycling tagline (`GatewayTagline.astro`) builds its
   href as `/what-were-about#{aboutAnchor}` per characteristic, so any
   `id` used in `what-were-about.astro` must have a matching
   `aboutAnchor` value in `content/home.md` for the ones that link there.

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

## Favicon (related, same PR)

See `architecture/favicon.md` for the separate favicon/tab-icon change
bundled into this same review pass.
