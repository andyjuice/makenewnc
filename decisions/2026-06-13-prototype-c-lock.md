# Prototype C locked as design direction

**Date:** 2026-06-13  
**Status:** Accepted — production design locked

## Decision

**Chosen design:** Instagram Gateway (Prototype C)

Stakeholders prefer Space Grotesk typography, one-screen home, announcement bar, and minimal hamburger nav with header dark-mode toggle.

## Scope changes from original v1

| Area | Original scope | New scope |
|------|----------------|-----------|
| Instagram | Link only | Graph API carousel on home (client fetch via `/api/instagram`) |
| Home gathering card | Next service + topic | Removed; service times on Locations pages |
| Events | Standalone route | Merged into Locations (multi-campus) |
| Nav | Events in drawer | Locations + What we're about |
| Campuses | Single Durham address | Duke, NC State, UNC in `campuses.yaml` |
| Dark mode | Separate `/prototypes/c-dark/` preview route | Header toggle (localStorage `makenew-theme`) |

## Alternatives rejected

- **Prototype A/B as primary** — heavier nav or editorial layouts; C wins on simplicity
- **Manual Instagram YAML curation** — rejected in favor of one-time API wiring + auto-updates
- **Separate dark-variant route** — replaced by runtime theme toggle in header

## Next step

Complete content and API wiring, then follow `docs/deploy.md` for DNS cutover.
