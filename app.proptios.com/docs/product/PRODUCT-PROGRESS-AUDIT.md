# Product Progress Audit

_Last updated: 2026-03-28_

This document maps the historical product notes to the current codebase state.

## Status legend

- `Implemented`: verified in current code
- `Partially Implemented`: some code exists, but behavior is incomplete or inconsistent
- `Superseded`: old idea replaced by a newer approach already visible in code
- `Not Implemented`: no meaningful implementation found in current code
- `Needs Clarification`: product rule is too ambiguous to truth-check safely from code alone

## Scope

This audit is based on current code in:
- `app.proptios.com`
- `api.pm.proptios.com`

It is not a full product guarantee.
It is a best-effort truth check against the current repository state.

---

## 1. Current Bugs and Recent UX Fixes

| Item | Status | Notes |
| --- | --- | --- |
| Onboarding submit before agreeing to terms should not leave loader stuck | Implemented | Fixed in current frontend flow. The register submit path now resets loading when agreement is missing. Evidence: [register/index.js](/home/joel/personal/projects/proptiOS/app.proptios.com/src/pages/register/index.js) |
| Tenants management crashes on a brand-new account | Implemented | Fixed by guarding against missing `items` before filtering. Evidence: [TenantManageTable.js](/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/tenant/TenantManageTable.js) |
| Properties overview should show empty placeholders instead of blank state | Implemented | Overview now renders stat cards with zero-state subtitle even when there are no properties. Evidence: [ParentPropertyOverview.js](/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/ParentPropertyOverview.js) |
| Regression coverage for the two bugs above | Implemented | Fresh-account and onboarding-guard specs now exist and were run on staging. Evidence: [00-fresh-account.spec.js](/home/joel/personal/projects/proptiOS/app.proptios.com/e2e/00-fresh-account.spec.js), [00-onboarding-guard.spec.js](/home/joel/personal/projects/proptiOS/app.proptios.com/e2e/00-onboarding-guard.spec.js) |

---

## 2. Tenant, Property, Unit, Lease Rules

| Item | Status | Notes |
| --- | --- | --- |
| Tenant-to-unit is currently `1:1` | Partially Implemented | Current backend logic is still centered on one tenant per unit and one `tenant_id` on `units`, with reassignment handling in user/property flows. It is not modeled as multi-unit occupancy yet. Evidence: [users.js](/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/users.js), [properties.js](/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/properties.js) |
| Future support for one tenant occupying multiple units | Not Implemented | No `tenant_sites`-style or multi-unit occupancy model found for this rule yet |
| Lease must belong to property, unit, and tenant | Implemented | Lease create flow and API are built around these associations. Evidence: [leases.js](/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/leases.js), [leases.spec.js](/home/joel/personal/projects/proptiOS/app.proptios.com/e2e/leases.spec.js) |
| Lease templates replace old “unassigned lease agreement” concept | Partially Implemented | Frontend has a `templates` tab in leases, but it is disabled. I did not find a corresponding backend `lease_templates` implementation in the current repo. Evidence: [ParentLeaseViewRight.js](/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/lease/ParentLeaseViewRight.js) |
| Check whether a unit already has an assigned lease before creation | Partially Implemented | There is lease/unit linkage and delete logic that clears unit lease references, but I did not verify a full business-rule guard that prevents invalid reassignment in all create flows |
| Lease delete should be soft delete | Implemented | Backend lease delete sets `deleted_at`. Evidence: [leases.js](/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/leases.js) |
| Tenant delete should be soft delete | Implemented | Backend tenant delete sets `deleted_at`. Evidence: [tenants.js](/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/tenants.js) |
| Property delete should be soft delete | Implemented | Backend property delete sets `deleted_at` and cascades soft delete to units. Evidence: [properties.js](/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/properties.js) |

---

## 3. Properties and Units

