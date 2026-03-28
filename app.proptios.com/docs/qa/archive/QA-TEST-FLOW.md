# proptiOS QA Test Flow

> Historical QA playbook. The active execution tracker is now [MASTER-EXECUTION-TRACKER.md](/home/joel/personal/projects/proptiOS/app.proptios.com/docs/product/MASTER-EXECUTION-TRACKER.md). Keep this as supporting reference, not the primary status document.

## Purpose
Reusable QA playbook for retesting the proptiOS frontend locally without rediscovering the system each session.

## Environment
- Frontend: `http://localhost:3000`
- API: `http://localhost:2024`
- DB: local `proptios_db`
- Test user: `joel@example.com`

## Boot Checklist
1. Start local MariaDB
2. Start API on `localhost:2024`
3. Start frontend on `localhost:3000`
4. Log in with the test user
5. Confirm local stack is used before mutation testing

## Standard QA Sequence
For each module/page:
1. Verify route loads without crash
2. Verify tabs/subtabs switch correctly
3. Verify table/list renders rows
4. Test quick search
5. Test sorting on at least one sortable column
6. Test row action menu opens
7. Test create flow
8. Test edit/manage flow
9. Test delete/suspend/archive flow if available
10. Verify success/error feedback is visible
11. Verify table/list reflects the mutation
12. Record exact page/component owner if bug is found

## Mutation Naming Convention
Use obvious QA-created records so cleanup is easy:
- `QA <entity> YYYY-MM-DD`
- Example: `QA Unit 2026-03-23`

## Evidence Format
For every test performed, capture:
- Route tested
- Action tested
- Expected result
- Actual result
- Pass / Fail / Suspect
- Relevant file/component if known

## Module Order
1. Dashboard
2. Properties list
3. Property manage tabs
   - Overview
   - Tenants
   - Units
   - Leases
   - Maintenance
   - Marketing
   - Settings
4. Tenants
5. Leases
6. Finance
7. Users
8. Communication
9. Global settings

## Property Manage Deep Test Checklist
### Overview
- Loads without null crash
- Summary cards render
- Any overview actions open correctly

### Units
- Add Unit drawer opens
- Create unit works
- Search works
- Row menu works
- Edit/manage works
- Delete/suspend path verified if available

### Tenants
- Add tenant drawer/button works
- Search/filter works
- Row actions work
- Edit/delete/suspend verified if available

### Leases
- Add/create lease flow opens
- Search/filter works
- Row actions work
- Archive/delete/edit paths verified if available

### Maintenance
- Add maintenance request works
- Search/filter works
- Row actions work
- Edit/status/delete verified if available

### Settings
- Form loads with existing values
- Save action works
- Validation/errors visible

## Browser Navigation Flow
Use this when re-running UI tests so you do not need to rediscover where things are.

### Login / Session Boot
1. Open `http://localhost:3000/login`
2. Log in as `joel@example.com`
3. Wait for dashboard shell to load
4. If redirected strangely, go directly to the target route after login

### Properties list
- Route: `/properties`
- Expected visible controls:
  - quick search
  - export button
  - row action menu
  - add property button
- Browser steps:
  1. Open `/properties`
  2. Use quick search input in the grid toolbar
  3. Click a row menu (three dots)
  4. Click property name or row to enter detail/manage

### Property detail / manage shell
- Canonical working route pattern: `/properties/manage/<id>/<tab>`
- Main tabs to test:
  - `overview`
  - `tenants`
  - `units`
  - `leases`
  - `maintenance`
  - `marketing`
  - `settings`
- Browser steps:
  1. From `/properties`, open a known property row
  2. Confirm property header renders
  3. Click each visible top tab one by one
  4. Record whether route loads, crashes, or renders partial shell only

### Property > Units flow
1. Open `/properties/manage/1/units`
2. Click `Add Unit`
3. Fill the unit drawer
4. Submit
5. Confirm new row appears in the table
6. Open row action menu on the created row
7. Click `Manage`
8. Edit one field and submit
9. Record whether drawer closes and whether success/error feedback appears
10. Check whether `Quick Suspend` exists and whether there is any delete path

