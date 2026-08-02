# Deep mobile + accessibility audit (2026-08-02)

## Problem statement

The site had never had a dedicated accessibility pass. A systematic review
(WCAG 2.2 AA-oriented, keyboard-only navigation, screen-reader semantics,
color contrast, and mobile touch-target sizing) turned up a set of concrete
defects, mostly around **focus management** in the two full-screen/overlay
interactions (the hamburger drawer and the popup announcement), **color
contrast** on the home page's primary CTA, **heading structure** on several
pages, and a couple of **link-identifiability** issues.

## Goals

- Fix real, verifiable defects (contrast ratios computed against the actual
  WCAG relative-luminance formula, not eyeballed; focus-trap behavior
  verified via keyboard-only manual testing) rather than speculative
  "best practice" churn.
- Bring the two overlay UIs that lacked it (drawer nav, popup announcement)
  up to the same focus-management standard already used by
  `CampusInstagramMenu`'s mobile sheet, which was already correct — reuse
  that pattern rather than inventing a new one.
- Leave already-correct, already-reviewed UX (the cycling tagline's
  `aria-live` heading, `prefers-reduced-motion` JS gating on auto-advancing
  carousels/taglines, the push-drawer visual design) alone. This audit does
  not re-litigate locked design decisions from
  `decisions/2026-06-13-production-design-lock.md`.

## Non-goals

- A full WCAG AAA pass (e.g. reworking the cycling `<h1>` tagline's
  `aria-live` cadence, or hitting 7:1 contrast everywhere) — AA is the
  target.
- Redesigning visual layout/spacing beyond what's needed to fix a specific
  defect (e.g. the Instagram gradient CTA is recolored, not restructured).
- Automated accessibility testing/CI (e.g. axe-core, Lighthouse CI) — this
  was a manual audit + fix pass; adding automated regression coverage is a
  reasonable follow-up but out of scope here.
- Non-accessibility mobile issues (there weren't any found — see
  "What was checked but not changed" below).

## What was checked but not changed

- **Contrast**: computed exact WCAG contrast ratios (not visual estimates)
  for every text/background and non-text UI color pair in `Site.astro`'s
  theme variables and component styles. Everything except the Instagram
  gradient CTA (see below) already passed AA (4.5:1 text / 3:1 large text
  and UI components), several with wide margins (e.g. `--muted` on `--bg`
  is 4.76:1 light / 7.72:1 dark).
- **Zoom/pinch-zoom**: viewport meta already omits `user-scalable=no` /
  `maximum-scale` — correctly does not disable zoom.
- **Forms**: none exist on the site (grepped for `<form>`/`<input>`/
  `<select>`/`<textarea>` — no matches), so no form-labeling audit was
  needed.
- **Images**: only one raw `<img>` exists in the codebase (the header
  logo, `alt=""` inside an `aria-label`led link — correct). All other
  images are carousel photos with content-authored `alt` text from YAML.
- **`prefers-reduced-motion` (JS)**: `GatewayTagline.astro` and
  `CardHandCarousel.astro` already correctly gate auto-advance behind
  `window.matchMedia('(prefers-reduced-motion: reduce)')`. Not changed.
- **`aria-live` cycling `<h1>`**: `GatewayTagline`'s hero heading rewrites
  itself every 4–7s and is `aria-live="polite"`. This is an intentional,
  previously-reviewed design (see `specs/prototype-c-evolution.md`), and
  reduced-motion users already get a frozen, non-updating version. Left
  as-is rather than redesigned as part of this audit.

## Findings and fixes

See `architecture/accessibility-audit.md` for implementation detail and
`decisions/2026-08-02-accessibility-audit.md` for the reasoning/tradeoffs
behind each fix. Summary:

1. No skip link — added one (`Site.astro`).
2. Hamburger drawer nav: no focus trap, no focus moved on open, no
   background `inert` — background content stayed keyboard/screen-reader
   reachable while the drawer was "open" (`Site.astro`).
3. Popup announcement modal (`role="dialog" aria-modal="true"`): had the
   ARIA roles for a modal but none of the actual behavior — no focus trap,
   no initial focus, no background `inert`, no Escape-to-close
   (`PopupAnnouncement.astro`).
4. Instagram-brand gradient CTA button: two of its five gradient stops
   scored 2.34:1 and 3.28:1 contrast with the white button text — both
   fail WCAG AA's 4.5:1 minimum for normal-size text. Darkened the palette
   uniformly (worst case now 4.60:1) (`Site.astro`).
5. Section captions styled as headings (`.section-label`) were `<p>`
   elements on 3 pages, not real headings — screen-reader users navigating
   by heading list couldn't find these section boundaries. Promoted to
   `<h2>` (`what-were-about.astro`, `our-story.astro`,
   `locations/[slug].astro`).
6. CTPT chapter links were the same color as body text with no underline —
   effectively indistinguishable from plain text
   (`christian-themes-for-privileged-teens.astro`).
7. CTPT chapter link tap target was only as wide as the link text, despite
   each row visually implying a full-width tappable strip (padding +
   border) — mismatch between visual affordance and actual hit target on
   mobile (`christian-themes-for-privileged-teens.astro`).
8. `target="_blank"` links had no screen-reader indication that they open
   a new tab (footer socials, campus Instagram links, campus address/map
   link, CTPT chapter links, carousel card external-link icon).
9. Drawer nav had no way to tell which page you're currently on — added
   `aria-current="page"`.
10. CSS transitions/animations sitewide weren't gated by
    `prefers-reduced-motion` (only the JS-driven auto-advance behaviors
    were) — added a standard blanket CSS override, plus a matching JS
    timing fix in `CardHandCarousel` so the fix doesn't introduce an
    input-lag mismatch.

## Edge cases

- The drawer's `inert` attribute is applied to `#app-stage` while open, and
  to the drawer itself (in addition to `aria-hidden`) during its ~280ms
  closing transition, so a fast Tab press right after closing can't land
  on an already-invisible link — see
  `architecture/accessibility-audit.md` for why both were needed.
- `inert` is supported in all current evergreen browsers (Chrome/Edge/
  Safari/Firefox); `aria-hidden` is set alongside it as a screen-reader-only
  fallback for older browsers, even though it doesn't affect tab order on
  its own.
- The popup's Escape-to-close always closes (matching the pre-existing
  backdrop-click behavior, which already closed the popup regardless of
  `dismissible`) rather than being gated behind `dismissible` — see the
  decision log for why this wasn't "fixed" to be dismissible-only instead.

## Open questions

- Should axe-core or a similar automated a11y linter be added to CI to
  catch regressions going forward? Not done here (manual audit only);
  flagging as a reasonable follow-up.
- The popup's existing backdrop-click-always-closes behavior (even for
  non-dismissible announcements) predates this audit and wasn't changed,
  but is arguably a product-logic inconsistency worth a maintainer look.
