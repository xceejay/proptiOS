# Property Manage QA Findings

Date: 2026-03-23
Environment: local frontend `http://127.0.0.1:3000`, local API `http://127.0.0.1:2024`
Scope:
- `/properties/manage/[id]/overview`
- `/properties/manage/[id]/tenants`
- `/properties/manage/[id]/units`
- `/properties/manage/[id]/leases`
- `/properties/manage/[id]/maintenance`
- `/properties/manage/[id]/marketing`
- `/properties/manage/[id]/settings`

## Summary
- Blocking frontend issue: all seven property-manage routes return HTTP 500 in the current local stack.
- Confirmed backend/API regressions behind the blocked UI: tenant create fails, tenant email edit fails, unit edit fails.
- Confirmed backend passes behind the blocked UI: property settings save works, maintenance create works without media.
- Additional deterministic UI/code-path issues exist in overview, maintenance, leases, and marketing even if the route-level blocker is cleared.

## Findings

### 1. Property manage routes are fully blocked by a local frontend 500
- Route tested: `/properties/manage/1/overview`, `/tenants`, `/units`, `/leases`, `/maintenance`, `/marketing`, `/settings`
- Action tested: route load
- Expected result: each property-manage tab should render its page shell
- Actual result: every route returns HTTP 500. The rendered error payload reports `ENOENT: no such file or directory, open '/home/joel/personal/projects/proptiOS/app.proptios.com/.next/server/pages/properties/manage/[id]/[tab].js'`
- Status: Fail
- Relevant file/component if known: `/home/joel/personal/projects/proptiOS/app.proptios.com/src/pages/properties/manage/[id]/[tab].js`

### 2. Tenant create flow fails with server error
- Route tested: `/properties/manage/1/tenants`
- Action tested: create tenant via backing API `POST /tenants`
- Expected result: QA tenant should be created and returned in the API response
- Actual result: API returned `{"status":"FAILED","description":"Server Error: Failed to insert tenants"}`
- Status: Fail
- Relevant file/component if known: `/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/tenants.js:98`
- Notes: the create handler calls `uuid()` but this module does not import or define `uuid`, which explains the hard server failure.

### 3. Tenant manage/edit cannot change tenant email
- Route tested: `/properties/manage/1/tenants`
- Action tested: edit/manage tenant email via backing API `PUT /tenants`
- Expected result: editing an existing tenant should allow email changes
- Actual result:
  - Control test with unchanged email succeeded: `Successfully updated 1 tenant(s)`
  - Same payload with only the email changed failed: `Tenant with email joanadoe+changed@example.com not found`
- Status: Fail
- Relevant file/component if known: `/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/tenants.js:217`
- Notes: update matches rows with `WHERE email = ?` using the new email value, so any email change misses the existing row.

### 4. Unit create works, but unit manage/edit fails
- Route tested: `/properties/manage/1/units`
- Action tested:
  - create via backing API `POST /properties/units`
  - edit/manage via backing API `PUT /properties/units`
- Expected result:
  - create should add a unit
  - edit should persist updates for that unit
- Actual result:
  - create passed: `QA Unit API 2026-03-23` was created successfully as unit id `14`
  - edit failed with the same payload shape the manage drawer sends: `{"status":"FAILED","description":"Server Error: Failed to update units"}`
- Status: Fail
- Relevant file/component if known:
  - `/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/PropertyManageUnitDrawer.js:148`
  - `/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/properties.js:1274`
- Notes: likely payload/schema mismatch between the drawer and update query. The drawer does not supply some fields that the backend update path writes directly. This is an inference from the failing request plus the update query.

### 5. Maintenance manage action is wired to the wrong setter and wrong API method
- Route tested: `/properties/manage/1/maintenance`
- Action tested: manage/edit existing maintenance request
- Expected result: clicking Manage should edit a maintenance request and refresh maintenance rows
- Actual result:
  - the table passes `setPropertyData={propertyData}` instead of the setter function
  - the manage drawer submits through `properties.editUnits(...)` instead of a maintenance endpoint
  - after refresh it loads `propertyData.units` into maintenance state
