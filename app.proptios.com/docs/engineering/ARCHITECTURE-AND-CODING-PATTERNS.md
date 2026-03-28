# app.proptios — Code Structure and Coding Patterns

This document captures the current frontend structure before bug-fix work starts.

## Stack

- **Framework:** Next.js 15 (Pages Router)
- **UI:** React 19 + Material UI 7 + MUI X Data Grid
- **State:** React Context for domain data, Redux Toolkit present for app/store concerns
- **Forms:** React Hook Form + Yup
- **Networking:** Axios via `src/pages/middleware/axios`
- **Notifications:** `react-hot-toast` (and some inconsistent toast usage)
- **Auth/Authz:** Auth0 + CASL
- **Language:** JavaScript / JSX (no TypeScript)

---

## High-level folder structure

```text
src/
├── @core/                  # shared app shell, theme, helpers, reusable primitives
├── api/                    # API-related helpers (limited usage)
├── configs/                # app configuration
├── context/                # domain providers: Users, Properties, Finance, etc.
├── hooks/                  # thin convenience hooks over React contexts
├── layouts/                # page layouts and layout chrome
├── lib/                    # misc library glue
├── navigation/             # nav definitions
├── pages/                  # Next.js routes (Pages Router)
├── store/                  # Redux store and slices
├── ui/                     # domain-oriented UI composition by feature
└── views/                  # reusable cross-feature view widgets
```

---

## Route-to-feature structure

The app is primarily organized as:

1. **Route entry** in `src/pages/**`
2. **Feature composition layer** in `src/ui/**`
3. **Data access** through `src/context/**`
4. **Convenience hook** in `src/hooks/**`

### Example flow

```text
src/pages/users/manage/[id]/[tab].js
  -> src/ui/user/*
  -> useUsers()
  -> src/context/UsersContext.js
  -> Axios -> API
```

That same pattern is repeated for:
- `users`
- `properties`
- `finance`
- `communication`
- `settings`

---

## Current architectural patterns in use

## 1. Domain Context pattern

Each major feature tends to expose a React Context provider with CRUD-ish methods.

Examples:
- `src/context/UsersContext.js`
- `src/context/PropertiesContext.js`
- `src/context/FinanceContext.js`

Typical shape:
- internal state (`users`, `properties`, `finance`, `loading`)
- imperative request methods (`getUsers`, `getUser`, `editUsers`, etc.)
- a thin hook such as `useUsers()` that simply returns `useContext(UsersContext)`

### Strengths
- simple to follow
- feature code can call backend methods directly
- low ceremony

### Weaknesses
- inconsistent method names (`editUser` vs `editUsers` style mismatch)
- response shapes are not normalized centrally
- mutation side effects are handled ad hoc in components
- error handling is duplicated across components

---

## 2. Page-shell + tabbed feature composition

Many feature pages use a left/right or tabbed composition:

- `Parent*ViewRight`
- `Parent*EditInfo`
- `*ViewLeft`
- `*ViewPage`

Examples:
- `src/ui/user/UserViewLeft.js`
- `src/ui/property/PropertyViewRight.js`
- `src/ui/communication/ParentCommunicationViewRight.js`

### Pattern
- top component decides active tab or page shell
- child feature components render each section
- route state often lives in the URL tab segment

### Risk
- duplicated wrapper components
- parent/child responsibilities are blurry
- some components fetch internally instead of receiving normalized data

---

## 3. Local state + DataGrid pattern

Tables are built with MUI DataGrid and usually combine:
- local `value` for quick search
- local select state for filters
- local `paginationModel`
- optional DataGrid `filterModel`

Examples:
- `src/ui/user/UserManageTable.js`
- `src/ui/finance/FinanceRentTransactionListTable.js`
- `src/ui/finance/FinanceExpensesTable.js`
- `src/ui/finance/FinanceStatementsTable.js`

### Pattern currently used
- app-level filtering is partly done in React
- DataGrid filter state is also wired in parallel
- toolbar components receive state setters from the parent table

### Risk
- duplicated filtering logic
- MUI community-grid filter limitations are easy to trip over
- quick search often updates state but is not actually applied to row filtering

---

## 4. Drawer / dialog mutation pattern

Mutations are usually performed from:
- row menus
- drawers
- modal dialogs

Examples:
- edit drawers
- add drawers
- confirm-save dialogs
- menu actions like enable/disable/delete

### Pattern
- component calls context method directly
- callback mutates local table state
- success/error toasts are shown inline

