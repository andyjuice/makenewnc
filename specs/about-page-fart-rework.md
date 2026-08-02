# What we're about — de-duplication & FART copy rework

## Problem statement

Site-review feedback on `/what-were-about` identified redundant text: the
FART differentiator (Faith, Art, Reason, Technology) already communicated
several concepts that were then repeated almost verbatim later on the same
page (most notably the old standalone "Intellectual rigor" pillar, which
said essentially the same thing as the FART "Reason" card). The page also
had a "Who we are" section that only restated the subheader directly above
it, and the FART cards had flat typography — the extended description read
with the same visual weight as the one-line summary, so there was no clear
reading order.

Separately, the FART section's introductory copy was vague about *why*
"FART" is the acronym (calling it "our identity and culture" without
specifics), and the "Reason" claim ("we take faith questions seriously") was
asserted without pointing anywhere someone could actually verify it.

## Goals

- Remove duplicated content between the FART section and the sections below
  it, without losing any information that was uniquely useful.
- Make the subheader (`aboutIntro`) the single place that introduces "who we
  are," and drop the redundant "Who we are" section entirely.
- Rename the FART section header to "Come FART with us" so it reads as an
  invitation rather than a dry feature list ("What makes us different").
- Give the FART cards a real typographic hierarchy: letter badge → bold
  one-line summary → smaller, muted extended description. The description
  should read as supporting detail, not a second headline.
- Rewrite the FART intro copy to be clearer about what the acronym actually
  represents ("the four things that shape everything we do") instead of the
  vaguer "identity and culture" framing.
- Back up the "Reason" claim concretely: define "apologetics" inline (most
  visitors won't know the term) and link to `/christian-themes-for-privileged-teens`
  (CTPT), the church's existing apologetics resource.
- Rewrite Art and Technology copy per the ideas in review feedback (art
  reaching the human experience beyond "rote reason"; tech-forward +
  attentive to current events because the gospel applies today, not just in
  the first century).

## Non-goals

- Redesigning the "Our values" pillars (Mobility, Living life together,
  Sharing the Gospel) beyond removing the one pillar that duplicated FART.
- Building a new interactive tooltip component. A native `<abbr title="...">`
  is sufficient for a single inline definition — see
  `architecture/about-page-fart-rework.md` for why this was chosen over
  reusing/extending the custom tooltip in `GatewayTagline.astro`.
- Changing the "Always on" section or the CTA content.
- Changing FART's meaning/order (still Faith, Art, Reason, Technology).

## User-facing behavior

1. **Subheader** (`home.aboutIntro`) now reads: "[make]new is church for
   people who don't like church. Built around college life in the Triangle.
   Open 24/7." This is the only place "who we are" is introduced on the page.
2. **First section** after the title/subheader is FART, labeled "Come FART
   with us," followed by:
   - The acronym "FART" displayed large, with an accessible label of "Faith,
     Art, Reason, Technology" (not spelled-out letters) for screen readers.
   - Two short context paragraphs explaining the acronym is intentionally
     immature but purposeful.
   - Four cards (Faith, Art, Reason, Technology), each with a colored letter
     badge, a bold summary, and a smaller/muted extended description below.
3. The Reason card's description contains an inline `apologetics` term with
   a native tooltip (hover/focus shows a one-sentence definition) and a link
   to the CTPT page.
4. **"Our values"** section now lists only Mobility, Living life together,
   and Sharing the Gospel — "Intellectual rigor" was removed because it
   restated the Reason card almost word-for-word.
5. The home-page cycling tagline's "approaches Christianity with
   college-level rigor" phrase now deep-links to `#fart-reason` (the FART
   Reason card) instead of the now-removed `#intellectual-rigor` pillar.

## System constraints

- Content lives in `content/home.md` (YAML front matter); this page is a
  build-time render (`src/lib/content.ts` → `getHome()`), so all copy
  changes require no page-logic changes on their own.
- `DifferentiatorItem.body` may now contain trusted inline HTML (a same-site
  `<a>` and an `<abbr title="...">`). It is rendered with Astro's `set:html`
  in `what-were-about.astro`. This is safe only because `content/home.md` is
  the sole writer of this field — it is not user-generated content.
- Anchor IDs (`#fart-faith`, `#fart-art`, `#fart-reason`, `#fart-technology`,
  `#mobility`, `#living-life-together`, `#sharing-the-gospel`,
  `#always-on`, `#intro`) are linked from `GatewayTagline.astro` on the
  home page via `characteristics[].aboutAnchor`. Renaming or removing a
  section's `id` requires updating the matching `aboutAnchor` in
  `content/home.md`.

## Edge cases

- `prefers-reduced-motion` is unaffected — this change is to `/what-were-about`
  content, not the home page's cycling tagline animation.
- The `#intro` anchor previously pointed at a dedicated "Who we are"
  `<section>`; it now lives on the subheader `<p id="intro">` itself, since
  there's no longer a separate section to anchor to. Scroll behavior is
  effectively unchanged (both are at the top of the page).
- `diff.intro` in YAML is split on blank lines into separate `<p>` elements
  by `what-were-about.astro`. If an editor writes `intro` as a single
  paragraph (no blank line), it will render as one `<p>` — that's fine, the
  split is purely additive.

## Open questions

- Is "apologetics" defined precisely enough for a general audience in one
  sentence, or does it need a fuller explanation elsewhere (e.g. a dedicated
  glossary)? Left as a single-sentence `<abbr>` tooltip for now; revisit if
  visitors report confusion.
- Should "Sharing the Gospel" (pillar) be merged into FART's "Faith" card in
  a future pass? They are related but distinct (belief foundation vs.
  outward action) — left separate for this round per review feedback, which
  only flagged Intellectual rigor/Reason as duplicative.
