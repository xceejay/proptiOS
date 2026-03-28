# proptiOS QA Findings

> Historical snapshot. The active tracker is now [MASTER-EXECUTION-TRACKER.md](/home/joel/personal/projects/proptiOS/app.proptios.com/docs/product/MASTER-EXECUTION-TRACKER.md). Use this file as older evidence, not the live source of truth.

_Last updated: 2026-03-23_

## Environment
- Frontend: `http://localhost:3000`
- API: `http://localhost:2024`
- DB: local `proptios_db`
- Test user: `joel@example.com`

## Current Status
- Core routes smoke-tested
- Property detail subtabs smoke-tested
- Deep action testing started

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

### 2026-03-23

#### Property > Units
- Route: `/properties/manage/1/units`
- Page render: **PASS**
- Add Unit drawer: **PASS**
- Create unit: **PASS**
  - Created record: `QA Unit 2026-03-23`
  - Appeared in the units table as a new row (`id 13`)
- Row action menu: **PASS**
- Manage/Edit drawer open: **PASS**
- Edit submit: **SUSPECT**
  - After clicking `Edit Unit`, the drawer remained open instead of clearly closing or showing success/error feedback
  - Needs code/API verification
- Available row actions observed:
  - `Manage`
  - `Quick Suspend`
- Delete action: **NOT FOUND YET**

## Open Investigations
- Property units edit submission behavior
- Property units suspend behavior
- Search/sort/filter behavior across tables
- Property tenants action flows
- Property leases action flows
- Property maintenance action flows
- Finance mutation flows
- User mutation flows
