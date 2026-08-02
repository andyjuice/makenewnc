# Accessibility audit — implementation notes

See `specs/accessibility-audit.md` for the full findings list and
`decisions/2026-08-02-accessibility-audit.md` for alternatives/tradeoffs.
This doc covers how each fix was implemented and why, for anyone extending
this code later.

## Focus-trap pattern (drawer + popup), mirrored from `CampusInstagramMenu`

`CampusInstagramMenu.astro`'s mobile bottom-sheet already implemented the
correct pattern for a modal-like overlay:

1. On open: remember `document.activeElement`, move focus into the sheet,
   set `body` scroll lock.
2. A `keydown` listener that closes on `Escape` and, on `Tab`, wraps focus
   between the first/last focusable element inside the sheet (manual focus
   trap — no dependency added for this).
3. On close: restore focus to whatever was focused before opening (falling
   back to the trigger button).

`Site.astro`'s drawer nav and `PopupAnnouncement.astro`'s modal both had
the ARIA attributes (`aria-hidden`, `aria-modal`, `role="dialog"`) but none
of this behavior. Both were brought up to the same pattern:

```
open:  save activeElement → reveal → focus first focusable inside
keydown (while open):
  Escape → close
  Tab    → if at last focusable and not shift: wrap to first
           if at first focusable and shift:   wrap to last
close: restore focus to the element saved on open (or a sensible fallback)
```

### Why `inert` in addition to `aria-hidden` on background content

`aria-hidden="true"` removes an element from the accessibility tree (so
screen readers skip it) but does **not** affect Tab order — a sighted
keyboard user could still Tab into content that's aria-hidden, which is
worse than doing nothing (focus becomes invisible to them). The `inert`
HTML attribute (supported in all current evergreen browsers) removes an
element from both the accessibility tree *and* the tab order, and also
blocks pointer interaction. Both drawer (`#app-stage` while drawer is open)
and popup (`.top-bar`, `.header`, `#app-shell` while popup is open) now set
`inert` + `aria-hidden` together: `inert` does the real work in modern
browsers; `aria-hidden` is a no-cost fallback for anything that doesn't
support `inert`.

### Why the drawer also needed `inert` on *itself* during its close transition

The drawer's close sequence sets `aria-hidden="true"` immediately, then
waits ~280ms (the slide-out CSS transition) before adding the `hidden`
attribute (removing the `hidden` attribute is what actually takes it out
of the DOM's default tab order; `aria-hidden` alone doesn't). Without also
setting `inert` on the drawer itself during that window, a very fast Tab
press right after closing could still land on a drawer link that's
visually off-screen and `aria-hidden` — technically reachable, practically
invisible. Adding `inert` alongside `aria-hidden` in the close branch (and
removing it once `hidden` is finally set) closes that gap.

### Why the popup's background list is three explicit selectors, not a wrapper

`PopupAnnouncement` is rendered as a sibling of `.top-bar`, `.header`, and
`#app-shell` in `Site.astro` — there's no single wrapping element around
"everything except the popup" to make inert in one shot. Introducing one
would mean restructuring `Site.astro`'s DOM (risk to existing CSS
selectors like `.site .header`, `.site .shell`, etc.), so the popup's
script instead directly queries and inerts the three known regions. This
is more verbose but zero-risk to existing layout/CSS.

## Reduced motion: blanket CSS override + one JS timing fix

`GatewayTagline.astro` and `CardHandCarousel.astro` already check
`prefers-reduced-motion` in JS to skip *automatic* advancement (the more
important the WCAG 2.3.3 concern — auto-moving content). They did not gate
the CSS *transition durations* used for user-triggered animation (drawer
slide, card swipe/exit, hover/focus transitions). Rather than hunting down
every individual `transition`/`animation` declaration, `Site.astro` adds
the standard "kill switch":