### Risk
- repeated toast/error boilerplate
- stale local state if callback logic is slightly wrong
- inconsistent naming or missing imports break flows easily

---

## 5. Forms with React Hook Form + Yup

Settings and form-heavy components generally use:
- `useForm`
- `Controller`
- `yupResolver`

Examples:
- `src/ui/settings/ParentSettingsAccountSettings.js`
- `src/ui/settings/ParentSettingsSiteSettings.js`
- many drawer forms across features

### Strengths
- consistent validation approach
- good fit for complex forms

### Weaknesses
- some forms still use hardcoded defaults instead of fetched data
- some save paths are wired to the wrong context method
- successful submit flows do not consistently `reset()` form state

---

## 6. Mock-first / placeholder UI mixed with real API wiring

Some screens are fully backed by API calls; others still use hardcoded arrays or placeholder shells.

Clear example:
- `src/ui/communication/ParentCommunicationViewIssues.js`
  - uses local `initialIssues` / `initialComments`
  - supports comment creation in local state only
  - create-issue button is not wired

### Implication
This codebase currently mixes:
- production-like API-backed flows
- prototype UI flows
- partially wired mutation paths

That means every bug fix needs to classify the screen first:
1. real production-backed feature
2. prototype/placeholder
3. hybrid feature with partial backend integration

---

## Feature map

## Users

Relevant files:
- `src/pages/users/**`
- `src/ui/user/**`
- `src/context/UsersContext.js`
- `src/hooks/useUsers.js`

Current patterns:
- user list is API-backed
- detail view is route-driven
- some internal detail fetching happens inside `UserViewLeft`

## Properties

Relevant files:
- `src/pages/properties/**`
- `src/ui/property/**`
- `src/context/PropertiesContext.js`
- `src/hooks/useProperties.js`

Current patterns:
- property list and detail are API-backed
- subtabs reuse `propertyData`
- overview and maintenance have frontend data-shaping logic in component code

## Finance

Relevant files:
- `src/pages/finance/**`
- `src/ui/finance/**`
- `src/context/FinanceContext.js`
- `src/hooks/useFinance.js`

Current patterns:
- multiple table views for payments/expenses/statements
- receipt/invoice preview pages fetch transaction detail directly
- settlement screen is only partially persisted

## Communication

Relevant files:
- `src/pages/communication/index.js`
- `src/ui/communication/**`

Current patterns:
- local-only issue and comment state
- tab shell built like a production feature even though the data is mock-backed

## Settings

Relevant files:
- `src/pages/settings/**`
- `src/ui/settings/**`

Current patterns:
- forms use RHF/Yup
- currently tied to `useUsers()` even where a dedicated settings/domain abstraction would be cleaner

---

## Coding patterns to preserve

These are worth keeping:

- feature-oriented UI folders under `src/ui/*`
- thin hooks over context providers
- RHF + Yup for forms
- row-menu + drawer interaction model
- MUI DataGrid for management tables

---

## Coding patterns to clean up during bug-fix work

## 1. Normalize context method names
Examples:
- singular vs plural methods should be consistent
- context method names should match what components call

## 2. Stop mutating props or relying on implicit fetch side effects
Components should:
- fetch into state
- render explicit loading / error / empty states
- never assign directly to props

## 3. Pick one filtering strategy per table
Prefer:
- React state for business filtering
- DataGrid for sort/pagination/rendering

instead of mixing both.

## 4. Centralize response normalization
Each context should normalize API responses so components do not guess whether data is:
- `response.data`
- `responseData.data`
- or raw payload

## 5. Add explicit boundaries between prototype and production flows
If a feature is still mock-backed:
- mark it clearly in code/docs
- avoid presenting dead controls as fully wired features

---

## Linting status

Linting already exists.

Current state before setup changes:
- ESLint flat config: `eslint.config.mjs`
- existing script: `lint` = auto-fix over `src/**/*.{js,jsx}`

That means the repo already has a linter, but it needs safer developer ergonomics:
- a non-mutating lint check
- test scripts that can run in CI
- conventions documented for future bug-fix work

---

## Testing status before setup work

Before this setup pass:
- no test runner configured
- no unit/integration test structure present
- no baseline test scripts in `package.json`

So the repo is currently QA-driven, not test-driven.

The next setup work will establish:
- unit/component test runner
- shared test setup
- feature-oriented test directories
- a TDD workflow for bug fixes
