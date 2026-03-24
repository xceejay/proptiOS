# proptiOS Cross-Cutting Table QA Findings

Date: 2026-03-23
Tester: Codex
Environment:
- Frontend: `http://127.0.0.1:3002`
- API: `http://127.0.0.1:2024`
- User: `joel@example.com`

## Scope
Reusable table behavior only:
- quick search boxes
- sorting
- pagination
- export buttons
- row action menus
- visible success/error feedback after actions

Representative pages covered:
- Properties: `/properties`
- Tenants: `/tenants`
- Leases: `/leases`
- Finance: `/finance`
- Users: `/users/manage`

## Findings Summary
- `FAIL` Tenant row action account actions crash before any user feedback is shown.
- `FAIL` User manage quick search only filters by email, not the visible user name.
- `FAIL` Finance quick search input does not affect the grid at all.
- `FAIL` Finance rent payments table has no row action menu, unlike the other major list pages.
- `FAIL` Lease management delete action is a stub with no mutation and no success/error feedback.
- `PASS` Properties management table search, sorting, export, pagination, and row action menu open all worked in-browser.
- `PASS` Tenants quick search and row action menu open worked in-browser before invoking the broken account actions.
- `PASS` Finance pagination worked in-browser.

## Evidence

### Route tested
`/properties`

Action tested:
- Quick search for `Embassy`
- Sort by `Property Name`
- Open export menu
- Open row action menu
- Pagination state

Expected result:
- Search narrows rows
- Sort reorders rows
- Export menu opens
- Row menu opens
- Pagination label stays consistent

Actual result:
- Search reduced the grid from `1–2 of 2` to `1–1 of 1`
- Sorting reordered the visible rows from `Embassy Gardens, Greenwood Apartments` to `Greenwood Apartments, Embassy Gardens`
- Export menu opened with `Download as CSV`
- Row menu opened with `View / Edit / Delete`
- Pagination label remained correct at `1–2 of 2`

Pass / Fail / Suspect:
- `PASS`

Relevant file/component if known:
- `src/ui/property/PropertyManageTable.js`

---

### Route tested
`/tenants`

Action tested:
- Quick search for `Joel`
- Open first row action menu
- Trigger `Enable Account`

Expected result:
- Search narrows rows
- Row menu opens
- Account action completes or fails gracefully with visible feedback

Actual result:
- Search reduced the grid from `1–10 of 10` to `1–1 of 1`
- Row menu opened with `View / Edit / Enable Account / Disable Account / Delete Account`
- Clicking `Enable Account` threw `Uncaught ReferenceError: users is not defined` in the browser console
- No success toast or error toast was shown after the action

Pass / Fail / Suspect:
- `FAIL`

Relevant file/component if known:
- `src/ui/tenant/TenantManageTable.js:50`
- `src/ui/tenant/TenantManageTable.js:91`
- `src/ui/tenant/TenantManageTable.js:177`

Notes:
- The handler references `users`, `setUsersData`, `setError`, and `toast`, but this component only receives tenant setters and imports `useTenants`.

---

### Route tested
`/users/manage`

Action tested:
- Quick search for `Main`

Expected result:
- The grid should match the visible `Joel Main` row by name

Actual result:
- The grid returned `We couldn't find any data` and `0–0 of 0` even though `Joel Main` was visible before filtering

Pass / Fail / Suspect:
- `FAIL`

Relevant file/component if known:
- `src/ui/user/UserManageTable.js:435`
- `src/ui/user/UserManageTable.js:449`

Notes:
- The quick-search predicate only checks `row.email`, so user names shown in the first column are not searchable.

---

### Route tested
`/finance`

Action tested:
- Quick search for `zzzz-not-found`
- Pagination next page
- Row action menu presence

Expected result:
- A non-matching quick search should reduce the row count to zero
- Pagination should move from page 1 to page 2
- A reusable row action menu should be available if this page follows the shared table pattern

Actual result:
- Entering `zzzz-not-found` left the grid unchanged at `1–7 of 10`; the same 7 rows stayed visible
- Pagination still advanced correctly to `8–10 of 10`
- No row action column/menu exists on this finance table

Pass / Fail / Suspect:
- `FAIL`

Relevant file/component if known:
- `src/ui/finance/FinanceTransactionListTable.js:127`
- `src/ui/finance/FinanceTransactionListTable.js:216`
- `src/ui/finance/FinanceTransactionListTable.js:231`

Notes:
- `handleFilter` updates `value`, but `filteredRows` ignores `value` entirely.
- The finance actions column is commented out, so this page currently breaks the cross-cutting row-action pattern instead of implementing it.

---

### Route tested
`/leases`

Action tested:
- Lease management table load
- Create Lease route availability
- Row action delete implementation review

Expected result:
- Representative lease list should support the same reusable row actions and visible feedback as other management tables

Actual result:
- The lease management grid loaded with `We couldn't find any data`, so runtime validation of sorting/pagination/row menus was blocked on this route
- `/leases/compose` does load correctly
- Code review shows `Delete Lease` only closes the menu and never performs a mutation or shows success/error feedback

Pass / Fail / Suspect:
- `FAIL`

Relevant file/component if known:
- `src/ui/lease/LeaseManageTable.js:44`
- `src/ui/lease/LeaseManageTable.js:88`

Notes:
- This is a clear implementation gap even if the current dataset is empty.

## Retest Targets
- Tenant account actions on `/tenants`
- User quick search on `/users/manage`
- Finance quick search on `/finance`
- Finance row action parity on `/finance`
- Lease delete feedback on `/leases`
