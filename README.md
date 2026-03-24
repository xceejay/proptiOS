# proptiOS Monorepo

This repository is the canonical home for the proptiOS codebase.

It contains four deployable applications that used to live only as separate repositories. They now live together here, and changes can still be published back to their original repositories through subtree sync.

## Top-Level Layout

- `app.proptios.com/`: property manager dashboard built with Next.js
- `api.pm.proptios.com/`: Node.js API for the property manager dashboard
- `www.proptios.com/`: marketing and landing site
- `api.events.proptios.com/`: Go service for events and related backend processing
- `scripts/`: root automation for development, CI, and downstream sync
- `.github/workflows/`: monorepo CI and downstream publish workflows
- `docs/`: parent-level repository documentation for contributors and future agents

## Source Of Truth

This monorepo is the source of truth.

The legacy repositories still exist and can be updated from here:

- `git@github.com:xceejay/app.proptios.com.git`
- `git@github.com:xceejay/api.pm.proptios.com.git`
- `git@github.com:xceejay/www.proptios.com.git`
- `git@github.com:xceejay/api.events.proptios.com.git`

Avoid making direct changes in those repositories unless you intentionally want to manage sync drift.

## Contribution Policy

- Every contributor should clone and work from this monorepo.
- Feature branches, pull requests, reviews, and merges should happen here.
- The child repositories are downstream mirrors for deployment and compatibility, not the primary place for day-to-day development.
- Changes made directly in child repositories do not sync back into this monorepo automatically.

## Root Commands

- `pnpm projects`: print the known projects and their paths
- `pnpm doctor`: verify required local tools
- `pnpm bootstrap`: install Node dependencies for the Node projects
- `pnpm dev`: start the dashboard app
- `pnpm dev:api-events`: start the Go service
- `pnpm check`: run the default validation flow across relevant projects
- `pnpm check:changed`: validate only projects changed relative to `origin/main`
- `pnpm deploy [target] [branch]`: trigger downstream deployment workflow from the CLI
- `pnpm deploy:dry-run [target] [branch]`: safe preview of downstream deployment workflow
- `pnpm sync:changed`: push changed projects back to their legacy repositories
- `pnpm sync:target <project>`: push one project back to its legacy repository
- `pnpm sync:dry-run:app`
- `pnpm sync:dry-run:api-pm`
- `pnpm sync:dry-run:www`
- `pnpm sync:dry-run:api-events`
- `pnpm sync:app`
- `pnpm sync:api-pm`
- `pnpm sync:www`
- `pnpm sync:api-events`

## CI/CD Model

- CI runs from the monorepo root and can target only changed top-level projects.
- CD to the legacy repositories happens by subtree split and push.
- Monorepo `staging` syncs to child repo `staging`.
- Monorepo `main` syncs to child repo `main`.
- The workflow expects a GitHub token in the GitHub secret `DOWNSTREAM_SYNC_TOKEN`.
- Both CI and downstream sync can also be run manually through `workflow_dispatch`.

## Quick Start

```bash
pnpm doctor
pnpm bootstrap
pnpm check
```

Typical day-to-day flow:

```bash
git clone git@github.com:xceejay/proptiOS.git
cd proptiOS
pnpm doctor
pnpm bootstrap
pnpm dev
```

Deployment flow:

```bash
git push origin staging
```

That push triggers downstream sync to child `staging` branches for affected top-level projects.

Production flow:

```bash
git push origin main
```

That push triggers downstream sync to child `main` branches for affected top-level projects. If you want a manual run or a safe preview:

```bash
pnpm deploy:dry-run app staging
pnpm deploy app staging
pnpm deploy app main
```

For day-to-day work, start with [CONTRIBUTING.md](/home/joel/personal/projects/proptiOS/CONTRIBUTING.md) and [docs/REPO-STRUCTURE.md](/home/joel/personal/projects/proptiOS/docs/REPO-STRUCTURE.md).
