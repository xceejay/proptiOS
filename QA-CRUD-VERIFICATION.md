# proptiOS CRUD Verification Matrix

_Last updated: 2026-03-24_

## Status Legend
- ✅ Pass — explicitly tested and passed
- ❌ Fail — explicitly tested and failed
- ⚠️ Suspect — not fully executed end-to-end, but code/runtime evidence strongly suggests a bug
- ⏳ Not tested — not yet verified
- N/A — not applicable for that page/section

## Test Environment
- Frontend: `http://localhost:3000` (some agent runs hit `3001`/`3002` when ports were occupied)
- API: `http://localhost:2024`
- DB: local `proptios_db`
- User: `joel@example.com`

## 2026-03-24 slice note
- This pass focused only on the remaining property/tenant/lease items called out in the QA request.
- Frontend changes made in this pass: tenant links now route to the working summary/transactions shell, tenant delete is wired on the list page, the property "Add Existing Tenant" drawer now submits a real selected tenant through the edit/attach path, lease row actions now expose `Edit Lease`, the lease create CTA now targets `/leases/create`, the maintenance manage drawer now shows an explicit backend blocker instead of posting to the wrong endpoint, and the standalone lease edit page now exposes an explicit product-stub warning instead of the invoice-editor stub.
- `pnpm test` passed (`17 passed`, `1 skipped`); `pnpm lint` completed with the repo's existing warning backlog and no new errors.
- Full browser re-retest for this slice could not be completed in this environment: `pnpm dev` could not bind a local port (`listen EPERM`) and OpenClaw browser control could not be restarted because the local gateway at `ws://127.0.0.1:18789` was closed (`1006`). Existing browser notes from 2026-03-23 remain the last successful live-browser verification unless explicitly updated below.

---

# 1. Dashboard

## Route
- `/dashboard`

## Browser flow
1. Log in
2. Open `/dashboard`
3. Verify summary cards and charts render
4. Check for clickable widgets/cards
5. Record any navigation or filter behavior

## Verification matrix
| Area | Create | Read/View | Update/Edit | Delete/Archive/Suspend | Search | Sort | Filter | Notes |
|---|---|---|---|---|---|---|---|---|
| Dashboard main | N/A | ✅ | N/A | N/A | N/A | N/A | N/A | Route renders; no deep widget interaction audit yet |

---

# 2. Properties

## 2.1 Properties list
### Route
- `/properties`

### Browser flow
1. Open `/properties`
2. Use quick search with a matching term (`Embassy`)
3. Use quick search with a non-matching term
4. Sort by `Property Name`
5. Open export menu
6. Open row action menu
7. Click row / property name to enter property manage view
8. Test Add Property / Edit / Delete when doing a full CRUD pass

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Search | Sort | Filter | Export | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Properties list | ⚠️ | ✅ | ⏳ | ⏳ | ✅ | ✅ | ⏳ | ✅ | No additional browser retest was possible on 2026-03-24 because local/browser runtime was unavailable; code inspection still shows the earlier `toast is not defined` delete bug remains fixed, while Add Property is still subscription-blocked (`Property limit exceeded for the 'standard' subscription tier. Maximum allowed: 2`) |

## 2.2 Property manage shell
### Route pattern
- `/properties/manage/<id>/<tab>`

### Browser flow
1. Open a known property from `/properties`
2. Confirm property header renders
3. Click tabs: Overview, Tenants, Units, Leases, Maintenance, Marketing, Settings
4. Record route-level failures before testing any sub-actions

### Verification matrix
| Subsection | Route load | Notes |
|---|---|---|
| Overview | ✅ | `/properties/manage/1/overview` now renders property header/cards again |
| Tenants | ✅ | `/properties/manage/1/tenants` renders tenant table and actions |
| Units | ✅ | `/properties/manage/1/units` renders unit table and Add Unit CTA |
| Leases | ✅ | `/properties/manage/1/leases` renders lease shell/create CTA |
| Maintenance | ✅ | `/properties/manage/1/maintenance` now renders the maintenance grid with 1 row and Add Maintenance Request CTA; no Next overlay crash during retest |
| Marketing | ⏳ | Not re-opened in this pass; earlier note still suggests placeholder-only |
| Settings | ✅ | `/properties/manage/1/settings` renders populated fields and save is functional again in browser (`PUT /properties` returned `200`) |

