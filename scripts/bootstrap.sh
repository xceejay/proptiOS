#!/usr/bin/env bash

set -euo pipefail

projects=(
  "app.proptios.com"
  "api.pm.proptios.com"
  "www.proptios.com"
)

for project in "${projects[@]}"; do
  if [ -f "$project/package.json" ]; then
    echo "Installing dependencies in $project"
    pnpm install --dir "$project"
  fi
done
