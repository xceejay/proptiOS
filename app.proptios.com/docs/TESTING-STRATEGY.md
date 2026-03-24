# Testing Strategy for app.proptios.com

## Goal
Move bug-fixing from manual-only QA to a repeatable test-driven workflow.

## Stack
- **Runner:** Vitest
- **DOM environment:** jsdom
- **Component assertions:** Testing Library + jest-dom

## Commands
- `pnpm test` — one-shot run
- `pnpm test:watch` — local TDD loop
- `pnpm test:coverage` — coverage report

## Folder convention
Mirror the app structure inside `test/` so failures point to the same domain language used in `src/`.

Examples:
- `src/ui/property/PropertyViewOverview.js`
- `test/ui/property/PropertyViewOverview.test.jsx`

## Test pyramid for this repo
### 1. Fast regression tests first
Use component/unit-style tests for:
- table filtering logic,
- drawer submit-state behavior,
- null-safe rendering,
- route-level conditionals,
- utility transforms.

### 2. Integration coverage next
Add tests around feature hooks and mutation flows where practical.

### 3. Browser QA remains the final gate
Because this repo is UI-heavy and template-inherited, browser verification still matters after automated tests pass.

## First targets to convert into regressions
- archived layout imports do not leak back into active layout code
- finance quick search filters visible rows
- user quick search matches name and email
- tenant account actions do not crash from undefined variables
- property unit edit shows a clear success/error outcome
- lease delete performs a mutation and surfaces feedback

## Rule of thumb
If a bug was found manually once, add a regression test before shipping the fix.
