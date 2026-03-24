#!/usr/bin/env bash

set -euo pipefail

base_ref="${1:-origin/main}"

if ! git rev-parse --verify "$base_ref" >/dev/null 2>&1; then
  base_ref="HEAD~1"
fi

git diff --name-only "$base_ref"...HEAD \
  | awk -F/ '
      $1 == "app.proptios.com" { seen["app"]=1 }
      $1 == "api.pm.proptios.com" { seen["api-pm"]=1 }
      $1 == "www.proptios.com" { seen["www"]=1 }
      $1 == "api.events.proptios.com" { seen["api-events"]=1 }
      END {
        if (seen["app"]) print "app"
        if (seen["api-pm"]) print "api-pm"
        if (seen["www"]) print "www"
        if (seen["api-events"]) print "api-events"
      }
    '
