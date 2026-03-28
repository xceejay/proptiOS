# proptiOS Frontend QA Audit

_Last updated: 2026-03-23_

## Purpose
This document tracks deep runtime testing of the proptiOS frontend against the local API and local MySQL copy.

## Environment
- Frontend: `http://localhost:3000`
- API: `http://localhost:2024`
- DB: local `proptios_db`
- Test user: `joel@example.com`

## Audit Status
- [x] Core routes smoke-tested
- [x] Property detail sub-tabs smoke-tested
- [ ] Property create/edit/delete/search/filter flows
- [ ] Tenant create/edit/delete/search/filter flows
- [ ] Lease create/edit/archive/delete/search/filter flows
- [ ] Finance create/edit/delete/search/filter flows
- [ ] User create/edit/delete/search/filter flows
- [ ] Communication actions
- [ ] Settings save flows
- [ ] Error handling audit

## Reusable Test Flow

Use this section as the default retest checklist in future sessions.

### Environment boot
1. Start local MariaDB
2. Start API on `localhost:2024`
3. Start frontend on `localhost:3000`
4. Log in with `joel@example.com`
5. Use local DB only for mutation tests

### For each page/module
1. Verify route loads without crash
2. Verify tabs/subtabs switch correctly
3. Verify table renders rows
4. Test quick search
5. Test sort on at least one sortable column
6. Test row action menu opens
7. Test create flow
8. Test edit/manage flow
9. Test delete/suspend/archive flow if present
10. Verify success/error feedback is visible
11. Verify table reflects the mutation
12. Record exact file/component owner if a bug is found

### Mutation test naming
Use obvious QA-created names so they are easy to find and clean up:
- `QA <entity> YYYY-MM-DD`
- Example: `QA Unit 2026-03-23`

### Evidence to record for each test
- Route tested
- Action tested
- Expected result
- Actual result
- Pass / Fail / Suspect
- Relevant UI component or page file if known

## Findings

### Confirmed working
- Dashboard renders
- Properties list renders
- Property overview renders
- Property units renders
- Property tenants renders
- Property leases renders
- Property maintenance renders
- Property settings renders
- Tenants renders
- Finance renders
- Users renders

### Open investigations
- Need deep CRUD/action testing inside property subtabs
- Need exact component/file mapping for each tested action

## Test Log

### 2026-03-23
- Started deep QA pass after stabilization work.
- **Property > Units**
  - Page renders.
  - `Add Unit` drawer opens.
  - Create flow tested with `QA Unit 2026-03-23` → appears in table as new row (`id 13`).
  - Row action menu opens; `Manage` opens edit drawer.
  - Edit submit appears problematic: after clicking `Edit Unit`, drawer remained open instead of clearly closing or showing success/error feedback. Needs code/API verification.
  - Available row actions observed: `Manage`, `Quick Suspend`. No obvious delete action in row menu.
