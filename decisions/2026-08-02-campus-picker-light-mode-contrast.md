# Campus picker light-mode contrast fix

**Date:** 2026-08-02
**Status:** Accepted

## Decision

Fix inaccessible school-name text in the footer campus-picker dropdown when
the site is in light mode by (1) scoping `.social-bar` link color to direct
children only and (2) setting explicit `var(--text)` on campus-picker
option/name elements.

## Context

The 2026-08-02 accessibility audit verified theme-token contrast pairs but
did not catch a **CSS cascade** bug: the footer Instagram campus menu panel
is nested inside `.social-bar`, which always uses a dark background even in
light theme. School names inherited `#e2e8f0` (correct on the dark bar,
~1.2:1 on the light popup). City names stayed readable because they already
used `var(--muted)` explicitly.

## Alternatives considered

1. **Light-theme override only** (e.g. `.site:not(.site--dark)
   .campus-ig-menu__option { color: var(--text) }`). Rejected as
   incomplete — dark-mode panel already worked; explicit theme text on
   the picker is correct in both themes and avoids future regressions if
   the component moves.
2. **Restyle the social bar to a light background in light mode.** Rejected
   — out of scope; would change locked production chrome beyond fixing the
   contrast defect.
3. **Move the picker panel outside `.social-bar` in the DOM.** Rejected —
   larger layout/markup change with no benefit over a two-line CSS fix.

## Tradeoffs

| Gain | Cost |
|---|---|
| School names meet WCAG AA in light mode on the picker panel | Slightly more specific CSS (direct-child selector + explicit picker colors) |
| Picker text no longer depends on ancestor link styling | None of substance |

## Final rationale

The bar's link color and the picker's panel surface serve different
backgrounds. Scoping the bar rule to direct children fixes the root cause;
explicit picker colors document intent and prevent the same bug if the menu
is reused elsewhere.
