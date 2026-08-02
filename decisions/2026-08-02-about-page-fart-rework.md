# What we're about — de-duplicate FART vs. pillars, rework copy

**Date:** 2026-08-02
**Status:** Accepted

## Decision

- Removed the "Who we are" section from `/what-were-about` (it only restated
  the subheader directly above it) and reworded the subheader
  (`home.aboutIntro`) to be the single "who we are" statement on the page.
- Renamed the FART section label from "What makes us different" to "Come
  FART with us."
- Removed the standalone "Intellectual rigor" pillar; its unique content
  was folded into the FART "Reason" card, since the two sections said
  almost the same thing.
- Rewrote all four FART card descriptions (Faith, Art, Reason, Technology)
  per site-review feedback, and gave FART cards a clearer typographic
  hierarchy (bold summary vs. smaller/muted extended description).
- Added an inline `<abbr title="...">` definition for "apologetics" and a
  link to `/christian-themes-for-privileged-teens` (CTPT) inside the Reason
  card, so that claim is backed by something a visitor can go read.

## Context

Site-review feedback flagged that FART already covered several ideas that
were then repeated, nearly verbatim, later on the same page — most notably
FART's "Reason" card and the "Intellectual rigor" pillar, which shared the
same summary sentence. The page was also front-loaded with a "Who we are"
section that added no information beyond the subheader immediately above
it. Full feedback and resulting spec: `specs/about-page-fart-rework.md`.

## Alternatives considered

1. **Trim wording in place, keep both sections.** Rejected — the two
   sections' core claim ("we take faith questions seriously,
   college-level") was identical; trimming wording wouldn't remove the
   structural duplication, only shorten it.
2. **Keep "Who we are" but shorten it.** Rejected — the subheader already
   states the brand + tagline; a second section restating it added a
   scroll stop with no new information, regardless of length.
3. **Custom interactive tooltip component for "apologetics"** (matching the
   footnote pattern in `GatewayTagline.astro`). Rejected for this single
   inline definition — see `architecture/about-page-fart-rework.md` for the
   full comparison. A native `<abbr title="...">` covers the need with zero
   JS.

## Tradeoffs

| Gain | Cost |
|---|---|
| One "who we are" statement instead of two | Anyone linking directly to the old `#intro` section now lands on the subheader paragraph instead of a dedicated section (visually identical position, but the DOM node changed) |
| FART and "Our values" no longer repeat each other | The home-page tagline's `#intellectual-rigor` anchor had to be repointed to `#fart-reason` (done in this change) |
| Reason's claim is now backed by a real link + definition | `DifferentiatorItem.body` is now trusted-HTML instead of plain text (documented in `src/lib/content.ts`) — future edits to this field must keep tags balanced |

## Final rationale

Reducing duplication and giving the FART cards real content is more
valuable than preserving the exact old section boundaries. The content that
was uniquely useful in the removed sections was preserved by folding it
into the FART cards rather than deleted outright.

## Follow-up

- `content/home.md`: `aboutIntro` reworded; `differentiator.title`/`intro`
  reworded; all four `differentiator.items[].body` rewritten; the
  `intellectual-rigor` pillar removed; the `rigor` characteristic's
  `aboutAnchor` repointed from `intellectual-rigor` to `fart-reason`.
- `src/pages/what-were-about.astro`: removed the "Who we are" `<section>`;
  moved `id="intro"` onto the subheader paragraph; restructured the FART
  section (acronym line + intro paragraphs above the card list); added
  `.fart-item__body` styling for the muted extended-description tier; added
  `:global(abbr)`/`:global(a)` styling for the injected Reason-card markup.
- `src/lib/content.ts`: documented that `DifferentiatorItem.body` may
  contain trusted inline HTML.

## Amendment (same review pass): remove "Our values"/"Always on" and the acronym display

Once the FART cards had real content (this decision's original scope),
review feedback judged the rest of the page redundant with it and asked to
cut it rather than trim it further, and to drop the large standalone "FART"
acronym line under the "Come FART with us" label (the label already says
"FART").

**Additional changes:**

- Removed `content/home.md`'s `pillars` list entirely (Mobility, Living
  life together, Sharing the Gospel — not just the already-folded
  Intellectual rigor).
- Removed the `Pillar` type and `HomeContent.pillars` field from
  `src/lib/content.ts` — deleted rather than left unused, since removing
  its one consumer (the "Our values" section) made it dead content-model
  surface.
- Removed `<section id="values">`, the pillar-mapping loop, and
  `<section id="always-on">` from `what-were-about.astro` (and its
  now-unused `getSite()` import). `site.instagramPitch` itself stays in
  `site.yaml` — Locations pages still use it.
