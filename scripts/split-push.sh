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

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 [--dry-run] <prefix> <remote-url> [branch]"
  exit 1
fi

prefix="$1"
remote_url="$2"
branch="${3:-main}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Run this script from the monorepo root after git init."
  exit 1
fi

if [ ! -d "$prefix" ]; then
  echo "Missing prefix directory: $prefix"
  exit 1
fi

tmp_remote="split-$(echo "$prefix" | tr '/.' '--')"

cleanup() {
  git remote remove "$tmp_remote" >/dev/null 2>&1 || true
}

trap cleanup EXIT

git remote add "$tmp_remote" "$remote_url"
git subtree split --prefix="$prefix" -b "$tmp_remote-$branch"
split_commit="$(git rev-parse "$tmp_remote-$branch")"
echo "Prepared split branch $tmp_remote-$branch at $split_commit for $prefix"

if [ "$dry_run" = "true" ]; then
  echo "Dry run enabled. Skipping push to $remote_url"
else
  git push "$tmp_remote" "$tmp_remote-$branch:$branch"
fi

git branch -D "$tmp_remote-$branch" >/dev/null 2>&1 || true
