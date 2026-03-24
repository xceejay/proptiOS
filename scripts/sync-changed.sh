#!/usr/bin/env bash

set -euo pipefail

base_ref="${1:-origin/main}"

while IFS= read -r project; do
  case "$project" in
    app)
      ./scripts/split-push.sh app.proptios.com git@github.com:xceejay/app.proptios.com.git
      ;;
    api-pm)
      ./scripts/split-push.sh api.pm.proptios.com git@github.com:xceejay/api.pm.proptios.com.git
      ;;
    www)
      ./scripts/split-push.sh www.proptios.com git@github.com:xceejay/www.proptios.com.git
      ;;
    api-events)
      ./scripts/split-push.sh api.events.proptios.com git@github.com:xceejay/api.events.proptios.com.git
      ;;
  esac
done < <(./scripts/changed-projects.sh "$base_ref")