- Removed the standalone `<p class="fart-acronym">{diff.acronym}</p>` line
  and its CSS.
- Repointed the `mobility`, `always-on`, and `gospel` characteristics'
  `aboutAnchor` (previously `mobility`, `always-on`, `sharing-the-gospel` —
  all now-removed section ids) to `fart`, the one section left on the page.

**Tradeoff accepted:** those three cycling-tagline phrases ("meets in a
dance studio," "is open 24/7," "shares the gospel") no longer deep-link to
topic-specific detail — they land on the top of the FART section instead.
Considered repointing them at other pages (Locations, Our Beliefs) instead,
but that would change `GatewayTagline`'s "always links within the About
page" contract for a bigger scope than this feedback round asked for; left
as an open question in `specs/about-page-fart-rework.md`.

See `architecture/about-page-fart-rework.md` ("Removing 'Our values' and
'Always on' entirely") for the full before/after.

## Amendment (2026-08-02, later same day): drop em dashes from FART copy

Editorial feedback: the FART intro and all four card `body` fields used em
dashes (—) as a stylistic tic, which reads as an AI-generated writing
pattern rather than a house style choice actually made for this site.
Request: remove them, and rephrase the surrounding sentences so the fix
reads like a natural rewrite rather than a mechanical find-and-replace.

**Approach:** each em dash was replaced with a comma or a period (never a
colon or semicolon substitution, to keep the fix visually distinct from
"just swap the punctuation mark"), and the sentence around it was
restructured where a straight swap would have produced an awkward run-on:

- FART intro: split "...shape everything we do — the stuff that makes us
  distinctly [make]new" into two sentences.
- Faith card: em dash → period (no restructuring needed).
- Art card: the "Art — film, music, literature... — shapes..." parenthetical
  construction (two em dashes bracketing a list) was rewritten as two
  sentences — the list is now its own sentence ("We mean film, music,
  literature...") instead of an interruption mid-clause.
- Reason card: "...dig into the hard stuff — the problem of suffering..."
  became "...dig into the hard stuff, things like the problem of
  suffering...", adding "things like" so the list reads as an example
  clause instead of losing its transition when the dash was removed.
- Technology card: em dash → comma ("...Friday productions, everything
  from the tools on stage...").

**Out of scope:** `home.cta.text` ("Come visit us — see Locations for times
and campuses") still has an em dash. Left as-is — this field isn't rendered
by `/what-were-about` (`src/pages/what-were-about.astro` never reads
`home.cta`; nothing in `src/` currently renders it), so it was outside the
"What we're about" copy this amendment was scoped to. Flagging here in case
a future agent wires up `home.cta` and should carry this same fix over.

**Follow-up:** `content/home.md` — `differentiator.intro` and all four
`differentiator.items[].body` fields edited as above. No changes to
`src/pages/what-were-about.astro` or `src/lib/content.ts` — this was a
copy-only edit, the rendering/data-shape contract is unchanged.

## Amendment (2026-08-02, later same day): add flyer image to FART section

**Decision:** render a promo flyer graphic ("Faith Art Religion Tech,"
[make]new Friday photo, `@nc.makenew` Instagram call-to-action) as the
first element under the "Come FART with us" heading, ahead of the intro
paragraphs. Requested directly, not sourced from a review-feedback pass
like the rest of this file.

**Alternatives considered:**

1. **Hardcode the `<img>` and its `src`/`alt` directly in
   `what-were-about.astro`.** Rejected — every other piece of FART-section
   copy is content-driven via `content/home.md`; a hardcoded one-off image
   would be the only thing on this page an editor couldn't change without
   touching `.astro` source.
2. **Model it as a `carousel.yaml`-style single-item gallery** (reusing
   `getCarouselCards()`/`CardHandCarousel`). Rejected — that machinery
   exists for the home page's swipeable multi-card deck; a single static
   image doesn't need swipe/drag/layering logic, and forcing it through
   that component would pull in unrelated JS for no benefit.

**Tradeoffs:** the flyer's own text (FART acronym, Instagram handle)
duplicates information already on the page in prose form, but that's the
point — it's a visual/promotional reinforcement, not new information, so a
missing or broken image doesn't create an accessibility gap on its own
(the surrounding text and `imageAlt` still carry the same facts).

**Follow-up:** `content/home.md` — added `differentiator.image` and
`differentiator.imageAlt`. `src/lib/content.ts` — added optional
`image?`/`imageAlt?` to the `Differentiator` type. `what-were-about.astro`
— renders the `<img class="fart-flyer">` conditionally on `diff.image`,
plus its `.fart-flyer` styling. New asset: `public/images/fart-flyer.jpg`.
