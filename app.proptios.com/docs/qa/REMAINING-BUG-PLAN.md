# Remaining Bug Plan

_Last updated: 2026-03-24 (third pass)_

This is the current execution plan after the main QA/fix/retest passes.

## Goal
Finish the remaining non-green items in `QA-CRUD-VERIFICATION.md`, with honest separation between:
- frontend-fixable issues
- backend-contract blockers
- partial items that still need live browser verification

---

## 1. Backend-blocked items

These are not frontend crash bugs anymore. They need backend work or a new API contract.

### 1.1 Finance statements
- Status: blocked
- Symptom: `GET /transactions -> 500`
- Frontend state now: explicit error banner + empty state; request params are now forwarded correctly from the frontend
- Reverified on 2026-03-24: direct API call to `GET /transactions?page=0&limit=10` still returned `500 {"status":"FAILED","description":"Server Error: Failed to calculate accounting data"}`
- Needed:
  - backend fix for statements/accounting data endpoint
  - then browser reverify `/finance/statements`

### 1.2 Global settings save
- Status: blocked
- Symptom: no real site/account settings save contract exists
- Frontend state now: old broken `/users` save path removed; Save intentionally disabled
- Needed:
  - real settings update endpoint(s)
  - frontend contract and success/error handling

### 1.3 Invoice create/send
- Status: blocked
- Symptom: no real create/send invoice flow is wired
- Frontend state now: warning shown, Save/Send disabled
- Needed:
  - backend contract for invoice create/send
  - then browser reverify `/finance/invoice/create`

### 1.4 User detail hydration
- Status: partially blocked
- Symptom: `GET /users/:id` still fails
- Frontend state now: explicit error state; no infinite loading
- Reverified on 2026-03-24: direct API call to `GET /users/1` still returned `500 {"status":"FAILED","description":"Server Error: Failed to fetch user"}`
- Needed:
  - backend fix for user detail endpoint
  - then browser reverify `/users/manage/:id/*`

### 1.5 Property / tenant / lease actions lacking mutation contracts
- Property tenant suspend
- Property lease delete (soft-delete path not exposed in current frontend/context)
- Property maintenance update/suspend

Needed:
- expose real mutations in context + backend endpoints if they exist
- or explicitly product-disable the actions permanently

---

## 2. Frontend-partial items still worth finishing

These may be fixable entirely in frontend or may just need one more QA pass.

### 2.1 Sort verification
Need explicit browser verification for sort order on:
- Users manage
- Finance payments
- Properties list
- Any surviving tenant/lease grids

### 2.2 Property tenants tab
Frontend state now:
- tenant links route to working summary/transactions shells
- add-existing-tenant drawer was rewired away from the broken create flow
- optimistic tenant/unit update path exists in code

Still needed:
- live browser revalidation of add-existing-tenant end-to-end
- search / filter verification
- delete behavior verification if a real mutation exists

### 2.3 Property leases tab
Frontend state now:
- edit row action exists
- tenant links are fixed
- status filter options are generated from live rows
- delete is explicitly unavailable in UI

Still needed:
- live browser revalidation of edit action
- search / filter verification
- status filter verification

### 2.4 Tenants list
Frontend state now:
- row/view routing fixed
- delete wired to `tenants.deleteTenants`
- search + status filter logic implemented
- enable/disable degrade to explicit unavailable states when handlers are absent

Still needed:
- live browser revalidation of delete path
- edit path verification
- filter/sort verification

### 2.5 Leases list / create / edit / view
Frontend state now:
- create CTA points to `/leases/create`
- row actions expose `View Lease` and `Edit Lease`
- delete is explicitly unavailable
- search/filter logic implemented in list
- `/leases/view/:id` now waits for `id` before fetching and normalizes the lease payload

Still needed:
- live browser revalidation of `/leases/create`
- live browser revalidation of `/leases/view/:id`
- live browser revalidation of `/leases/edit/:id`
- list row-action/filter verification

### 2.6 Property maintenance create/search
Frontend state now:
- route no longer crashes
- manage drawer is explicitly view-only instead of posting to the wrong endpoint
- quick suspend is explicitly unavailable

Still needed:
- live browser revalidation of add maintenance request
- search/filter verification
- update remains backend-blocked unless proper endpoint is wired

---

## 3. Execution order

### Phase A — preserve current good state
1. Commit current code
2. Push current branch to origin
3. Keep lint/test green before every new batch

### Phase B — close frontend-partial rows
1. Sort verification pass
2. Property tenants / leases / maintenance retest pass
3. Tenants + leases route/action retest pass
4. Update `QA-CRUD-VERIFICATION.md`

### Phase C — backend-blocked follow-up
1. Confirm whether backend endpoints exist but are broken, or do not exist yet
2. If fixable in repo, implement backend fixes
3. If not fixable here, leave frontend in explicit blocked state and document exact blocker

---

## 4. Success criteria

### Frontend success
- `pnpm lint --quiet` passes
- `pnpm test` passes
- all frontend-fixable rows in `QA-CRUD-VERIFICATION.md` are moved to ✅ or explicit backend-blocked ❌

### Documentation success
- no ambiguous matrix rows left when the real state is known
- every still-open row explains whether it is:
  - frontend bug
  - backend bug
  - missing contract
  - intentional product stub
