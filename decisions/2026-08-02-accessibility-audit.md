# Deep accessibility audit — fixes and rejected alternatives

**Date:** 2026-08-02
**Status:** Accepted

## Decision

Fix the concrete accessibility defects found in a manual WCAG 2.2 AA-
oriented audit (contrast computed via the actual relative-luminance
formula, focus behavior verified via keyboard-only manual testing): drawer
and popup focus management, an under-contrast CTA gradient, missing
heading structure on 3 pages, unlabeled link color on the CTPT page, and a
sitewide `prefers-reduced-motion` gap for CSS transitions. Full list in
`specs/accessibility-audit.md`; implementation detail in
`architecture/accessibility-audit.md`.

## Context

The site had no prior accessibility review. Two overlay UIs (hamburger
drawer, popup announcement) already had the right ARIA *roles* but not the
behavior a screen-reader/keyboard user needs from them. The home page's
primary CTA (Instagram follow button) used a decorative gradient that
fails contrast on part of its range. A caption-style CSS class doubled as
a de facto section heading on several pages but was markup as `<p>`.

## Alternatives considered

### Drawer/popup focus management
1. **Do nothing / defer to a follow-up.** Rejected — this is the single
   highest-impact category of finding in the audit (a screen-reader or
   keyboard-only user genuinely cannot use these two features correctly
   today), not a nice-to-have.
2. **Add a `focus-trap` npm dependency.** Rejected — `CampusInstagramMenu`
   already solves this exact problem in ~30 lines of vanilla JS with no
   dependency; mirroring that pattern is more consistent with the
   codebase (which has zero JS dependencies today — see `package.json`)
   and equally correct for this scope (a handful of known focusable
   elements per dialog, not an arbitrary nested widget tree).
3. **Use the native `<dialog>` element instead of `role="dialog"` +
   manual JS.** `<dialog>` gets focus-trapping and Escape-to-close for
   free from the browser. Rejected for this pass — `<dialog>` also
   changes stacking/backdrop behavior and would touch more markup/CSS per
   surface (both the drawer, which is a *non-modal* push-panel, and the
   popup) than the day's scope warranted; the manual-JS pattern was
   already proven correct in this codebase. Worth reconsidering in a
   future pass if a third overlay is added.

### Instagram gradient CTA contrast
1. **Darken only the two failing stops, leave the rest.** Considered —
   would preserve more of the original gradient's character. Rejected in
   favor of a uniform lightness scale: a single documented formula
   (`l × 0.65`) is easier for a future agent to re-derive/re-verify than
   two hand-picked hex values with no clear relationship to the original
   palette.
2. **Switch button text to black.** Rejected — checked contrast of black
   text against all 5 original stops; the darkest stops (`#cc2366`,
   `#bc1888`) then fail (4.00:1, 3.62:1). No single text color passes
   against the *original* gradient's full range; the background had to
   change.
3. **Replace the gradient with a solid color.** Would trivially fix
   contrast and is the most common way most real Instagram-follow buttons
   solve this, but changes the button's visual identity more than
   darkening the existing gradient does. Rejected as more visual change
   than necessary for a contrast fix.
4. **Official 6-stop Instagram icon gradient
   (`#405DE6…#FD1D1D`).** Checked — its own last stop (`#FD1D1D`) is only
   3.91:1 with white, i.e. it would have introduced the *same class of
   bug* with different colors. Rejected.

### Heading hierarchy
1. **Leave `.section-label` as `<p>`, add a separate visually-hidden
   `<h2>` next to it.** Rejected — duplicates content for no benefit; the
   visible caption *is* an accurate, appropriately-worded heading, it just
   needed the right element.
2. **Promote to `<h2>` without touching `font-weight`.** Rejected once
   checked against the browser default `h1`–`h6` bold styling — would have
   silently changed the visual weight of every section label on 3 pages.
   Added an explicit `font-weight: 500` alongside the element-type change
   specifically to keep this a semantic-only fix.

## Tradeoffs