| Item | Status | Notes |
| --- | --- | --- |
| Minimum units per property is 1 | Implemented | Property create and edit now normalize unit counts to at least `1` in both frontend validation and backend writes. Evidence: [properties.js](/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/properties.js), [AddPropertyDrawer.js](/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/AddPropertyDrawer.js), [EditPropertyDrawer.js](/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/EditPropertyDrawer.js) |
| Adding a property should automatically create one unit row in `units` | Implemented | Property create now inserts a first default unit inside the same transaction as the property insert, and the property E2E suite verifies it in the Units tab. Evidence: [properties.js](/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/properties.js), [properties.spec.js](/home/joel/personal/projects/proptiOS/app.proptios.com/e2e/properties.spec.js) |
| Add units without tenants | Implemented | Units can be inserted with `tenant_id || null`. Evidence: [properties.js](/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/properties.js) |
| Add tag to unit to represent defaults | Not Implemented | No obvious default-unit tag field or frontend display found |
| Property-level `rent_amount` optional, acts as default for units | Partially Implemented | Property `rent_amount` now flows through the add/edit drawers and is used when the first default unit is auto-created. It is not yet propagated to all existing units automatically. Evidence: [properties.js](/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/properties.js), [AddPropertyDrawer.js](/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/AddPropertyDrawer.js), [EditPropertyDrawer.js](/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/EditPropertyDrawer.js) |
| PM should be warned that property rent amount affects default unit rent | Implemented | Add/Edit Property drawers now explain how the default unit rent amount is used. Evidence: [AddPropertyDrawer.js](/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/AddPropertyDrawer.js), [EditPropertyDrawer.js](/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/EditPropertyDrawer.js) |
| Property rows should be clickable to property detail | Implemented | Property management grid row click routes to `/properties/manage/:id/`. Evidence: [PropertyManageTable.js](/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/PropertyManageTable.js) |
| Show property type in properties datagrid | Implemented | Property type is used in property table/grid flows |
| Show unit limit in properties datagrid | Not Implemented | I did not find a current UI column for subscription-driven unit limit in the property grid |
| Dedicated unit detail page `/properties/${id}/unit/${id}` | Not Implemented | Units are currently handled inside property views; I did not find that route implemented |

---

## 4. Tenant Management and Invitations

| Item | Status | Notes |
| --- | --- | --- |
| PM can delete tenant via soft delete | Implemented | Backend support exists and frontend test flow uses delete action. Evidence: [tenants.js](/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/tenants.js), [tenants.spec.js](/home/joel/personal/projects/proptiOS/app.proptios.com/e2e/tenants.spec.js) |
| PM can resend invite to tenant | Implemented | Tenant backend now exposes a resend-invite mutation and the tenant row menu wires it in. Evidence: [tenants.js](/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/tenants.js), [TenantManageTable.js](/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/tenant/TenantManageTable.js) |
| Add invitation status to tenants | Partially Implemented | Tenant invitation status now flows through the backend payloads and is used by the tenant action menu, but it is not yet surfaced as a first-class grid column/chip |
| Activate/deactivate tenant | Implemented | Tenant backend now exposes enable/disable mutations and the tenant row menu wires them to live handlers. Evidence: [tenants.js](/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/tenants.js), [TenantsContext.js](/home/joel/personal/projects/proptiOS/app.proptios.com/src/context/TenantsContext.js), [TenantManageTable.js](/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/tenant/TenantManageTable.js) |
| Tenant screening status in tenant grids and edit flows | Not Implemented | I did not find a current `screening_status` implementation |

---

## 5. Notifications

| Item | Status | Notes |
| --- | --- | --- |
| Notifications table | Not Implemented | No backend notifications module/table wiring found in current app code |
| Notification context polling every 1 minute | Not Implemented | No dedicated polling notification context found |
| Store notifications in local storage | Not Implemented | No notification storage implementation found |
| MVP notifications through email only | Partially Implemented | The app already sends some transactional emails/invite flows, but there is no generalized notification system |

---

## 6. Finance and Settlements

