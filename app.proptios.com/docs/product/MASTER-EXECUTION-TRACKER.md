# Master Execution Tracker

_Last updated: 2026-03-29 (third pass — mobile QA + feature gaps)_

This is the active source of truth for:

- current product progress
- remaining QA bugs
- implementable next slices
- recently fixed items

Older QA files in the repo are preserved as historical snapshots, but this document should be treated as the live tracker going forward.

## Current Source Files

- Product progress audit:
  - [PRODUCT-PROGRESS-AUDIT.md](/home/joel/personal/projects/proptiOS/app.proptios.com/docs/product/PRODUCT-PROGRESS-AUDIT.md)
- Product idea normalization:
  - [PRODUCT-NOTES-NORMALIZED.md](/home/joel/personal/projects/proptiOS/app.proptios.com/docs/product/PRODUCT-NOTES-NORMALIZED.md)
- Remaining QA-specific bug plan:
  - [REMAINING-BUG-PLAN.md](/home/joel/personal/projects/proptiOS/app.proptios.com/docs/qa/REMAINING-BUG-PLAN.md)
- Latest staging walkthrough snapshot:
  - [QA-STAGING-REPORT.md](/home/joel/personal/projects/proptiOS/app.proptios.com/docs/qa/QA-STAGING-REPORT.md)

---

## 1. Recently Fixed

### Fresh-account and onboarding issues

- Onboarding submit without agreeing to terms no longer leaves the loader stuck
- Tenants management no longer crashes for brand-new accounts
- Staging `/tenants/` crash is fixed on the live staging frontend now
  - important note: this was a stale Vercel deployment issue after the code fix had already landed
- Properties overview now renders zero-state cards instead of going blank
- Tenant list row actions now support:
  - resend invite
  - enable account
  - disable account
- Communication now uses the real backend `issues` tables instead of hardcoded demo issues
- Communication issue creation, commenting, and status updates are now backed by real API routes
- Property creation now:
  - auto-creates the first default unit
  - enforces a minimum of 1 allocated unit
  - exposes default unit rent messaging in the add/edit drawers
- Units now have a dedicated detail screen reachable from the property Units tab
- Property settings phone number now persists correctly through save + reload
- Direct guest routes now load correctly on staging:
  - `/register/`
  - `/forgot-password/`
- Login page auth links now navigate correctly in the staged app flow:
  - `Create an account`
  - `Forgot Password?`
- Multi-tenant auth routing is now wired in source:
  - shared login hosts (`app.proptios.com`, `app.staging.proptios.com`) can authenticate and then redirect the user into their site host
  - production tenant hosts use `<site>.proptios.com`; staging tenant hosts now use `<site>.staging.proptios.com`
  - tenant hosts send their active site host to the API
  - backend auth now rejects tokens/logins when the requested tenant host does not match `user.site_id`
- Post-login tenant-host navigation no longer throws the generic auth toast on staging
  - module contexts now read tokens through the shared auth storage helper instead of raw `localStorage`
  - live browser retest confirmed clean login redirect and clean module traversal on staging
- The strict staging CRUDR Playwright protocol is now green end to end:
  - auth
  - create
  - read
  - update
  - delete
  - read again
- New regression tests cover:
  - onboarding terms guard
  - fresh-account empty states
  - dedicated unit detail navigation

### Dashboard and display fixes

- Dashboard Earning Reports chart no longer shows `$Infinityk` on Y-axis — formatter now handles non-finite values and formats correctly
- Dashboard Revenue Growth badge now shows `0%` instead of `% 0` — reversed format string fixed
- Sidebar branding no longer shows `undefined` — falls back to `proptios.com` template name when site data is absent or invalid
- Properties overview Total Applicants card no longer shows `NaN` — coerces missing applicant counts to `0`

### Property management fixes

- Property grid no longer exposes internal UUID below the property name — shows address or type instead
- Property sidebar now refreshes after settings save without requiring a page reload — `name` field is now included in the update state
- Property creation status no longer flickers `Inactive` before `Active` — new properties default to `active` status in the optimistic update
- Property phone number now persists through create and settings save flows

### Filter and label fixes

- Filter dropdowns across finance, settlement, users, leases, and statements pages no longer all say `Invoice Status` — each now shows its correct context label (Status, Payment Method, Payment Type, etc.)
- Audit log filter labels corrected from `Account Status` / `Invitation Status` to `Action Type` / `Status`
- PropertyLeaseTable filter corrected from `Invoice Status` to `Lease Status`
- Expenses tab now shows `Add Expense` instead of `Create Invoice`

