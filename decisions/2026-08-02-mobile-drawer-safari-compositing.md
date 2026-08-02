# Mobile drawer — iOS Safari compositing fix

**Date:** 2026-08-02
**Status:** Accepted

## Decision

When the hamburger drawer is open, raise the drawer above the sliding
`#app-stage` panel (`z-index: 3` vs `2`), use `translate3d` for drawer/stage
motion, add an explicit `--drawer-w` fallback (`88vw`), and set explicit
drawer link colors (not only `var(--text)`).

## Context

On iOS Safari the push drawer opened (divider lines and focus ring visible)
but nav link labels were invisible — reported on production at mobile
width. Chrome/desktop emulation rendered labels correctly. The drawer sits
under `#app-stage` during the push animation; WebKit can keep painting the
transformed stage layer over the drawer panel so text is occluded while
borders and `:focus-visible` outlines still show.

## Alternatives considered

1. **Switch to `<dialog>` or a fixed overlay drawer.** Rejected — larger UX
   change; push-drawer design is locked (`decisions/2026-06-13-production-design-lock.md`).
2. **Keep z-index and only change link `color`.** Rejected — accent/current
   page colors also failed to show, indicating occlusion not contrast.
3. **Drop the push animation on mobile.** Rejected — unnecessary regression;
   z-index swap preserves the motion.

## Tradeoffs

- Open drawer paints above the stage instead of strictly beneath it. The slide
  still reads as a push because the stage translates left; only compositing
  order changes so labels remain readable on WebKit.
