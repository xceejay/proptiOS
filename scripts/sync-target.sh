#!/usr/bin/env bash

set -euo pipefail

dry_run="false"

while [ "$#" -gt 0 ]; do
  case "$1" in
    --dry-run)
      dry_run="true"
      shift
      ;;
    *)
      break
      ;;
  esac
done

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 [--dry-run] <app|api-pm|www|api-events>"
  exit 1
fi

target="$1"
shift || true

split_cmd=(./scripts/split-push.sh)
if [ "$dry_run" = "true" ]; then
  split_cmd+=(--dry-run)
fi

case "$target" in
  app)
    exec "${split_cmd[@]}" app.proptios.com git@github.com:xceejay/app.proptios.com.git "$@"
    ;;
  api-pm)
    exec "${split_cmd[@]}" api.pm.proptios.com git@github.com:xceejay/api.pm.proptios.com.git "$@"
    ;;
  www)
    exec "${split_cmd[@]}" www.proptios.com git@github.com:xceejay/www.proptios.com.git "$@"
    ;;
  api-events)
    exec "${split_cmd[@]}" api.events.proptios.com git@github.com:xceejay/api.events.proptios.com.git "$@"
    ;;
  *)
    echo "Unknown target: $target"
    echo "Use one of: app, api-pm, www, api-events"
    exit 1
    ;;
esac