## 2.3 Property > Overview
### Browser flow
1. Open `/properties/manage/1/overview`
2. Confirm summary cards render
3. Check for duplicate cards or wrong hardcoded values
4. Test any CTA buttons if visible

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Search | Sort | Filter | Notes |
|---|---|---|---|---|---|---|---|---|
| Overview summary | N/A | ✅ | N/A | N/A | N/A | N/A | N/A | Retest confirmed only one stats block renders and the counts now match the live property payload for `/properties/1/all` (`3 units`, `0 applicants`, `1 request`, `9 tenants`); the header's `0 Leases` also matches `leases: []` from the backend response |

## 2.4 Property > Units
### Browser flow
1. Open `/properties/manage/1/units`
2. Click `Add Unit`
3. Fill minimal valid data and submit
4. Confirm new row appears
5. Use quick search on created unit name
6. Open row action menu on the created row
7. Click `Manage`
8. Change one field and submit
9. Check for success/error feedback and drawer close behavior
10. Test `Quick Suspend`
11. Check whether any delete action exists

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Suspend | Search | Sort | Filter | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Units tab | ✅ | ✅ | ⚠️ | ⏳ / not found | ❌ / backend-blocked | ⏳ | ⏳ | ⏳ | Frontend unit edit flow was repaired in code on 2026-03-24 so submit now surfaces `Failed to update unit` correctly and refreshes property data after success; Quick Suspend remains explicitly disabled because no unit suspend/delete path is wired here; browser retest was blocked by local runtime issues |

## 2.5 Property > Tenants
### Browser flow
1. Open `/properties/manage/1/tenants`
2. Test `Add Tenant`
3. Test `Add Existing Tenant` if present
4. Use quick search and status filter if present
5. Open row action menu
6. Test edit/manage
7. Test suspend/delete if present
8. Verify table refreshes after mutations

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Suspend | Search | Sort | Filter | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Property tenants tab | ⚠️ | ✅ | ⚠️ | ⏳ | ❌ / backend-blocked | ⏳ | ⏳ | ⏳ | Frontend now routes tenant links to the working summary/transactions shell, and `Add Existing Tenant` was rewired to select a real tenant object and call the tenant edit/attach path instead of the broken create flow; Quick Suspend is now explicitly disabled because no property-tenant suspend mutation is wired; browser retest was blocked on 2026-03-24 |

## 2.6 Property > Leases
### Browser flow
1. Open `/properties/manage/1/leases`
2. Use quick search
3. Open row action menu
4. Test `View Lease`
5. Test delete if present
6. Check whether edit/manage exists

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Archive | Search | Sort | Filter | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Property leases tab | ⚠️ | ✅ | ⚠️ | ❌ / backend-blocked | ⏳ | ⚠️ | ⏳ | ⚠️ | Frontend now exposes `Edit Lease` row actions and fixes tenant links plus status-filter option generation in code; delete remains explicitly disabled because no lease delete mutation is wired in this frontend/context; browser retest was blocked on 2026-03-24 |

## 2.7 Property > Maintenance
### Browser flow
1. Open `/properties/manage/1/maintenance`
2. Click `Add Maintenance Request`
3. Submit minimal valid request without media
4. Confirm row appears
5. Use quick search
6. Open row menu and click `Manage`
7. Try edit/status flow
8. Test suspend/delete if available

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Suspend | Search | Sort | Filter | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Property maintenance tab | ✅ (API) | ✅ | ❌ / backend-blocked | ⏳ | ❌ / backend-blocked | ⚠️ | ⏳ | ⏳ | The maintenance manage drawer is now explicitly view-only in code because its old submit path incorrectly posted to the unit update endpoint; Quick Suspend is also disabled explicitly; create/search still need browser revalidation once runtime access is restored |

## 2.8 Property > Marketing
### Browser flow
1. Open `/properties/manage/1/marketing`
2. Check for any real controls, forms, or data grids
3. Record whether it is placeholder-only

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Search | Sort | Filter | Notes |
|---|---|---|---|---|---|---|---|---|
| Property marketing tab | N/A | ⚠️ | N/A | N/A | N/A | N/A | N/A | Route loads; confirmed placeholder-only — just the heading "Marketing" with no form, grid, or controls |