```css
@media (prefers-reduced-motion: reduce) {
  .site, .site *, .site *::before, .site *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

This is scoped to `.site` (the body's own class), so it can't leak outside
the app shell. `!important` here is intentional and standard for this
pattern — it needs to beat both stylesheet rules *and* the inline
`element.style.transition = '...'` strings that `CardHandCarousel`'s script
sets during drag/swipe (author-stylesheet `!important` beats inline styles
without `!important`, per the CSS cascade).

**Side effect this created, and its fix**: `CardHandCarousel.advance()`
pairs a 0.34s CSS transition with a hardcoded `window.setTimeout(..., 340)`
that finalizes the DOM swap once the transition visually finishes. The
blanket CSS override makes the *visual* transition ~instant for
reduced-motion users, but the JS timer still waited the full 340ms before
accepting the next interaction — a perceptible, pointless input lag. Fixed
by computing `const ADVANCE_MS = reducedMotion ? 0 : 340;` (the component
already computes `reducedMotion` for its auto-advance gating) and using
that for the timeout instead of the literal `340`.

## Contrast: Instagram gradient CTA

`.gateway__ig` (light theme only — dark theme already uses a transparent
background + accent border/text, which was never a contrast problem) used
the stock 5-stop Instagram brand gradient behind white text. Two of the
five stops fail WCAG AA:

| Stop | Contrast w/ white text |
|---|---|
| `#f09433` | 2.34:1 ❌ |
| `#e6683c` | 3.28:1 ❌ |
| `#dc2743` | 4.76:1 ✅ |
| `#cc2366` | 5.25:1 ✅ |
| `#bc1888` | 5.79:1 ✅ |

(WCAG AA requires 4.5:1 for normal-size text; this button's text is 16px
bold, which does not qualify as "large text" under WCAG's 18.66px-bold/24px
threshold, so 4.5:1 applies.)

Fix: darkened every stop uniformly by reducing HSL lightness to 65% of the
original (`colorsys.rgb_to_hls` → scale `l` → `hls_to_rgb`), which keeps
the same hue progression (still reads as "Instagram-brand-ish": amber →
red → magenta → purple) while bringing the worst-case stop to 4.60:1 (a
small safety margin over the 4.5:1 minimum). New stops:
`#b0610d #a73b15 #91172a #851742 #7a1058`.

Alternatives considered and why they weren't used: see the decision log.

### Amendment (2026-08-02, later same day): replaced with a solid `--accent` fill

A later, explicit design request asked to drop the gradient treatment
entirely in light mode and use a solid color matching the site's own
accent color instead of an Instagram-brand palette (superseding this
audit's original choice to darken-in-place rather than switch to a solid
color — see the decision log's amendment for why that's now reversed).

```css
.site .gateway__ig {
  background: var(--accent); /* #e1306c in light mode */
  color: #0a0a0a;
}
```

`#0a0a0a` text on `--accent` (`#e1306c`) is 4.56:1 — clears the 4.5:1 AA
minimum, though with less margin than the darkened-gradient's worst-case
stop (4.60:1) had. This is the same accent-fill + dark-text pairing
already used by `.skip-link` and `.fart-item__letter` elsewhere in
`Site.astro`, so the button now reads as "this site's accent color," not
an Instagram-brand color borrowed for one component.

Dark mode's `.site--dark .gateway__ig` (transparent background, accent
border/text) is untouched — it was never a gradient and was never a
contrast problem.

## Heading hierarchy: `.section-label` → `<h2>`

`.section-label` is a small uppercase caption style used as a de facto
section heading on 4 pages (`what-were-about.astro`'s FART section,
`our-story.astro`'s era sections, `locations/[slug].astro`'s Gallery and
Contact sections). All 4 were `<p>` elements — invisible to screen-reader
"jump by heading" navigation. Promoted to `<h2>`.

Because the class didn't previously set `font-weight` (relying on
inheriting the surrounding `<p>`'s normal weight), and the browser's
default `h1`–`h6` styling is bold, promoting to `<h2>` without any other
change would have made these captions visibly bolder than before. Added an
explicit `font-weight: 500` to `.section-label` to keep the visual
appearance identical to before the semantic fix.

## Link identifiability + touch target: CTPT chapter links

`.ctpt-link` used `color: var(--text)` (i.e. the same color as
surrounding body text) with `text-decoration: none` — the only visual cue
that it was a link at all was `font-weight: 600`, which most users
wouldn't reliably read as "this is clickable." Added
`text-decoration: underline` so the link is distinguishable by more than
just hover/focus state.

Separately, each chapter is a full-width `<li>` (padding + bottom border)
that visually reads as a tappable row, but the `<a>` inside was inline by
default, so the actual hit target was only as wide as the title text.
Changed `.ctpt-link` to `display: flex; align-items: center; min-height:
44px;`, which (being a block-level flex container) fills the row's full
width, so the entire visual row is now the actual tap target.
