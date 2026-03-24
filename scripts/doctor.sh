#!/usr/bin/env bash

set -euo pipefail

check_cmd() {
  local cmd="$1"
  if command -v "$cmd" >/dev/null 2>&1; then
    printf "ok   %s\n" "$cmd"
  else
    printf "miss %s\n" "$cmd"
    return 1
  fi
}

status=0

for cmd in git pnpm node; do
  check_cmd "$cmd" || status=1
done

if [ -f "api.events.proptios.com/go.mod" ]; then
  check_cmd go || status=1
fi

if command -v gh >/dev/null 2>&1; then
  echo "ok   gh"
  if gh auth status >/dev/null 2>&1; then
    echo "ok   gh-auth"
  else
    echo "warn gh-auth"
  fi
else
  echo "warn gh"
fi

exit "$status"