### Auth and onboarding fixes

- Forgot password page now calls the backend `POST /forgot-password` endpoint and shows a success/error alert with loading state
- Maintenance request status now defaults to `Pending` instead of `Unknown` for unrecognized status values
- Verification page now says `Welcome to ProptiOS` instead of `Welcome to MH`
- Verification page and help button now link to `https://proptios.com` instead of `http://proptios.com`

### E2E reliability improvements

- onboarding-mode setup now creates a fresh staging user reliably
- guest-route auth no longer incorrectly redirects `/register` to `/login`
- properties cross-cutting tests no longer depend on seeded property data
- tenant empty-state coverage now exists
- the dedicated staging CRUDR Playwright protocol now passes cleanly against staging

---

## 2. Active QA Bugs Still Worth Fixing

These are the items that still look open or only partially verified.

### Fixed — 2026-03-29

- ~~Onboarding verification page is still non-functional (CRIT-4)~~ — wired to `POST /auth/verify-email-code`
- ~~Maintenance request manage drawer is still view-only (CRIT-5)~~ — backend + frontend PUT now supports all fields
- ~~Invoice creation still uses hardcoded placeholder/demo data and disabled actions (MAJ-5)~~ — replaced with empty fields/placeholders
- ~~Console still shows recurring `/auth/me` and empty-user noise (MIN-10)~~ — removed stray console.logs
- ~~Leases templates tab is still disabled with no explanation (MIN-11)~~ — added "coming soon" tooltip
- ~~Broadcast tab is still disabled with no explanation (MIN-12)~~ — added "coming soon" tooltip
- ~~Property marketing tab is still effectively empty (MIN-13)~~ — added coming soon placeholder

### Open items from 2026-03-29 mobile QA walkthrough

#### Critical — Mobile UX

- **MOB-1**: Add Property drawer is extremely difficult to use on mobile. Clicking "Add Property" sometimes doesn't register. Selecting property type requires many taps before it registers. Root cause suspected: touch target sizes, MUI Select/Autocomplete components not handling mobile touch events reliably, possible z-index or overlay conflicts.

- **MOB-2**: Add Single Tenant form crashes with a runtime error on submit, requiring a full page refresh. Country selection is also buggy (same touch registration issue as property type). Needs error boundary investigation and form submission error handling.

- **MOB-3**: Ghost touch / tap-through issue across the app on mobile. Tapping one element (e.g. activate tenant) triggers adjacent actions (e.g. resend invite). Tapping and holding temporarily stabilises. Likely caused by MUI DataGrid row action buttons being too close together on mobile, or click event propagation issues with touch events.

- **MOB-4**: Drawer forms in general are very difficult to use on mobile. Clicks/taps don't register properly. Drawer width, touch targets, and MUI component sizing need mobile-specific attention.

- **MOB-5**: All Submit data buttons in the UI buttons must give user feedback so they user does not clik multiple times but they just wait for result. A button framework may be needed for this or a request framework for loading state of button may be needed. Libraries may exist for this. Explore options

#### Critical — Data Integrity

- **DATA-1**: Duplicate tenant invitations — clicking submit multiple times (because of no visual feedback, see UX-1) sent 5 invitations for the same tenant with the same email. Backend must enforce uniqueness on tenant email per site, and frontend must debounce/disable the submit button after first click.

#### Major — UX

- **UX-1**: No visual feedback on form submit buttons. After clicking submit, the button stays enabled with no loading indicator, causing users to click repeatedly. All mutation buttons (create, update, invite) need: (a) disabled state during submission, (b) loading spinner/indicator, (c) prevent double-submission.

- **UX-2**: Developer-facing text visible in the UI. Example: "Tenant transactions currently render from the transactions array returned on the tenant payload." These internal implementation notes must be removed from all user-facing views. Audit all modules for similar developer messages.

#### Major — Missing Features

- **FEAT-1**: Tenant document storage — no section exists for uploading/managing tenant documents (ID, lease agreements, proof of address, etc.). Needs a documents tab on the tenant detail view with file upload capability.

- **FEAT-2**: Cannot add a unit or property to a tenant from the tenant module. The relationship should be assignable from either direction (property → tenant or tenant → property/unit).

- **FEAT-3**: Image upload support — properties, sites, and other entities should support image uploads (photos, logos, etc.) wherever it makes sense.

