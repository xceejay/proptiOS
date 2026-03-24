# app.proptios.com — Codebase Structure & Working Notes

_Last updated: 2026-03-23_

## What this repo is
A Next.js 15 frontend for the ProptiOS property-management dashboard. The app is still heavily influenced by the original admin-template structure, but the active product surface now lives in feature-oriented pages under `src/pages` and UI components under `src/ui`.

## Top-level layout
- `src/pages` — route entrypoints using the Next.js Pages Router.
- `src/ui` — domain UI for business features (`property`, `tenant`, `lease`, `finance`, `user`, etc.).
- `src/@core` — shared template-era infrastructure: layout shell, theme, common widgets, auth helpers, utilities.
- `src/layouts` — app shell composition and layout-level components.
- `src/navigation` — sidebar/navigation definitions.
- `src/store` — Redux store bootstrap.
- `src/hooks`, `src/context`, `src/lib`, `src/configs` — app-wide support code.
- `src/views` — older/template-style view layer still used in some places.
- `public` / `styles` — static assets and global styling.
- `test` — Vitest + Testing Library test tree, mirroring feature areas.
- `docs` — project-facing architecture/testing notes.

## How the app is actually organized
### Routing layer
Routes live in `src/pages/**`. Most route files are thin wrappers that:
1. read URL params / router state,
2. fetch or subscribe to data via hooks,
3. hand the result into `src/ui/**` components.

### Feature UI layer
Feature work is concentrated in `src/ui/**`.
Examples:
- `src/ui/property/*`
- `src/ui/tenant/*`
- `src/ui/lease/*`
- `src/ui/finance/*`
- `src/ui/user/*`

This is where most current bug-fix work belongs.

### Shared shell / template layer
`src/@core/**` and `src/layouts/**` provide:
- theme setup,
- layout chrome,
- shared widgets,
- some auth/ACL helpers,
- utilities inherited from the original dashboard template.

This layer is useful, but it is also where stale imports and archive-era coupling still show up.

## Coding patterns currently in use
### 1. Pages Router + feature component handoff
Route files tend to stay relatively thin, while the feature logic sits inside `src/ui/**` components.

### 2. Hook-based React components
Most active code is function components using hooks (`useState`, `useMemo`, custom hooks, router hooks).

### 3. Material UI composition
The UI is built mostly with MUI components and custom `@core` wrappers. Layout and spacing are declarative and component-heavy.

### 4. Redux present but currently minimal
`src/store/index.js` now exposes a minimal `app` noop reducer after template cleanup. That means feature state is currently split between:
- local component state,
- server/API fetch state,
- some remaining shared app state in Redux.

### 5. Template-era duplication / drift
There are still signs of template inheritance:
- duplicated card/stat blocks,
- old `views` folders alongside current `ui` folders,
- archived import paths lingering in layout files,
- old patterns mixed with newer null-safe React code.

### 6. Defensive rendering is being retrofitted
Recent fixes are adding optional chaining and null guards, which suggests the codebase was originally written assuming eager, fully-shaped API payloads.

## Proposed fix workstreams before feature changes
These are the cleanup items already identified from QA/code review and should be handled before or alongside product fixes.

### Layout / architecture cleanup
- Remove live imports that still point at archived horizontal-layout/template files.
- Finish normalizing `src/store/index.js` and any imports that still assume archived reducers exist.
- Reduce reliance on old `src/views/**` artifacts where the active product already has `src/ui/**` equivalents.

### Runtime stability cleanup
- Keep adding null-safe handling around property detail data (`units`, `tenants`, `maintenance_requests`, etc.).
- Remove dead action handlers and stale imports that survived the template cleanup.
- Add visible success/error feedback to mutation flows that currently fail silently or ambiguously.

### UX consistency cleanup
- Standardize table behavior across feature screens:
  - quick search should actually filter,
  - row actions should exist where expected,
  - destructive actions should mutate and report status,
  - drawer submit flows should clearly resolve.

## Linting status
Linting already exists in this repo.

Current tooling:
- `eslint.config.mjs`
- `.prettierrc.js`

Commands:
- `pnpm lint`
- `pnpm lint:fix`
- `pnpm format`

So the repo did **not** need a new linter; it needed the existing one to be treated as part of the delivery flow.

## Testing direction
A Vitest + Testing Library structure has been added so fixes can be written test-first.

Test layout:
- `test/store/**` — store/bootstrap tests
- `test/ui/**` — component and feature tests
- `test/todos/**` — explicit backlog placeholders for upcoming regression coverage

Recommended workflow for every bug fix:
1. add or unskip a failing regression test,
2. implement the smallest code change,
3. run `pnpm test`,
4. run `pnpm lint`,
5. then verify in-browser.
