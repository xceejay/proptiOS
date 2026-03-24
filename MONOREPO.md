# proptiOS Monorepo Migration

## Short Answer

Yes. Create a new GitHub repository for the root monorepo.

That repo should become the canonical source of truth. The existing repositories remain in place as publish targets for:

- `app.proptios.com`
- `api.pm.proptios.com`
- `www.proptios.com`
- `api.events.proptios.com`

## Target Model

- Root repo: `proptios-monorepo` on GitHub
- Existing repos: downstream mirrors fed from subtree pushes
- Local development: one checkout at the root
- Deployment: unchanged per app until intentionally consolidated
- Branch mapping: monorepo `staging` -> child `staging`, monorepo `main` -> child `main`

## Why This Model

- You can change multiple apps in one branch and one pull request.
- The existing repositories can still receive pushes for teams, deployments, or integrations that depend on them.
- The split boundaries stay explicit because each app keeps its own folder.

## Recommended Rule

Use the monorepo as the only source of truth.

Direct commits to the child repositories create a two-way sync problem. That is possible, but it is operationally expensive and error-prone.

## Migration Steps

1. Create a new empty GitHub repository for the monorepo.
2. Initialize Git in this root folder.
3. Import each existing repository history into its folder using `git subtree add` or `git filter-repo` based migration.
4. Remove the nested `.git` directories after history is imported.
5. Push the new root repo to GitHub.
6. Use subtree split pushes to publish folder changes back to the existing repositories.
7. Add CI so pushes to `main` automatically update the child repositories when their folders change.

## Initial Commands

```bash
cd /home/joel/personal/projects/proptiOS
git init
git branch -m main
git remote add origin git@github.com:<your-org-or-user>/proptios-monorepo.git
```

Then import each app history instead of committing the current directory state blindly.

If a child repository has uncommitted work, clean or commit that work first. Importing history while the child repo is dirty makes the migration ambiguous.

## Split Push Commands

After the monorepo is established, these scripts push a folder back to its existing repository:

```bash
pnpm sync:app
pnpm sync:api-pm
pnpm sync:www
pnpm sync:api-events
```

## CI Direction

Set up CI in the monorepo to:

- detect which top-level folders changed
- run tests only for affected projects
- push changed folders back to their corresponding GitHub repositories

A starter workflow is included at `.github/workflows/sync-downstream.yml`. It expects a GitHub token with write access to the child repositories in the GitHub secret `DOWNSTREAM_SYNC_TOKEN`.

## Current Blocker

At the moment, at least these child repositories are not clean:

- `app.proptios.com`
- `api.pm.proptios.com`
- `www.proptios.com`

Do not remove nested `.git` directories or import history until you decide what to do with those local changes.

## Notes About Current Stack

- `app.proptios.com`: Node/Next.js
- `api.pm.proptios.com`: Node
- `www.proptios.com`: Node-based site
- `api.events.proptios.com`: Go service

Only the Node projects are included in `pnpm-workspace.yaml`. The Go service can remain independent inside the monorepo unless you later decide to add root-level Go automation.
