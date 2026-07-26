# Scope Decisions — v1 Launch

**Date:** 2026-06-12  
**Status:** Locked by stakeholder

## Decisions

| Topic | Decision | Rationale |
|-------|----------|-----------|
| Our Pastor | Drop page | No longer wanted on public site |
| CTPT content | Keep Google Docs links | Fastest path; no chapter migration |
| Messages | Footer/social link only | De-emphasize; recordings live on Facebook |
| Instagram | Link only in v1 | No API/embed complexity |
| Giving | Not in v1 | No donation flow needed at launch |

## Impact on migration

- **Pages in v1:** Home, Our Story, Our Beliefs, Events, CTPT index, Privacy Policy (6 pages)
- **Nav items:** Our Story, Our Beliefs, Events, Christian Themes for Privileged Teens
- **Footer additions:** Instagram, Facebook, YouTube, Messages (Facebook recordings)
- **Redirect:** `/our-pastor/` → 301 to `/our-story/` or 410 (confirm at cutover)
- **Redirect:** `/messages/` → 301 to `/events/` or homepage (confirm at cutover)
