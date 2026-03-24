# Bug Fix Proposal (Pre-implementation)

This plan is intentionally written before code changes so implementation can follow a test-driven path.

## Recommended order

### Wave 1 — fast frontend-only wins
1. Property delete `toast is not defined`
2. Property overview duplicated / hardcoded stats
3. Users manage search / filter cleanup
4. Communication `Create new Issue` no-op
5. Receipt / invoice preview defensive fixes

### Wave 2 — frontend + context wiring
6. Finance expenses page data not passed
7. Settlement save not persisted
8. Global settings save crash

### Wave 3 — backend/API blockers
9. Users detail `GET /users/:id -> 500`
10. Finance statements `GET /transactions -> 500`
11. Receipt detail identifier / payload mismatches if still present
12. Property maintenance grid crash

---

## 1. Property delete: `toast is not defined`

**Symptom**
- Deleting a property throws `toast is not defined`

**Likely root cause**
- `toast` is used but not imported
- property context hook is invoked incorrectly in the row action
- method name used in component does not match the context API exactly

**Files**
- `src/ui/property/PropertyManageTable.js`
- `src/context/PropertiesContext.js`

**Fix plan**
- import `toast` from `react-hot-toast`
- instantiate the hook once in component scope
- call the real context deletion method
- update local table data using the real data shape after success
- keep delete behavior consistent with other row actions

**Tests to add first**
- row delete success path calls delete method and shows success feedback
- row delete failure path shows error feedback

---

## 2. Property overview duplicated / hardcoded stats

**Symptom**
- duplicated stat groups
- units / applicants show hardcoded zeroes
- counts do not align with property data

**Likely root cause**
- duplicate JSX blocks in `PropertyViewOverview`
- hardcoded strings instead of derived values

**Files**
- `src/ui/property/PropertyViewOverview.js`

**Fix plan**
- remove the duplicate stats section
- compute all stats from `propertyData`
- use a single source-of-truth derived object for card values
- avoid any hardcoded count strings in the render tree

**Tests to add first**
- renders one card per metric, not duplicates
- derived counts reflect provided `propertyData`

---

## 3. Users manage search is broken

**Symptom**
- visible names do not match quick search
- filters partially work
- sort affordances exist but table logic is overcomplicated

**Likely root cause**
- quick search only checks email
- local filtering and DataGrid filter model are both used at once

**Files**
- `src/ui/user/UserManageTable.js`
- `src/views/table/data-grid/CustomUsersToolbar.js`

**Fix plan**
- move table filtering fully into React state
- search across at least `name` and `email`
- keep status and invitation filters in React state too
- stop relying on DataGrid `filterModel` for app-level logic

**Tests to add first**
- quick search matches name
- quick search matches email
- status filter narrows rows
- combined filters work together

---

## 4. Users detail view fails to hydrate

**Symptom**
- detail route opens
- left panel stays on `Loading...`
- console showed `GET /users/:id -> 500`

**Likely root cause**
- frontend fetch/state handling in `UserViewLeft` is broken
- backend endpoint may also be failing

**Files**
- `src/ui/user/UserViewLeft.js`
- `src/context/UsersContext.js`
- backend `/users/:id`

**Fix plan**
- introduce explicit local state for loading/error/user
- fetch based on route `id`
- stop mutating the `userData` prop
- normalize the returned response shape
- render a proper error state if API fails
- then inspect/fix the backend 500 separately if still present

**Tests to add first**
- successful fetch renders user details
- failed fetch renders error state instead of infinite loading

---

## 5. Finance payments quick search broken

**Symptom**
- quick search does not change visible rows

**Likely root cause**
- search state is updated but not applied to the row filter

**Files**
- `src/ui/finance/FinanceRentTransactionListTable.js`

**Fix plan**
- include quick-search in computed `filteredRows`
- search across uuid, property, unit, tenant, payment method
- keep local filter state separate from DataGrid UI state

**Tests to add first**
- quick search hit returns matching rows
- nonsense search returns empty state

---

## 6. Receipt detail blank page

**Symptom**
- receipt detail route opens but content is blank

**Likely root cause**
- inconsistent identifier use (`uuid` vs `id`)
- fragile fetch logic in preview pages
- missing toast import in error path
- payload assumptions not normalized

**Files**
- `src/pages/finance/receipt/view/[id].js`
- `src/pages/finance/invoice/view/[id].js`
- `src/context/FinanceContext.js`
- finance table link renderers

**Fix plan**
- standardize the identifier used in links and fetches
- fetch on `[id]` changes, not just initial mount
- import toast correctly if used
- normalize transaction payload before rendering preview components
- add explicit loading / not-found / unsupported-type rendering