### Property > Tenants flow
1. Open `/properties/manage/1/tenants`
2. Check for `Add Tenant` / `Add Existing Tenant`
3. Use quick search
4. Open a tenant row action menu
5. Test `Edit` / suspend / delete if present
6. Record whether create/edit routes mutate data or fail at API level

### Property > Leases flow
1. Open `/properties/manage/1/leases`
2. Use quick search
3. Open row action menu
4. Test `View Lease`
5. Test delete if present
6. Note whether edit/manage exists or is only commented/stubbed behavior

### Property > Maintenance flow
1. Open `/properties/manage/1/maintenance`
2. Click `Add Maintenance Request`
3. Test create with minimal valid data
4. Use quick search
5. Open row action menu and test `Manage`
6. Record whether status/edit/delete/suspend paths are wired correctly

### Property > Settings flow
1. Open `/properties/manage/1/settings`
2. Confirm fields load existing property values
3. Change one low-risk field
4. Submit save
5. Record success/error feedback

### Tenants list flow
1. Open `/tenants`
2. Confirm grid renders rows
3. Use quick search
4. Use status filter if visible
5. Open row action menu
6. Test tenant-name link
7. Test `View`, `Edit`, `Enable Account`, `Disable Account`, `Delete Account`
8. Record whether each action mutates, errors, or no-ops

### Tenant detail flow
1. Open `/tenants/manage/1/`
2. Confirm a valid tab is selected (`summary` expected)
3. Switch tabs if visible
4. Record if invalid routes like `/transactions` produce empty shells

### Leases flow
1. Open `/leases`
2. Confirm grid or empty state renders
3. Use quick search if rows exist
4. Open row action menu
5. Test `View Lease`
6. Test delete action
7. Open `/leases/create`
8. Open `/leases/edit/<id>` or `/leases/view/<id>` for any known id if available

### Finance flow
1. Open `/finance`
2. Test `payments`, `expenses`, `settlement`, `statements`, `reports`
3. On payments:
   - use quick search
   - test pagination
   - note whether row actions exist
4. Open first receipt/invoice link from payments if available
5. Open `/finance/invoice/create`
6. Record whether create UI loads and whether detail routes show real content or blank shells

### Users flow
1. Open `/users/manage`
2. Confirm grid renders rows
3. Use quick search against both visible name and email
4. Open row action menu
5. Test `Edit`, `Enable Account`, `Disable Account`, delete/suspend if present
6. Click a user name/detail link if present and record whether detail route loads or stalls
7. Open `/users/invite`
8. Do not submit external invite emails unless explicitly approved

### Cross-cutting table checks
Run these on each major management page where possible:
1. Quick search with a term that should match
2. Quick search with a nonsense term that should produce zero rows
3. Sort one obvious text column
4. Change page / pagination
5. Open export menu/button
6. Open row action menu
7. Perform one mutation and check for visible success/error feedback

## What the agents actually covered on 2026-03-23
### Property-manage agent
Confirmed it tested and/or inspected:
- all seven property manage tab routes
- route-load failures on property-manage pages
- tenant create API path
- tenant edit email path
- unit create + unit edit API path
- maintenance create/manage wiring
- maintenance search logic
- overview stat rendering
- lease row actions/search wiring
- marketing placeholder state
- settings save API path

### Tenants + Leases agent
Confirmed it tested and/or inspected:
- `/tenants/` load
- `/tenants/manage/1/` load
- `/tenants/manage/1/transactions/` broken target route
- tenant row action handlers
- tenant name link target
- tenant edit drawer submit assumptions
- lease row delete behavior
- lease filter availability
- lease row action completeness

### Finance + Users agent
Confirmed it tested and/or inspected:
- `/finance/payments`
- finance quick search on payments
- `/finance/expenses`
- `/finance/statements`
- receipt detail route from finance payments
- `/finance/invoice/create`
- `/finance/settlement`
- `/finance/reports`
- `/users/manage`
- user quick search by visible name
- `/users/manage/:id/transactions`
- `/users/invite` (submission intentionally not executed)

### Cross-cutting agent
Confirmed it tested and/or inspected:
- properties table search / sort / export / row menu / pagination
- tenants table search / row menu / broken account actions
- users manage quick search
- finance table search / pagination / row-action parity
- lease table delete feedback gap

## Retest Rule
If a bug was previously found, retest the exact route and action first before exploring deeper.