## 2.9 Property > Settings
### Browser flow
1. Open `/properties/manage/1/settings`
2. Confirm fields populate
3. Change one low-risk value
4. Save
5. Record visible success/error feedback

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Search | Sort | Filter | Notes |
|---|---|---|---|---|---|---|---|---|
| Property settings | N/A | ✅ | ✅ | N/A | N/A | N/A | N/A | Browser retest confirmed dirty state enables Save and submit succeeds; changing Property Name triggered `PUT /properties` `200` and surfaced `Property updated successfully` toast |

---

# 3. Tenants

## 3.1 Tenants list
### Route
- `/tenants`

### Browser flow
1. Open `/tenants`
2. Verify rows render
3. Use quick search with matching and non-matching terms
4. Use status filter
5. Open row action menu
6. Test tenant-name link
7. Test `View`, `Edit`, `Enable Account`, `Disable Account`, `Delete Account`

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Suspend/Enable/Disable | Search | Sort | Filter | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Tenants list | ⏳ | ✅ | ⚠️ | ⚠️ | ❌ / backend-blocked | ✅ | ⏳ | ✅ | Frontend now routes row clicks/View to `/tenants/manage/:id/summary`, wires delete to `tenants.deleteTenants`, and disables Enable/Disable with explicit unavailable labels when those handlers are absent from the tenant context; browser retest was blocked on 2026-03-24 |

## 3.2 Tenant detail
### Route pattern
- `/tenants/manage/<id>/`
- `/tenants/manage/<id>/<tab>`

### Browser flow
1. Open `/tenants/manage/1/`
2. Confirm Summary tab content loads
3. Open any tab links you find in-app
4. Test routes reached from tenant-name links and row-menu View

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Search | Sort | Filter | Notes |
|---|---|---|---|---|---|---|---|---|
| Tenant detail summary | N/A | ✅ | ⏳ | N/A | N/A | N/A | N/A | Summary route works |
| Tenant detail transactions route | N/A | ⚠️ | N/A | N/A | N/A | N/A | N/A | Frontend route was repaired in code on 2026-03-24: the tenant right panel now includes a real `transactions` tab and renders `tenantData.transactions || []` with an explicit info state instead of the previous broken empty shell; browser retest remains blocked by local runtime/browser availability |

---

# 4. Leases

## 4.1 Leases list
### Route
- `/leases`

### Browser flow
1. Open `/leases`
2. Verify grid or empty state
3. Use quick search if rows exist
4. Open row action menu
5. Test `View Lease`
6. Test delete
7. Note whether edit/manage is present

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Archive | Search | Sort | Filter | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Leases list | ⏳ | ⚠️ | ⚠️ | ❌ / backend-blocked | ⏳ | ⚠️ | ⏳ | ⚠️ | Frontend now routes tenant links to the real tenant summary page, restores `Edit Lease` row actions, sends Create Lease to `/leases/create`, and populates status filter options from live lease rows in code; delete remains explicitly disabled because no delete mutation is exposed by the leases context; browser retest was blocked on 2026-03-24 |

## 4.2 Lease create/edit/view routes
### Browser flow
1. Open `/leases/create`
2. Confirm compose/editor shell loads
3. Open `/leases/view/<id>` for a known row if possible
4. Open `/leases/edit/<id>` if route is linked or known

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Notes |
|---|---|---|---|---|---|
| Lease create page | ⚠️ | ✅ | N/A | N/A | Create page/shell still exists, but this pass could not browser-retest the submit flow because local runtime/browser access was unavailable |
| Lease view page | ⏳ | ⚠️ | N/A | N/A | Route code still fetches a live lease id and renders the preview shell, but this pass could not browser-retest against a live lease id |
| Lease edit page | N/A | ⚠️ | ❌ / product-stubbed | N/A | The old standalone edit route was loading an invoice-editor stub; on 2026-03-24 it was replaced with an explicit warning page that loads the live lease id and documents that dedicated lease editing is not wired yet |

---

# 5. Finance

## 5.1 Finance payments
### Route
- `/finance/payments`

### Browser flow
1. Open `/finance/payments`
2. Verify rows render
3. Use quick search with matching and non-matching terms
4. Change pagination page
5. Check whether row actions exist
6. Open first receipt/invoice link if available

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Search | Sort | Filter | Pagination | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Finance payments | N/A | ✅ | N/A / not exposed | N/A / not exposed | ✅ | ⚠️ | ✅ | ✅ | Browser retest confirmed quick search now filters in-browser (`zzznomatch` produced `0–0 of 0`); Status filter still works; sortable column affordances are present, but no deep sort-order verification was done; no row action buttons; UUID links open rendered receipt pages |