| Item | Status | Notes |
| --- | --- | --- |
| Settlements module exists | Implemented | Backend settlements controller and frontend settlement views exist. Evidence: [settlements.js](/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/settlements.js), [ParentFinanceViewSettlement.js](/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/finance/ParentFinanceViewSettlement.js) |
| Settlement accounts support bank and mobile money details | Implemented | Backend and frontend include bank account and mobile money account fields |
| Settlement UI uses `sites.balance` | Implemented | Backend `/settlements/all` returns `sites.balance` and site currency |
| `sites.manual_balance` support for internal-only manual ledger | Not Implemented | I found notes and intended design, but no current implementation evidence |
| Separate internal and external transaction endpoints for different balances | Not Implemented | Current code does not clearly expose this split as described in the notes |
| Currency conversion before applying to site balance | Not Implemented / Unverified | I did not find a current real-time conversion implementation from this audit pass |
| Settlement subtracts amount instead of resetting balance | Needs Clarification | The current controller exposes settlement data and settings, but I did not verify end-to-end settlement ledger mutation behavior from code alone |
| Settlement confirmation email | Not Implemented / Unverified | Not found as a clear current behavior |

---

## 7. Marketing, Listings, Applicants

| Item | Status | Notes |
| --- | --- | --- |
| Listings backend exists | Implemented | Backend `listings` routes exist. Evidence: [listings.js](/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/listings.js) |
| Marketing module with listings/applicants tabs | Not Implemented / Partial | Notes describe it, but I did not find a complete frontend marketing module under property detail |
| Public listing URLs | Not Implemented | No public listing route implementation found in current frontend |
| Applicant status lifecycle on tenants | Not Implemented | No active `applicant_status` implementation found |

---

## 8. Dashboard / Overview Improvements

| Item | Status | Notes |
| --- | --- | --- |
| Property overview shows total tenants/units/leases/maintenance/vacant/expiring | Implemented | Current property overview and backend aggregates include these metrics. Evidence: [ParentPropertyOverview.js](/home/joel/personal/projects/proptiOS/app.proptios.com/src/ui/property/ParentPropertyOverview.js), [properties.js](/home/joel/personal/projects/proptiOS/api.pm.proptios.com/app/controllers/module/properties.js) |
| Global soft-delete filtering across major modules | Partially Implemented | Many core queries already use `deleted_at IS NULL`, but I would not claim universal consistency without a dedicated audit |
| Remove maintenance section from PM dashboard | Needs Clarification | I did not verify this against a specific older baseline |
| Dashboard key metrics for total properties/tenants/leases | Implemented / Partial | Site-level aggregate queries exist; exact dashboard presentation may still differ from the note |

---

## 9. Tenant-Site Redesign

| Item | Status | Notes |
| --- | --- | --- |
| `tenant_sites` table/model | Not Implemented | I did not find `tenant_sites` in current repo code |
| Multi-site tenant access using same email | Not Implemented | Current model still appears site-bound |
| Preserve tenant history across sites via join table | Not Implemented | This remains a future architecture project |

---

## 10. AI / Agentic System

| Item | Status | Notes |
| --- | --- | --- |
| WhatsApp / Telegram agent that performs actions for users | Not Implemented | No current agentic messaging workflow found in app/backend code |

---

## 11. Items That Need Product Clarification

These came through strongly in the notes but cannot be marked truthfully as done/not-done without a product decision first.

- “Should not be able to edit info after it has been added”
- exact immutable fields for tenants, properties, units, leases
- exact business rule for lease uniqueness by unit across history
- exact settlement semantics for cash/manual transactions vs platform-collected funds
- whether listing/public marketing lives in core app or a separate public surface

---

## 12. Practical Reading of Current Progress

If we treat the current repo as the source of truth, the progress looks like this:

- Core CRUD platform exists and is substantial
- Soft-delete behavior exists in major modules
- Settlements exist in an early but real form
- Empty-state and onboarding regression handling recently improved
- Property/tenant/lease screens exist and are actively being stabilized
- The larger architectural ideas are still mostly pending:
  - `tenant_sites`
  - generalized notifications
  - public listings/applicants
  - richer settlement ledger model
  - agentic messaging actions

That means the current state is best described as:

`working PM platform with meaningful progress, plus a large backlog of architectural and workflow expansion still pending`