**Tests to add first**
- valid transaction renders preview
- invalid transaction shows error state
- route param change triggers re-fetch

---

## 7. Finance expenses page receives no data

**Symptom**
- expenses grid is empty
- console logs finance data as undefined

**Likely root cause**
- parent does not pass `financeData` into `FinanceExpensesTable`

**Files**
- `src/ui/finance/ParentFinanceViewExpenses.js`
- `src/ui/finance/FinanceExpensesTable.js`

**Fix plan**
- pass `financeData` through from parent
- confirm the table only renders expense data if this route is meant to be expenses-only
- wire quick search the same way as other finance tables

**Tests to add first**
- parent passes data to table
- table renders expense rows when data exists

---

## 8. Finance statements route hits `/transactions -> 500`

**Symptom**
- statements shell loads
- banner shows server error
- API call returns 500

**Likely root cause**
- backend endpoint failure
- frontend also assumes a narrow response shape

**Files**
- `src/ui/finance/ParentFinanceViewStatements.js`
- `src/ui/finance/FinanceStatementsTable.js`
- `src/context/FinanceContext.js`
- backend `/transactions`

**Fix plan**
- normalize response shape in finance context or parent view
- render a real error state, not just an empty grid
- inspect backend failure once frontend assumptions are cleaned up

**Tests to add first**
- error response renders a visible error state
- valid response renders rows

---

## 9. Settlement frequency save is not persisted

**Symptom**
- dialog opens and save fires
- but persistence is local only

**Likely root cause**
- no API call in `handleSaveFrequency`

**Files**
- `src/ui/finance/ParentFinanceViewSettlement.js`
- `src/context/FinanceContext.js`

**Fix plan**
- add a real finance context update method for settlement frequency
- call API on save
- refresh settlement data after success
- display success/error feedback

**Tests to add first**
- clicking save calls finance update method
- successful save updates visible frequency state

---

## 10. Property maintenance tab crashes

**Symptom**
- route crashes before the grid is usable

**Likely root cause**
- `valueGetter` signatures not compatible with installed MUI X version
- suspicious setter prop wiring
- search fields target probably-nonexistent properties

**Files**
- `src/ui/property/PropertyViewMaintenance.js`

**Fix plan**
- update all DataGrid getters to the correct signature for MUI X v7
- guard against missing row data
- fix prop names passed into row options/drawers
- update search to target actual maintenance fields

**Tests to add first**
- grid renders with minimal maintenance row data
- getters do not throw on partial rows

---

## 11. Communication create issue button is a no-op

**Symptom**
- create button exists but does nothing

**Likely root cause**
- button has no click handler
- feature still uses local mock state only

**Files**
- `src/ui/communication/ParentCommunicationViewIssues.js`

**Fix plan**
- wire the button to open a create drawer/dialog
- define a minimal issue creation form
- on submit, append the created issue to state and select it
- if backend is not ready, keep this explicitly local or feature-flagged

**Tests to add first**
- clicking create opens a drawer/dialog
- submitting adds the issue to the list

---

## 12. Global settings save crash: `users.editUser is not a function`

**Symptom**
- forms render
- save fails at runtime because method does not exist

**Likely root cause**
- components call `editUser`
- context exposes `editUsers`
- settings screens also use hardcoded defaults and likely the wrong domain abstraction

**Files**
- `src/ui/settings/ParentSettingsAccountSettings.js`
- `src/ui/settings/ParentSettingsSiteSettings.js`
- `src/context/UsersContext.js`

**Fix plan**
- short-term: call the correct exported method name if this endpoint is valid
- medium-term: move settings persistence behind a dedicated settings abstraction if it is not truly user-editing
- replace hardcoded bootstrap values with fetched settings values
- call `reset()` after successful save so dirty tracking behaves correctly

**Tests to add first**
- submit calls the correct save method
- successful save clears dirty state
- failed save surfaces validation or runtime error cleanly

---

## Cross-cutting technical cleanup

## A. Use one filtering strategy per table
Prefer:
- React state for business filtering
- DataGrid for rendering, sort, pagination

Avoid mixing local filter state and DataGrid `filterModel` unless strictly necessary.

## B. Normalize API response shapes centrally
Context methods should return predictable shapes so components stop guessing.

## C. Explicit state rendering everywhere
Every fetch-heavy screen should visibly distinguish:
- loading
- error
- empty
- success

---

## Test-driven implementation approach

For each bug:
1. add a failing unit/component test that describes the current broken behavior
2. implement the smallest fix
3. run focused tests
4. run lint + broader test suite
5. then move to browser QA confirmation
