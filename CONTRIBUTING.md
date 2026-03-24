# Contributing

## Working Rule

Work in this repository first.

Do not treat the old child repositories as the primary place to branch, review, or merge. The intended flow is:

1. Make changes in the monorepo.
2. Open and merge through the monorepo.
3. Let subtree sync push affected folders back to the legacy repositories.

## Project Boundaries

- `app.proptios.com` depends on `api.pm.proptios.com` as the dashboard backend.
- `www.proptios.com` is the public site and should stay isolated from dashboard-only code.
- `api.events.proptios.com` is a Go service and is not part of the Node workspace.

Do not move code across these boundaries casually. If shared code becomes necessary, introduce it deliberately as a new root-level package instead of coupling projects ad hoc.

## Common Commands

- `pnpm bootstrap`
- `pnpm check`
- `pnpm check:changed`
- `pnpm dev`
- `pnpm dev:api-pm`
- `pnpm sync:changed`
- `pnpm sync:target <project>`

## CI Expectations

Before pushing:

- run the relevant local checks for the project you touched
- avoid committing generated dependency folders
- update docs when the root workflow, repository layout, or operational model changes

## Downstream Sync

Use one of:

- `pnpm sync:app`
- `pnpm sync:api-pm`
- `pnpm sync:www`
- `pnpm sync:api-events`
- `pnpm sync:changed`
- `pnpm sync:target <project>`

These commands require push access to the child repositories.

For a safe preview, use one of the dry-run commands from the root package scripts before pushing downstream.

## For The Next Agent

Read these files first:

- [README.md](/home/joel/personal/projects/proptiOS/README.md)
- [MONOREPO.md](/home/joel/personal/projects/proptiOS/MONOREPO.md)
- [docs/REPO-STRUCTURE.md](/home/joel/personal/projects/proptiOS/docs/REPO-STRUCTURE.md)

Those three files explain the repo shape, the migration history, and how downstream publishing works.
