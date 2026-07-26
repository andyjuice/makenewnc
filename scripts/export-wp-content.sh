#!/usr/bin/env bash
# Exports WordPress pages and media metadata for reference during migration.
# Does not overwrite curated src/content/ — writes to archive/ only.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BASE="https://www.makenewnc.org"
ARCHIVE="$ROOT/archive"

mkdir -p "$ARCHIVE/wp-json" "$ARCHIVE/wp-html"

echo "Exporting pages JSON..."
curl -sL --max-time 30 "$BASE/wp-json/wp/v2/pages?per_page=100" \
  -o "$ARCHIVE/wp-json/pages.json"

echo "Exporting media JSON..."
curl -sL --max-time 30 "$BASE/wp-json/wp/v2/media?per_page=100" \
  -o "$ARCHIVE/wp-json/media.json"

for slug in home our-story our-beliefs events christian-themes-for-privileged-teens privacy-policy; do
  if [ "$slug" = "home" ]; then
    url="$BASE/"
  else
    url="$BASE/$slug/"
  fi
  echo "Snapshot: $slug"
  curl -sL --max-time 20 "$url" -o "$ARCHIVE/wp-html/$slug.html"
done

echo "Done. See archive/wp-json and archive/wp-html"
