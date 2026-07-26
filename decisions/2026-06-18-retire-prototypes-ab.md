# Retire prototypes A and B from codebase

**Date:** 2026-06-18  
**Status:** Accepted

## Decision

Remove remaining prototype A/B artifacts. Instagram Gateway (C) is the sole design.

## Removed

- `src/components/ServiceTickets.astro` — A-era service ticket UI (unused; C uses inline gathering blocks on campus pages)
- `src/pages/prototypes/index.astro` — redundant redirect shim (handled by `astro.config.mjs`)
- `content/events.md` — unused stub (events merged into Locations)
- `prototypeMeta` export and A/B address/services shim in `getSite()`

## Kept

- `/prototypes/c/` routes and `PrototypeC.astro` layout (pre-production home for locked design)
- Legacy URL redirects (`/prototypes/a`, `/prototypes/b`, `/prototypes/c-dark` → `/prototypes/c/`) for bookmarks
- Decision logs updated to superseded/historical where appropriate

## Rationale

Source pages for A/B were already deleted. This pass removes orphaned components, stale docs, and dead exports so future agents see one clear design path.
