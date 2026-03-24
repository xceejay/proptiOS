#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <prefix> <remote-url> [branch]"
  exit 1
fi

prefix="$1"
remote_url="$2"
branch="${3:-main}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Run this script from the monorepo root after git init."
  exit 1
fi

if [ -d "$prefix/.git" ]; then
  echo "Nested git repo still present at $prefix/.git"
  echo "Import history first from the remote, then remove the nested .git directory intentionally."
  exit 1
fi

if [ -e "$prefix" ] && [ -n "$(find "$prefix" -mindepth 1 -maxdepth 1 2>/dev/null)" ]; then
  echo "Prefix directory is not empty: $prefix"
  echo "Move or clear the existing working tree copy before importing history."
  exit 1
fi

tmp_remote="import-$(echo "$prefix" | tr '/.' '--')"

cleanup() {
  git remote remove "$tmp_remote" >/dev/null 2>&1 || true
}

trap cleanup EXIT

git remote add "$tmp_remote" "$remote_url"
git fetch "$tmp_remote" "$branch"
git subtree add --prefix="$prefix" "$tmp_remote" "$branch"
