# Testing and Linting Plan

This document records the baseline engineering workflow before bug fixes begin.

## Current linting state

The repository already has ESLint configured:

- config: `eslint.config.mjs`
- package script: `lint`

### Important note
The existing `lint` script is **destructive** because it runs with `--fix`.
That is convenient for formatting cleanup, but not ideal for CI or for checking work without mutating files.

## Recommended lint workflow

Use separate scripts:

- `lint` → non-mutating lint check
- `lint:fix` → auto-fix
- `format` → Prettier write
- `format:check` → Prettier check
- `test` → one-shot Vitest run
- `test:watch` → watch mode
- `test:coverage` → coverage run

That gives us:
- safe local verification
- safer CI defaults
- explicit auto-fix behavior

### Baseline status right now
- `pnpm test` passes with the current harness
- `pnpm lint` does **not** pass yet because the existing codebase already contains many real errors and warnings across legacy screens

That lint result is useful baseline signal, not a reason to weaken the linter.

---

## Current testing state

Before this setup pass, the repo had no stable documented test workflow even though some test files had started to appear locally.

After this setup pass:
- Vitest is wired through `package.json`
- shared test setup lives in `test/setup.js`
- shared render helpers live in `test/test-utils.jsx`
- the baseline suite can be run with `pnpm test`

So browser QA now has an automated regression harness to grow into.

---

## Proposed test stack

For this codebase, the simplest fit is:

- **Vitest** for test runner
- **jsdom** for DOM environment
- **@testing-library/react** for component tests
- **@testing-library/jest-dom** for assertions
- **@testing-library/user-event** for user interactions

Why this stack:
- low setup overhead for a React + Next codebase
- fast local execution
- good fit for component-level regression tests around the bugs we found

---

## Test structure

```text
test/
  setup.js                 # global test setup
  test-utils.jsx           # shared render helpers
  smoke.test.jsx           # baseline harness smoke test
  store/
  todos/
  ui/
    property/
    user/
    finance/
    communication/
    settings/
```

### Directory rule
Tests should live close to the feature they verify.

Examples:
- `test/ui/property/PropertyViewOverview.test.jsx`
- `test/ui/user/UserManageTable.test.jsx`
- `test/ui/finance/ReceiptPreview.test.jsx`

This keeps regression coverage attached to the code it protects.

---

## What to test first

Focus first on the bugs from QA, not generic snapshot noise.

### High-value first tests
- property overview derived stat rendering
- users manage quick search/filter behavior
- finance table quick search behavior
- receipt preview loading / error rendering
- settings submit uses the correct context method
- communication create-issue button opens UI
- maintenance grid getters do not crash on partial rows

---

## Test strategy by bug type

## 1. Component behavior bugs
Use React Testing Library.

Examples:
- duplicated stat cards
- hidden/no-op button behavior
- search and filter logic
- loading/error/empty states

## 2. Context integration bugs
Mock the context hook or provider method.

Examples:
- settings save calling wrong method
- delete action showing toast and updating local state
- settlement save calling update method

## 3. API-shape normalization bugs
Mock the context callback payload and verify rendering.

Examples:
- user detail payload
- receipt preview payload
- statements response handling

---

## TDD workflow for this repo

For each bug fix:

1. create or update a focused test file for that feature
2. write the failing test that reproduces the bug
3. implement the smallest fix
4. run the focused test file
5. run full test suite
6. run lint
7. verify once in browser if the change affects user flow

This gives us:
- reproducible bug coverage
- no regression after future edits
- smaller, safer fix batches

---

## Guardrails

- Prefer focused behavioral tests over snapshots
- Avoid huge end-to-end scaffolding until unit/component regressions exist
- Mock context boundaries rather than mocking deep MUI internals
- Keep tests deterministic and small
- Add one regression test per confirmed bug before touching implementation where practical