- Status: Suspect
- Relevant file/component if known:
  - `/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/PropertyViewMaintenance.js:233`
  - `/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/PropertyManageMaintenanceRequestDrawer.js:133`
  - `/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/PropertyManageMaintenanceRequestDrawer.js:140`
  - `/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/PropertyManageMaintenanceRequestDrawer.js:166`
- Notes: this path is unreachable in the browser right now because the route is blocked, but the code wiring is deterministic and incorrect.

### 6. Maintenance add flow likely rejects valid no-media requests in the UI, even though the API accepts them
- Route tested: `/properties/manage/1/maintenance`
- Action tested:
  - create maintenance request without media via API
  - compare against drawer validation
- Expected result: no-media requests should be allowed if media is optional
- Actual result:
  - API passed: `POST /properties/maintenance-requests` succeeded with a request that had no `request_media`
  - drawer schema marks `request_media` as nullable, but both custom tests return falsy when `value` is null, so the UI will likely block submission without a file
- Status: Suspect
- Relevant file/component if known: `/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/PropertyAddMaintenanceRequestDrawer.js:73`
- Notes: the API result confirms the backend accepts this case; the UI validation looks stricter than the backend contract.

### 7. Maintenance quick search does not search the fields shown in the table
- Route tested: `/properties/manage/1/maintenance`
- Action tested: quick search
- Expected result: quick search should match visible fields like title, description, tenant, unit, assignee, requester
- Actual result: filter only checks `request_owner` and `media_type`, which are not the main visible searchable columns
- Status: Suspect
- Relevant file/component if known: `/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/PropertyViewMaintenance.js:253`

### 8. Overview shows incorrect hardcoded counts and duplicates the stat cards
- Route tested: `/properties/manage/1/overview`
- Action tested: overview summary render
- Expected result: counts should reflect live property data once loaded
- Actual result:
  - two separate stat groups are rendered with the same content
  - unit and applicant counts are hardcoded as `0 units` and `0 tenants`
- Status: Suspect
- Relevant file/component if known: `/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/PropertyViewOverview.js:88`

### 9. Lease row actions are incomplete and property-name search is wired to a missing field
- Route tested: `/properties/manage/1/leases`
- Action tested: quick search, row actions
- Expected result:
  - quick search should match tenant, property, or unit names
  - row actions should support the advertised action paths
- Actual result:
  - delete menu item only closes the menu and never calls an API
  - edit path is commented out
  - search checks `lease.property?.name`, but rows are built with `property_name`, so property-name search will never match
- Status: Suspect
- Relevant file/component if known:
  - `/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/PropertyLeaseTable.js:45`
  - `/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/PropertyLeaseTable.js:84`
  - `/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/PropertyLeaseTable.js:309`

### 10. Marketing tab is a placeholder with no manage functionality
- Route tested: `/properties/manage/1/marketing`
- Action tested: page load / action discovery
- Expected result: some marketing management UI or actions should exist if this tab is exposed
- Actual result: component renders an empty card body only; no search, sort, create, edit/manage, archive, or delete actions are implemented
- Status: Suspect
- Relevant file/component if known: `/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/PropertyViewMarketing.js:65`

## Confirmed Passes

### A. Property settings save API works with current property payload
- Route tested: `/properties/manage/1/settings`
- Action tested: save/update via backing API `PUT /properties`
- Expected result: property update endpoint should accept the current property payload
- Actual result: API returned `{"status":"SUCCESS","description":"Successfully updated 1 property(s)"...}`
- Status: Pass
- Relevant file/component if known:
  - `/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/PropertyVIewSettings.js`
  - `/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/properties.js`

### B. Maintenance create API works without media
- Route tested: `/properties/manage/1/maintenance`
- Action tested: create via backing API `POST /properties/maintenance-requests`
- Expected result: request should be inserted
- Actual result: API returned success and created `QA Maintenance 2026-03-23`
- Status: Pass
- Relevant file/component if known:
  - `/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/PropertyAddMaintenanceRequestDrawer.js`
  - `/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/properties.js:1361`

## Notes
- Because all `/properties/manage/[id]/*` routes are currently 500ing in the local frontend, browser-level verification of search/sort/drawer interactions was blocked at the route boundary. Where useful, I validated the backing API directly and then matched failures against the corresponding UI code paths.
