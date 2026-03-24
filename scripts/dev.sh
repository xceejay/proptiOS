#!/usr/bin/env bash

set -euo pipefail

project="${1:-app}"

case "$project" in
  app)
    exec pnpm --dir app.proptios.com dev
    ;;
  api-pm)
    exec pnpm --dir api.pm.proptios.com dev
    ;;
  www)
    exec pnpm --dir www.proptios.com dev
    ;;
  api-events)
    exec bash -lc 'cd api.events.proptios.com && go run ./...'
    ;;
  *)
    echo "Unknown project: $project"
    echo "Use one of: app, api-pm, www, api-events"
    exit 1
    ;;
esac
