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

## Root Commands

- `pnpm projects`: print the known projects and their paths
- `pnpm bootstrap`: install Node dependencies for the Node projects
- `pnpm dev`: start the dashboard app
- `pnpm check`: run the default validation flow across relevant projects
- `pnpm check:changed`: validate only projects changed relative to `origin/main`
- `pnpm sync:changed`: push changed projects back to their legacy repositories
- `pnpm sync:app`
- `pnpm sync:api-pm`
- `pnpm sync:www`
- `pnpm sync:api-events`

## CI/CD Model

- CI runs from the monorepo root and can target only changed top-level projects.
- CD to the legacy repositories happens by subtree split and push.
- The workflow expects a GitHub token in the GitHub secret `DOWNSTREAM_SYNC_TOKEN`.

## Quick Start

```bash
pnpm bootstrap
pnpm check
```

For day-to-day work, start with [CONTRIBUTING.md](/home/joel/personal/projects/proptiOS/CONTRIBUTING.md) and [docs/REPO-STRUCTURE.md](/home/joel/personal/projects/proptiOS/docs/REPO-STRUCTURE.md).
