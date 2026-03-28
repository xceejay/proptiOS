# Product Notes Normalized

_Last updated: 2026-03-28_

This document restructures the older `manages.homes` / `Proptios` product notes into a cleaner backlog.
Some items are already implemented, some are partially implemented, and some remain product direction only.

## Context

- Previous product name: `manages.homes`
- Current product name: `Proptios`
- Source material status:
  - some notes are historical
  - some are now implemented
  - some conflict with newer decisions
  - some are still valid roadmap items

---

## 1. Confirmed Product Rules

These are the clearest current business rules from the notes.

### 1.1 Tenants and units

- Current rule: tenant-to-unit is `1:1`
- A tenant cannot occupy more than one unit at a time for now
- In future, a request flag may allow multi-unit occupancy behavior
- Reassignment should account for whether a tenant should be removed from an old unit before attaching to a new one

### 1.2 Lease assignment

- A lease agreement must belong to:
  - property
  - unit
  - tenant
- Lease creation should require all three selections up front
- Lease templates now carry the “unassigned document” concept
- Before creating a lease, the system must check whether that unit already has an assigned lease in the relevant business sense
- Historical reassignment rules make a hard unique DB constraint on `unit_id` unsuitable

### 1.3 Properties and units

- Minimum units per property is `1`
- Adding a property should create at least one default unit
- Units must also be allowed to exist without tenants
- Units should carry a marker/tag to represent defaults
- Property-level `rent_amount` is optional
- If set, PMs should be warned that it becomes the default rent amount for newly created units

### 1.4 Soft-delete policy

- Tenant delete should soft-delete via `deleted_at`
- Property delete should soft-delete via `deleted_at`
- Lease delete should soft-delete via `deleted_at`
- General backend expectation: all read/write flows should consistently exclude soft-deleted records unless explicitly requested

---

## 2. Current UX / Product Bugs

These are not long-term ideas. These are present behavior gaps or product bugs.

### 2.1 Onboarding

- Clicking `Create account` before agreeing to terms should not leave the loader stuck
- Validation should block submission cleanly and keep the form usable

### 2.2 Empty states

- Brand-new accounts should show intentional zero-state placeholders
- Properties overview should not render as a blank page when no properties exist
- Tenants management should not crash for empty/new accounts

### 2.3 Editing rules

- “Should not be able to edit info after it has been added” needs clarification
- This likely applies only to specific immutable fields, not all records globally
- We should explicitly define which fields are immutable:
  - site id?
  - signed lease fields?
  - unit identity?
  - tenant invitation email?

### 2.4 Error handling

- Request failure toasts should be shown consistently
- Tenant add flow already exposed one example of poor failure messaging

---

## 3. Near-Term Functional Backlog

These are product features that feel close to implementation, not just ideas.

### 3.1 Tenant management

- PM can resend tenant invite
- PM can delete tenant via soft-delete
- Add invitation status to tenants
- Add activate/deactivate tenant actions
- Add tenant screening status in tenant grids and edit flows

### 3.2 Property and unit management

- Unit detail page:
  - route: `/properties/${propertyId}/unit/${unitId}`
  - access pattern: open property, click unit
  - UI: a simple summary card similar to tenant account view
- Add payment details for PM/site:
  - bank account
  - mobile money number
- Add units without tenants
- Add default unit tagging
- Make property rows clickable into property detail
- Show property type and unit limit in the properties datagrid

### 3.3 Lease workflows

- Require property, unit, and tenant selection before lease creation
- Show richer lease grid details:
  - status
  - days left
  - rent amount
  - currency
  - payment frequency
  - signature status
- Add lease preview / view action
- Add delete via soft-delete
- Show tenant signed status
- Improve date formatting and export handling
- Add AI lease assistance for composition

### 3.4 Maintenance

- Improve maintenance grid columns
- Replace tenant-centric request owner display with assignee/requested-for model
- Internal assignees should come from `pm_users`
- External assignees can remain free text

### 3.5 Marketing

- Add marketing module under property:
  - listings tab
  - applicants tab
- Support property and unit listing creation via wizard
- Support public listing URLs
- Add applicant status lifecycle

---

## 4. Financial / Settlement Model

This section is one of the more important architecture notes and should be preserved carefully.

### 4.1 Meaning of settlement

- Settlements are payouts/disbursements of funds collected on behalf of a PM company
- Funds are returned from platform-held balance to the property management company

### 4.2 Site balances

- `sites.balance`
  - holds externally processed platform-collected funds
- `sites.manual_balance`
  - holds manually entered/internal transaction balance
