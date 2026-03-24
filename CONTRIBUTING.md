# Contributing

## Working Rule

Work in this repository first.

Do not treat the old child repositories as the primary place to branch, review, or merge. The intended flow is:

1. Make changes in the monorepo.
2. Open and merge through the monorepo.
3. Let subtree sync push affected folders back to the legacy repositories.

Direct edits in child repositories are out-of-policy for normal development. They do not sync back into the monorepo automatically.

## Project Boundaries

- `app.proptios.com` depends on `api.pm.proptios.com` as the dashboard backend.
- `www.proptios.com` is the public site and should stay isolated from dashboard-only code.
- `api.events.proptios.com` is a Go service and is not part of the Node workspace.

Do not move code across these boundaries casually. If shared code becomes necessary, introduce it deliberately as a new root-level package instead of coupling projects ad hoc.

## Branch Model

- Use `staging` for pre-production validation.
- Use `main` for production.
- Merge feature work into monorepo `staging` first.
- Promote to production by merging `staging` into `main`.
- Do not work directly in child repositories.

## Common Commands

- `pnpm doctor`
- `pnpm bootstrap`
- `pnpm check`
- `pnpm check:changed`
- `pnpm dev`
- `pnpm dev:api-pm`
- `pnpm dev:api-events`
- `pnpm deploy <target> <branch>`
- `pnpm sync:changed`
- `pnpm sync:target <project>`

## CI Expectations

Before pushing:

- run the relevant local checks for the project you touched
- avoid committing generated dependency folders
- update docs when the root workflow, repository layout, or operational model changes

Normal release flow:

1. Merge to `main`.
2. The monorepo push triggers downstream sync automatically.
3. Use `pnpm deploy:dry-run <target>` or `pnpm deploy <target>` only when you need a manual rerun or one-off publish.

Staging flow:

1. Merge to `staging`.
2. The monorepo push triggers downstream sync to child `staging` branches.
3. Test staging infrastructure against child repo `staging`.
4. Promote by merging monorepo `staging` into monorepo `main`.

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
