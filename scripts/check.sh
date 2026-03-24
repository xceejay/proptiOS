#!/usr/bin/env bash

set -euo pipefail

changed_only="false"
base_ref="origin/main"

if [ "${1:-}" = "--changed" ]; then
  changed_only="true"
  if [ -n "${2:-}" ]; then
    base_ref="$2"
  fi
fi

run_app() {
  echo "Checking app.proptios.com"
  pnpm --dir app.proptios.com lint
  pnpm --dir app.proptios.com test
  pnpm --dir app.proptios.com build
}

run_api_pm() {
  echo "Checking api.pm.proptios.com"
  if jq -e '.scripts.test and (.scripts.test | contains("no test specified") | not)' api.pm.proptios.com/package.json >/dev/null 2>&1; then
    pnpm --dir api.pm.proptios.com test
  else
    echo "Skipping api.pm.proptios.com tests: no real test script configured"
  fi
}

run_www() {
  echo "Checking www.proptios.com"
  if jq -e '.scripts.test and (.scripts.test | contains("no test specified") | not)' www.proptios.com/package.json >/dev/null 2>&1; then
    pnpm --dir www.proptios.com test
  else
    echo "Skipping www.proptios.com tests: no real test script configured"
  fi
}

run_api_events() {
  echo "Checking api.events.proptios.com"
  (cd api.events.proptios.com && go test ./...)
}

projects=()

if [ "$changed_only" = "true" ]; then
  while IFS= read -r project; do
    [ -n "$project" ] && projects+=("$project")
  done < <(./scripts/changed-projects.sh "$base_ref")
else
  projects=("app" "api-pm" "www" "api-events")
fi

if [ "${#projects[@]}" -eq 0 ]; then
  echo "No changed top-level projects detected."
  exit 0
fi

for project in "${projects[@]}"; do
  case "$project" in
    app) run_app ;;
    api-pm) run_api_pm ;;
    www) run_www ;;
    api-events) run_api_events ;;
    *)
      echo "Unknown project in check flow: $project"
      exit 1
      ;;
  esac
done