- Settlement UI should show only `sites.balance`
- Wider financial views may show combined total balance

### 4.3 Internal vs external transaction endpoints

- Internal endpoint:
  - for manually entered transactions
  - updates `manual_balance`
- External endpoint:
  - for system-processed transactions, such as rent collection
  - updates `balance`

### 4.4 Currency handling

- Leases specify payment currency
- Site default currency lives in `sites.currency`
- If payment currency differs from site currency:
  - convert before applying to site balance
- Exchange rates should be fetched dynamically
- Exchange rate used should be surfaced in UI or communications

### 4.5 Ledger behavior

- Every transaction should update:
  - `transactions`
  - corresponding site balance field
- Settlements should subtract the settled amount
- Settlements should not reset `sites.balance` to zero
- Manual settlements are triggered by operations, not automatically

### 4.6 Notifications around settlement

- Settlement confirmation email should be sent after completion
- Final balance should be rechecked after settlement
- Relevant parties should receive settlement-complete communication

---

## 5. Notifications Direction

- Add `notifications` table
- Add notification context in frontend
- Poll every 1 minute
- Cache notification state in local storage
- MVP notification channel: email
- Email should be sent after successful important requests, for example:
  - maintenance request submission
  - settlement completion
  - invitation flows

---

## 6. Tenant-Site Relationship Redesign

This is a substantial data-model note and should likely be treated as a dedicated migration project.

### Problem

- Current model links tenant to one site directly
- A tenant moving to another site may require a different email or a new account
- Tenant history becomes fragmented by `site_id`

### Proposed solution

Introduce `tenant_sites` with:

- `site_id`
- `tenant_id`
- `status`
- `email_invitation_status`
- `deleted_at`

### Expected benefits

- one tenant can access multiple sites
- one email can work across multiple sites
- tenant history is preserved per site
- invitation lifecycle is trackable per site
- site-specific deletion history is preserved

### Project note

- This should be treated as an architectural migration, not a quick feature
- It will affect:
  - auth
  - tenant queries
  - invitations
  - permissions
  - joins across dashboards and finance

---

## 7. Dashboard / Module Improvement Notes

These notes read like a later iteration pass and are useful as a UI/product checklist.

### Dashboard

- remove maintenance section from PM dashboard
- add:
  - active leases
  - total tenants
  - total properties

### Properties module

- show property type and units limit in datagrid
- make rows clickable
- add soft delete support

### Single-property overview

- show:
  - total tenants
  - total units
  - total leases
  - total maintenance requests
  - total applicants
  - vacant units
- disable settings tab temporarily if not ready

### Units module

- display UUID as unit identifier
- remove tenancy start/end fields from unit forms
- show whether a unit has a lease and the lease title
- improve description field prominence

### Global backend consistency

- enforce soft-delete filtering everywhere
- ensure all joins and endpoints exclude `deleted_at` rows by default

---

## 8. Suggested Delivery Order

This is the most practical sequence based on the notes.

### Phase A: stabilize current UX

- onboarding validation + loaders
- empty states
- failure toasts
- tenant/property/lease soft-delete consistency

### Phase B: lock in data rules

- property creates default unit
- min unit count is 1
- lease creation requires property + unit + tenant
- unit occupancy checks

### Phase C: PM workflow completeness

- resend invite
- tenant activation/deactivation
- payment details
- unit detail page
- richer datagrids and exports

### Phase D: finance + settlements

- separate internal/external transaction flows
- currency conversion model
- settlement ledger and notifications

### Phase E: larger architecture projects

- tenant_sites redesign
- notifications table + context
- marketing/listings/applicants
- AI lease generation
- agentic assistant actions via WhatsApp/Telegram

---

## 9. Open Product Questions

These should be clarified before implementation begins on the affected areas.

- Which fields are truly immutable after creation?
- Should adding a property always create a single default vacant unit, or should PM choose its label immediately?
- Should tenant delete remove account access immediately if the tenant belongs to multiple sites in future?
- What exactly counts toward settlement balance versus record-only cash transactions?
- What is the official notification policy for:
  - tenant actions
  - maintenance events
  - settlements
  - invite reminders
- Should property/unit listings live under the main app domain or a public marketing subdomain?

---

## 10. Recommended Next Docs

- `SETTLEMENTS-DESIGN.md`
- `TENANT-SITES-MIGRATION-PLAN.md`
- `LEASE-ASSIGNMENT-RULES.md`
- `NOTIFICATIONS-MVP.md`
- `PROPERTY-AND-UNIT-LIFECYCLE.md`
