# Repository Structure

## What This Repository Is

This is a monorepo created from four existing repositories via `git subtree`.

The root repository was initialized after the child repositories already existed, then each child repository was imported into the root with history preserved. The imported commits appear in root history as subtree merge commits.

The current root remote is:

- `git@github.com:xceejay/proptiOS.git`

## Imported Projects

### `app.proptios.com`

- Role: property manager dashboard
- Stack: Next.js and Node.js
- Typical local commands:
  - `pnpm --dir app.proptios.com dev`
  - `pnpm --dir app.proptios.com test`
  - `pnpm --dir app.proptios.com build`
- Legacy downstream remote:
  - `git@github.com:xceejay/app.proptios.com.git`

### `api.pm.proptios.com`

- Role: property manager API
- Stack: Node.js
- Typical local commands:
  - `pnpm --dir api.pm.proptios.com dev`
- Legacy downstream remote:
  - `git@github.com:xceejay/api.pm.proptios.com.git`

### `www.proptios.com`

- Role: marketing and landing site
- Stack: Node-based site
- Legacy downstream remote:
  - `git@github.com:xceejay/www.proptios.com.git`

### `api.events.proptios.com`

- Role: events-oriented backend service
- Stack: Go
- Typical local commands:
  - `go test ./...` from `api.events.proptios.com`
- Legacy downstream remote:
  - `git@github.com:xceejay/api.events.proptios.com.git`

## Operational Rules

- The monorepo is the source of truth.
- The legacy repositories are publish targets, not the preferred place to make changes.
- Downstream sync works by `git subtree split` on top-level folders.
- The root scripts are intentionally simple shell wrappers so the workflow is visible and easy to debug.

## Important Historical Note

At migration time, the original child working directories were moved to `/tmp/proptios-monorepo-migration`, then re-imported into the root via `git subtree add`. That temporary backup is not part of the repository.

## Root Tooling

### Node workspace

`pnpm-workspace.yaml` includes the Node projects:

- `app.proptios.com`
- `api.pm.proptios.com`
- `www.proptios.com`

The Go service is intentionally not part of the pnpm workspace.

### Root scripts

- `scripts/list-projects.sh`: prints known project names and locations
- `scripts/bootstrap.sh`: installs Node dependencies in workspace projects
- `scripts/dev.sh`: starts a selected local service
- `scripts/changed-projects.sh`: reports changed top-level projects
- `scripts/check.sh`: runs project-specific validation
- `scripts/sync-changed.sh`: pushes only changed projects downstream
- `scripts/sync-target.sh`: pushes or dry-runs one selected downstream target
- `scripts/split-push.sh`: subtree split and push helper
- `scripts/import-subtree.sh`: guarded subtree import helper

## CI Layout

- `.github/workflows/ci.yml`: validation flow for changed projects
- `.github/workflows/sync-downstream.yml`: subtree publish workflow for changed projects on `main`
- Both workflows also support manual `workflow_dispatch` runs.

The downstream sync workflow uses the repository secret `DOWNSTREAM_SYNC_TOKEN` and pushes over HTTPS.

If CI behavior changes, update this file so future agents do not need to rediscover the workflow model.
