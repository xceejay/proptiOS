# QA Findings — Tenants + Leases

## Environment
- Frontend tested on `http://localhost:3001` because `3000` was already occupied in this session.
- API available on `http://localhost:2024`.
- Authenticated with `joel@example.com`.
- Scope limited to `/tenants`, tenant detail/manage flows, `/leases`, and lease detail/manage flows.

## Evidence Log

| Route tested | Action tested | Expected result | Actual result | Status | Relevant file / component |
| --- | --- | --- | --- | --- | --- |
| `/tenants/` | Load management page after auth | Tenant management page should render tabs, toolbar, and populated grid without crashing | Page rendered successfully with Overview/Management tabs, quick-search input, status filter, Add Tenant button, and 10 tenant rows visible in the grid | Pass | `src/pages/tenants/index.js`, `src/ui/tenant/ParentTenantViewRight.js`, `src/ui/tenant/TenantManageTable.js` |
| `/tenants/manage/1/` | Open tenant detail route directly | Tenant detail page should render with a selected tab and visible content | Detail page loaded correctly; Summary tab was selected and the Summary panel content was visible | Pass | `src/pages/tenants/manage/[id]/index.js`, `src/ui/tenant/TenantViewRight.js` |
| `/tenants/manage/1/transactions/` | Open tenant name/View target from `/tenants` | The route reached from the tenant list should show a usable detail panel | Route loaded the tenant shell, but no tab was selected and all tab panels were hidden. Body text stopped after the tab labels with no panel content. This makes the tenant-name link and row-menu View action effectively broken | Fail | `src/ui/tenant/TenantManageTable.js`, `src/pages/tenants/manage/[id]/[tab].js`, `src/ui/tenant/TenantViewRight.js` |
| `/tenants/` | Row action: `Enable Account` / `Disable Account` | Action should call the tenant account API, show feedback, and update the row state | The handlers are wired to undefined symbols: `users`, `toast`, `setUsersData`, and `setError`. Clicking either action will throw before any successful mutation path can complete | Fail | `src/ui/tenant/TenantManageTable.js:50-129` |
| `/tenants/` | Row action: `Delete Account` | Action should confirm and delete/archive/suspend the tenant, or at minimum show feedback that deletion is unavailable | `handleDelete` only closes the menu. No API call, no confirmation, no toast, no grid update | Fail | `src/ui/tenant/TenantManageTable.js:132-133` |
| `/tenants/` | Tenant name link target | Tenant name link should point to a working tenant detail/manage route | Tenant names link to `/tenants/manage/:id/transactions`, which is the broken empty-panel route above rather than the working summary detail route | Fail | `src/ui/tenant/TenantManageTable.js:217-220` |
| `/tenants/` | Edit drawer submit path | Editing a tenant from the list should submit safely for rows loaded in the grid | The submit handler unconditionally dereferences `tenantData.unit.id` and `tenantData.property.id`. The list rows do not guarantee a `unit` object, so this path is fragile and can throw on submit for tenants without `unit` in the row payload | Suspect | `src/ui/tenant/EditTenantDrawer.js:182-186` |
| `/leases/` | Lease row action menu: `Delete Lease` | Delete should archive/delete the lease or clearly reject the action with feedback | `handleDelete` only closes the menu. No API call, no confirmation, no toast, no grid refresh | Fail | `src/ui/lease/LeaseManageTable.js:44-46` |
| `/leases/` | Lease management filter availability | If filters are available, users should be able to filter leases from the toolbar | The shared toolbar supports filter UI, but the lease table passes an empty `statuses` array, so no status filter is rendered on `/leases` | Suspect | `src/ui/lease/LeaseManageTable.js:239-241`, `src/views/table/data-grid/CustomLeaseToolbar.js` |
| `/leases/` | Lease detail/manage affordances in row menu | Where edit/manage is available, row actions should expose it consistently | Lease row menu only exposes `View Lease` and a no-op `Delete Lease`. Edit/manage is commented out entirely, so there is no working mutation path from the management table | Fail | `src/ui/lease/LeaseManageTable.js:73-100` |

## Notes
- The broken tenant subroute is the highest-impact regression in this area because both the tenant-name link and the row-menu `View` action route users into an empty-content page.
- I did not make any code changes during this QA pass.
