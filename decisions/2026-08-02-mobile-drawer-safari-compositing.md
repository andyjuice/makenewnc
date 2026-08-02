# Mobile drawer — iOS Safari positioning fix

**Date:** 2026-08-02
**Status:** Accepted (amended same day after user retest)

## Decision

Animate the push drawer with a **`right` offset** (`right: calc(-1 * var(--drawer-w))` →
`right: 0`) instead of `transform: translateX(100%)`. Use a fixed
`--drawer-w: 17.5rem` (no `min()` / `88vw`). Keep the open drawer above the
sliding stage (`z-index: 3`) and explicit drawer link colors.

## Context

First pass (same day, merged as PR #13) assumed invisible link text from WebKit
compositing (stage layer painted over labels). User retest on iPhone Safari
showed the real defect: the drawer panel slid **off the left edge** — only a
narrow sliver of divider lines remained visible ("The menu goes too far left").

Root cause: **`translateX(100%)` on a `right: 0` panel is unreliable in
iOS Safari**; the open state can resolve as an off-screen negative translate,
parked left of the viewport. Replacing percentage transforms with explicit
`right` motion avoids that class of WebKit bug. A fixed `--drawer-w` also
keeps stage `calc(-1 * var(--drawer-w))` and drawer width in sync.

## Alternatives considered

1. **Left-side drawer (content pushes right).** Rejected — push-from-right
   matches the locked production pattern ("shifts page content left").
2. **`<dialog>` / fixed overlay.** Rejected — larger UX change.
3. **Keep percentage translate and only tweak z-index/colors (PR #13).** Rejected —
   user retest proved positioning, not contrast, was broken.

## Tradeoffs

- Drawer width is capped at `17.5rem` on all viewports (was up to `88vw`).
  On very narrow phones this leaves more content visible beside the panel,
  which is acceptable and closer to a standard nav width.
