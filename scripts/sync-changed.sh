#!/usr/bin/env bash

set -euo pipefail

base_ref="${1:-origin/main}"

while IFS= read -r project; do
  case "$project" in
    app)
      ./scripts/sync-target.sh app
      ;;
    api-pm)
      ./scripts/sync-target.sh api-pm
      ;;
    www)
      ./scripts/sync-target.sh www
      ;;
    api-events)
      ./scripts/sync-target.sh api-events
      ;;
  esac
done < <(./scripts/changed-projects.sh "$base_ref")