## 5.2 Finance expenses
### Route
- `/finance/expenses`

### Browser flow
1. Open `/finance/expenses`
2. Check if rows load or empty state appears
3. Compare with finance data availability elsewhere
4. Test any create actions if present

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Search | Sort | Filter | Notes |
|---|---|---|---|---|---|---|---|---|
| Finance expenses | N/A | ✅ | N/A | N/A | N/A / no rows | N/A / no rows | N/A / no rows | Browser retest shows a clean empty state instead of a broken table; `/dashboard` currently returns `transactions.expenses: []`, so the route is data-empty rather than frontend-crashed |

## 5.3 Finance statements
### Route
- `/finance/statements`

### Browser flow
1. Open `/finance/statements`
2. Check for data grid / empty state
3. Record server error banners or contradictions

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Search | Sort | Filter | Notes |
|---|---|---|---|---|---|---|---|---|
| Finance statements | N/A | ❌ | N/A | N/A | N/A / blocked | N/A / blocked | N/A / blocked | Browser retest still fails on backend `GET /transactions -> 500`; frontend now renders the explicit `Server Error: Failed to calculate accounting data` banner and empty-state table instead of a silent failure |

## 5.4 Finance invoice / receipt detail flows
### Browser flow
1. From `/finance/payments`, open first linked receipt/invoice
2. Also open `/finance/invoice/create`
3. Confirm create UI loads
4. For receipt/invoice view pages, confirm detail body actually renders

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Notes |
|---|---|---|---|---|---|
| Invoice create | ❌ / backend blocked | ✅ | N/A | N/A | Frontend now makes the blocker explicit instead of exposing a dead-end submit path: `/finance/invoice/create` shows a warning that no create/send invoice API is wired yet and disables `Send` / `Save`; this was verified by source/test in this pass, but not re-browser-verified because the local browser automation stack became unavailable mid-run |
| Receipt detail | N/A | ✅ | N/A | N/A | Browser retest against `/finance/receipt/view/bb2c7290-b6e5-48ae-b590-f66707d7d3bf` now renders correct live transaction data (`#57`, `John Doe`, `Embassy Gardens`, `700 GHS`, `Total Paid: $700`) instead of `$undefined` or placeholder tenant content |

## 5.5 Finance settlement
### Route
- `/finance/settlement`

### Browser flow
1. Open `/finance/settlement`
2. Confirm summary and controls render
3. Test `CHANGE FREQUENCY`
4. Test save/update when doing deep mutation pass

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Search | Sort | Filter | Notes |
|---|---|---|---|---|---|---|---|---|
| Finance settlement | N/A | ✅ | ✅ | N/A | N/A | N/A | N/A | `Change Frequency` opens Save/Cancel flow and Save fires; console logs `Saving settlement frequency: daily`; no visible success toast, but update path is wired |

## 5.6 Finance reports
### Route
- `/finance/reports`

### Browser flow
1. Open `/finance/reports`
2. Confirm report cards render
3. Test any export/download actions if present

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Export | Notes |
|---|---|---|---|---|---|---|
| Finance reports | N/A | ✅ | N/A | N/A | ✅ | Report cards render; clicking a report opens a dialog/overlay, so export/report-launch flow is at least wired from the card grid |

---

# 6. Users

## 6.1 Users manage
### Route
- `/users/manage`

### Browser flow
1. Open `/users/manage`
2. Verify rows render
3. Use quick search for visible name and visible email
4. Open row action menu
5. Test detail link
6. Test Edit / Enable / Disable / Delete if visible

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Suspend/Enable/Disable | Search | Sort | Filter | Notes |
|---|---|---|---|---|---|---|---|---|---|
| Users manage | N/A | ✅ | ✅ | ❌ / not visible | ✅ | ✅ | ⚠️ | ✅ | Browser retest confirmed quick search now filters in-browser (`zzznomatch` -> `0–0 of 0`, `joel@example.com` -> `1–1 of 1`); Account Status filter works; sortable column affordances are present, but no deep sort-order verification was done; row menu exposes View/Edit/Enable/Disable but no Delete option; Edit drawer opens populated |

## 6.2 User detail
### Route pattern
- `/users/manage/<id>/<tab>`

