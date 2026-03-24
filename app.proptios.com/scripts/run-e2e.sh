#!/usr/bin/env bash
#
# run-e2e.sh — Wait for the backend API, then run Playwright e2e tests.
#
# Usage:
#   ./scripts/run-e2e.sh                          # local (default)
#   E2E_ENV=staging ./scripts/run-e2e.sh          # staging
#   E2E_ENV=prod    ./scripts/run-e2e.sh --headed # prod, headed browser
#   ./scripts/run-e2e.sh --ui                     # Playwright UI mode
#
# Environment variables:
#   E2E_ENV       Target environment: local | staging | prod  (default: local)
#   E2E_API_URL   Override backend URL (takes precedence over E2E_ENV)
#   E2E_PORT      Frontend port        (default: 3001)
#   E2E_TIMEOUT   Max wait in seconds  (default: 30)

set -euo pipefail

# ── Resolve API URL from environment ──────────────────────────────
ENV="${E2E_ENV:-local}"

if [ -n "${E2E_API_URL:-}" ]; then
  API_URL="$E2E_API_URL"
else
  case "$ENV" in
    local)   API_URL="http://127.0.0.1:2024" ;;
    staging) API_URL="https://staging.api.pm.proptios.com" ;;
    prod)    API_URL="https://api.pm.proptios.com" ;;
    *)
      echo "ERROR: Unknown E2E_ENV='$ENV'. Use local, staging, or prod."
      exit 1
      ;;
  esac
fi

TIMEOUT="${E2E_TIMEOUT:-30}"

echo "==> Environment: ${ENV}"
echo "==> API URL:     ${API_URL}"
echo ""

# ── Wait for the backend ─────────────────────────────────────────
echo "==> Checking backend API at ${API_URL}/ping ..."

elapsed=0
until curl -sf "${API_URL}/ping" > /dev/null 2>&1; do
  if [ "$elapsed" -ge "$TIMEOUT" ]; then
    echo "ERROR: Backend API at ${API_URL} did not respond within ${TIMEOUT}s."
    echo ""
    if [ "$ENV" = "local" ]; then
      echo "Start the API first:"
      echo "  cd ../api.pm.proptios.com && npm run dev"
    fi
    exit 1
  fi
  sleep 1
  elapsed=$((elapsed + 1))
  printf "    waiting... (%ds/%ds)\r" "$elapsed" "$TIMEOUT"
done

echo "==> Backend API is up."
echo ""

# ── Export so Playwright config + Next.js dev server pick it up ──
export E2E_API_URL="$API_URL"
export NEXT_PUBLIC_API_BASE_URL="$API_URL"

echo "==> Running Playwright tests ..."

exec npx playwright test "$@"