- **FEAT-4**: Subscription/billing — wire up the subscription features end to end (UI + backend). Payment processing via Paystack (test keys to be provided). Currently half-baked — needs full implementation of plan selection, payment flow, subscription status, and usage enforcement.

- **FEAT-5**: Site and account settings — wire up fully. Currently partially implemented. All settings fields should save and persist correctly.

- **FEAT-6**: System archive / soft-delete — implement a site-wide archive where soft-deleted items (users, tenants, properties, etc.) remain accessible. Current options are only activate/deactivate, but users need the ability to remove items from active UI without permanently deleting them.

- **FEAT-7**: Audit log quality — current audit log messages read like developer logs. Rethink the message format to be user-friendly. Example: instead of "Updated maintenance_request record #123" → "Maintenance request 'Broken pipe in Unit 3A' was updated by Joel". Consider structured audit entries with human-readable summaries.

#### Minor — Authorization

- **AUTH-1**: User can enable/disable themselves in User Management. The ACL should prevent self-modification of account status. Backend and frontend need to enforce this rule.

- **AUTH-2**: ACL verification needed — confirm that the CASL-based frontend ACL and the backend authorization middleware are properly enforced across all modules. Both should be tested for role-based access (admin, manager, tenant, etc.).

### Backend-blocked or contract-blocked

- Finance statements endpoint stability
- Global settings save contract
- Invoice create/send contract
- User detail hydration API

### Frontend / product gaps still open

- Property units edit flow should be reverified end to end
- Property tenants create/edit/delete should be reverified end to end
- Property leases create/edit/view should be reverified end to end
- Property maintenance create/search/manage should be reverified end to end
- Tenants list delete/edit/filter/sort still needs full live retest
- Leases list / create / edit / view still needs full live retest

---

## 3. Product Backlog That Looks Implementable Now

These are the safest items to implement next without a deeper architecture migration.

### High-confidence near-term work

- Clear immutable-field rules in UI/backend for specific records
- Better request failure toasts across mutation flows
- Richer property/unit/lease datagrid fields where backend data already exists
- Reverify the staged tenant-host redirect behavior once the frontend/backend deployments pick up the new multi-tenant auth wiring
- Close the remaining open items from [QA-STAGING-REPORT.md](/home/joel/personal/projects/proptiOS/app.proptios.com/docs/qa/QA-STAGING-REPORT.md) before starting deeper architecture work

### Larger items that should be phased separately

- `tenant_sites` redesign
- notifications table + context polling
- public listings/applicants flow
- richer settlement ledger split (`balance` vs `manual_balance`)
- agentic WhatsApp / Telegram actions

---

## 4. Recommended Working Order

### Phase A

- keep current QA and product tracking consolidated here
- close still-open frontend bugs from the QA docs
- reverify the E2E suite on staging after each bug-fix batch

### Phase B

- implement high-confidence product backlog items that do not require schema redesign

### Phase C

- move into the larger architecture projects:
  - tenant-sites
  - notifications
  - public listings
  - deeper settlement redesign

---

## 5. What To Treat As Historical

The following files should now be treated as historical reference, not the live tracker:

- [QA-FINDINGS.md](/home/joel/personal/projects/proptiOS/app.proptios.com/docs/qa/archive/QA-FINDINGS.md)
- [QA-FINDINGS-cross-cutting.md](/home/joel/personal/projects/proptiOS/app.proptios.com/docs/qa/archive/QA-FINDINGS-cross-cutting.md)
- [QA-FINDINGS-finance-users.md](/home/joel/personal/projects/proptiOS/app.proptios.com/docs/qa/archive/QA-FINDINGS-finance-users.md)
- [QA-FINDINGS-property-manage.md](/home/joel/personal/projects/proptiOS/app.proptios.com/docs/qa/archive/QA-FINDINGS-property-manage.md)
- [QA-FINDINGS-tenants-leases.md](/home/joel/personal/projects/proptiOS/app.proptios.com/docs/qa/archive/QA-FINDINGS-tenants-leases.md)
- [QA-TEST-FLOW.md](/home/joel/personal/projects/proptiOS/app.proptios.com/docs/qa/archive/QA-TEST-FLOW.md)
- [QA-CRUD-VERIFICATION.md](/home/joel/personal/projects/proptiOS/app.proptios.com/docs/qa/QA-CRUD-VERIFICATION.md)

They are still useful evidence, but they should no longer be updated independently unless they are being rewritten into this tracker.