### Browser flow
1. Open detail link from Manage Users
2. Confirm detail body loads
3. Test default tab and any subtab selection

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Notes |
|---|---|---|---|---|---|
| User detail route | N/A | ⚠️ | ⚠️ | N/A | Browser retest confirms the route still hits backend `GET /users/:id` failure and shows `Server Error: Failed to fetch user`, but it no longer hangs on `Loading...`; `/users/manage/1/transactions` now renders an explicit transactions error state, and `/users/manage/1/security` remains usable/rendered despite the failed fetch |

## 6.3 Users invite
### Route
- `/users/invite`

### Browser flow
1. Open `/users/invite`
2. Confirm invite form loads
3. Submission intentionally skipped in local QA because outbound email is not wired yet; invites are currently handled via manual DB updates

### Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Notes |
|---|---|---|---|---|---|
| Users invite | N/A / skipped | ✅ | N/A | N/A | Form renders; create/submit intentionally skipped because outbound email is not wired yet and invite handling is currently manual DB work |

---

# 7. Communication

## Route
- `/communication`

## Browser flow
1. Open `/communication`
2. Verify issues/comments/messages list renders
3. Test search/filter if present
4. Test add/create/comment/update actions if present
5. Test row/menu actions if present

## Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Search | Sort | Filter | Notes |
|---|---|---|---|---|---|---|---|---|
| Communication main | ✅ | ✅ | ✅ | ❌ / not exposed | N/A / not present | N/A / not present | N/A / not present | Browser retest confirmed end-to-end issue creation now works: opening `Create new Issue`, submitting title/description, and seeing the new issue appear in the list immediately (`QA hallway lighting issue`) |

---

# 8. Global Settings

## Route
- `/settings`

## Browser flow
1. Open `/settings`
2. Confirm tabs/sections render
3. Change one low-risk value
4. Save and record feedback
5. Check whether changes persist on refresh

## Verification matrix
| Area | Create | Read/View | Update/Edit | Delete | Search | Sort | Filter | Notes |
|---|---|---|---|---|---|---|---|---|
| Global settings | N/A | ✅ | ❌ / backend blocked | N/A | N/A | N/A | N/A | Browser retest confirms the runtime crash is gone and both settings tabs now surface an explicit blocker instead of sending the wrong request: the old broken `/users` save path has been removed because no site/account settings update endpoint is wired in this frontend; Save is intentionally disabled until the backend contract exists |

---

# 9. Cross-Cutting Table Behavior

## Browser flow
For each management page with a grid:
1. Search with matching term
2. Search with nonsense term
3. Sort obvious text column
4. Change pagination page
5. Open export menu/button
6. Open row action menu
7. Trigger one mutation and check visible success/error feedback

## Cross-cutting matrix
| Page | Search | Sort | Pagination | Export | Row Menu | Feedback after action | Notes |
|---|---|---|---|---|---|---|---|
| Properties | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ | Strongest verified table behavior so far |
| Tenants | ✅ | ⏳ | ⏳ | ⏳ | ✅ | ❌ | Account actions crash before feedback |
| Leases | ⚠️ | ⏳ | ⏳ | ⏳ | ✅ | ❌ | Delete is stub/no-op |
| Finance payments | ✅ | ⚠️ | ✅ | ✅ | ❌ | ✅ | Search now works for both match and nonsense terms; Status filter + pagination work; sortable column affordances are present but not deeply verified; no row action menu parity; row UUID links now open fully populated receipt pages |
| Users manage | ✅ | ⚠️ | N/A / single page | ✅ | ✅ | ⏳ | Quick search now works for both match and nonsense terms; sortable column affordances are present but not deeply verified; only one page of data so pagination cannot really be exercised; Account Status filter works; Edit drawer opens; no Delete option exposed in row menu |

---

# 10. Next-pass priorities
1. Fix users detail API failure (`GET /users/:id` → 500) and name-based search in Manage Users
2. Fix finance quick search and blank receipt detail page
3. Fix finance expenses/statements data sources (`transaction data undefined`, `GET /transactions` → 500)
4. Fix property overview duplicated/hardcoded stats, property delete `toast is not defined` bug (`src/ui/property/PropertyManageTable.js`), and maintenance tab crash
5. Fix communication issue creation flow (`Create new Issue` currently no-ops)
6. Fix global settings save path (`users.editUser is not a function`)
7. Retest remaining sort/export affordances after the above blockers are fixed
