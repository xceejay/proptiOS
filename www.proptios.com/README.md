# ProptiOS landing page

Landing page for proptiOS 

This site is maintained from the `proptiOS` monorepo.

Build/deploy notes:
- local/CI site builds use `hugo --gc --minify`
- Node dependencies are installed with `pnpm`
- Vercel receives the generated `public/` directory directly; it does not run `vercel build` for this project

Contribution policy:
- clone and work from the root monorepo
- do not open feature branches or PRs from this child repository
- changes made here directly do not sync back to the monorepo automatically
