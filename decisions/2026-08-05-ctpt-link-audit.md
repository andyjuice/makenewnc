# CTPT 2.0 link audit

## Decision

Align `content/ctpt.md` chapter URLs with the CTPT Draft 2.0 Google Drive folder
and the legacy WordPress chapter index structure.

## Context

The Astro CTPT page listed chapters 5–8 with URLs shifted by one position:
Chapter 5 pointed to the First Sin appendix doc, and chapters 6–8 each pointed
to the previous chapter's document. Chapter 4 appendix (First Sin) was missing.

CTPT 2.0 lives in Google Drive (`12-AFrfvHsPm2JjWmF9UhrVxK7cf-lb4w`). Document
IDs match the prior WordPress site; content was updated in place rather than via
new doc URLs.

## Alternatives considered

- **Migrate chapter bodies to Markdown on-site:** Better long-term SEO but out of
  scope for this content correction.
- **Add Table of Contents doc to index:** Present in Drive but not on legacy WP
  accordion; omitted to keep parity with the established chapter list.

## Tradeoffs

- Google Doc links remain external dependencies; link rot is possible if docs move.
- Subtitles added for chapters 4–8 improve scanability without changing page layout.

## Final rationale

Restore correct chapter-to-document mapping so readers reach the intended CTPT 2.0
content, especially Chapter 5 (Finding God).
