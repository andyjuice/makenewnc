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