| Gain | Cost |
|---|---|
| Drawer/popup keyboard/screen-reader usable, matching the standard modal pattern | More JS per component (though following an existing in-codebase pattern, not new architecture) |
| Instagram CTA text readable across its full gradient in light theme | Gradient is visually darker/richer than the original bright Instagram colors — a deliberate, documented tradeoff, not an oversight |
| Screen-reader heading navigation now finds FART/Gallery/Contact/era sections | None of substance — `font-weight` override keeps visual output identical |
| CTPT links identifiable as links, full-row tap target | None — purely additive CSS |
| `prefers-reduced-motion` covers all CSS transitions, not just JS-driven auto-advance | Required a matching JS timing fix in `CardHandCarousel` to avoid a new input-lag regression (done — see architecture doc) |

## Final rationale

Every fix here addresses a defect that was independently verified (via
computed contrast ratios or actual keyboard-only manual testing), not a
speculative "some checklist says so" change. Where an existing in-codebase
pattern already solved the same class of problem correctly
(`CampusInstagramMenu`'s focus trap), it was reused rather than
reinvented, keeping the fix consistent with how this codebase already
does things.

## Follow-up

- Consider adding an automated accessibility linter (e.g. axe-core) to
  catch regressions in future changes — not done in this pass.
- The popup's pre-existing "backdrop click always closes, even when
  `dismissible: false`" behavior was intentionally left unchanged (Escape
  was made consistent with it, not the other way around) — flagged as a
  possible product-logic inconsistency worth a maintainer decision, not
  fixed unilaterally here since it's a behavior change beyond "add the
  missing accessibility behavior."

## Amendment (2026-08-02, later same day): reverse the "keep the gradient" call

**Decision:** replace the (already-darkened, already-AA-passing) light-mode
Instagram gradient on `.gateway__ig` with a flat `var(--accent)` fill and
`#0a0a0a` text, instead of keeping the gradient darkened as this audit
originally chose.

**Context:** this audit's original pass explicitly considered and rejected
"replace the gradient with a solid color" (alternative 3 above) as "more
visual change than necessary for a contrast fix." A later, explicit design
request overrode that call: it wanted the Instagram-brand gradient gone in
light mode regardless, in favor of a color that matches the site's own
accent rather than borrowing Instagram's brand palette. This is a design
preference change, not a newly-discovered defect — the darkened gradient
was already WCAG AA compliant.

**Why `var(--accent)` specifically, not a new one-off color:** `--accent`
is the site's existing light-mode brand accent (`#e1306c`), already used
elsewhere (`.skip-link` background, `.fart-item__letter` background) with
the same `#0a0a0a`-text pairing. Reusing it keeps the button visually
consistent with the rest of the site instead of introducing a second,
button-specific color that only this component uses.

**Why `#0a0a0a` text, not white:** checked contrast of both against
`--accent` (`#e1306c`) via the WCAG relative-luminance formula:

| Text color | Contrast vs. `#e1306c` |
|---|---|
| `#ffffff` | 4.34:1 ❌ (fails 4.5:1 AA) |
| `#0f172a` (`--text`) | 4.12:1 ❌ |
| `#0a0a0a` | 4.56:1 ✅ |

`#0a0a0a` is also what `.skip-link` and `.fart-item__letter` already pair
with `--accent`, so this isn't a new pairing invented for this button.

**Tradeoff accepted:** 4.56:1 has a smaller safety margin over the 4.5:1
AA minimum than the darkened gradient's worst-case stop did (4.60:1) — both
pass, but a future `--accent` color change in light mode must re-check this
contrast pairing rather than assume it still passes.

**Follow-up:** `src/layouts/Site.astro` — `.site .gateway__ig` background
changed from the 5-stop gradient to `var(--accent)`; text color changed
from `#fff` to `#0a0a0a`. `.site--dark .gateway__ig` (transparent
background + accent border/text) and the per-campus `campus-ig-btn`
color overrides (Duke/NC State/UNC) are unchanged — neither used the
gradient.
