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

target="${1:-all}"
branch="${2:-staging}"

if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI is required for deploy.sh"
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI is not authenticated"
  exit 1
fi

case "$target" in
  all|app|api-pm|www|api-events)
    ;;
  *)
    echo "Unknown deploy target: $target"
    echo "Use one of: all, app, api-pm, www, api-events"
    exit 1
    ;;
esac

case "$branch" in
  main|staging)
    ;;
  *)
    echo "Unknown deploy branch: $branch"
    echo "Use one of: main, staging"
    exit 1
    ;;
esac

gh workflow run sync-downstream.yml \
  --repo xceejay/proptiOS \
  -f target="$target" \
  -f branch="$branch" \
  -f dry_run="$dry_run"

echo "Triggered sync-downstream.yml for target=$target branch=$branch dry_run=$dry_run"
