# Staging QA Report — app.staging.proptios.com

_Date: 2026-03-28_
_Tester: Automated (Claude Code via Playwright)_
_Environment: app.staging.proptios.com + api.staging.proptios.com_
_Test account: qatest@proptios.com (registered during test)_

## Host Model Note

Canonical staging tenant hosts now use:
- `<site>.staging.proptios.com`

Shared staging login still uses:
- `app.staging.proptios.com`

Legacy compatibility:
- older `staging.<site>.proptios.com` links may still resolve for a transition period, but they are no longer the canonical staging tenant shape.

## Status Update

_Updated: 2026-03-28_

This report is preserved as the original staging QA snapshot, but one item from the original run has now been reverified as fixed on live staging:

- `CRIT-1` Tenants page crash on `/tenants/`
  - Current status: `FIXED`
  - Verification: live browser retest against `https://app.staging.proptios.com/tenants/`
  - Notes: the code fix was already present in `origin/staging`, but the staging frontend had been serving a stale Vercel bundle. A fresh staging deploy and alias update resolved the live crash.

## Summary

Full end-to-end QA walkthrough from registration through every authenticated module. Tested CRUD operations, tab navigation, form validation, and error handling across the staging environment.

**Original result: 28 bugs found (5 critical, 10 major, 13 minor)**

**Current verified adjustment: 27 still open from this report, 1 fixed**

Additional items have since been implemented in the current codebase and verified locally against the real backend flow:

- `MAJ-6` Communication page hardcoded demo issues
  - Current status: `FIXED IN CODE`
  - Verification: dedicated communication E2E now creates a real issue, adds a real comment, and updates status against the backend `issues` API
- `MAJ-10` Communication reporter shows "Current User"
  - Current status: `FIXED IN CODE`
  - Verification: communication reporter/comment author now come from persisted backend issue/comment records instead of in-memory placeholder names

---

## Critical Bugs

### CRIT-1: Tenants page crashes on load
- **Route**: `/tenants/`
- **Action**: Navigate to tenants page
- **Expected**: Tenant list renders
- **Actual**: Full page crash — "Application error: a client-side exception has occurred"
- **Console**: `TypeError: Cannot read properties of undefined`
- **Impact**: Tenant management is completely unusable
- **Status**: FIXED
- **Resolution note**: Reverified fixed on live staging after updating the stale frontend deployment.

### CRIT-2: Registration page inaccessible via direct URL
- **Route**: `/register/`
- **Action**: Navigate directly to `app.staging.proptios.com/register/`
- **Expected**: Registration form renders
- **Actual**: Briefly loads then redirects to `/login/`
- **Root cause**: Auth0 middleware in `middleware.js` intercepts all routes. The `matcher` pattern doesn't exclude `/register`, `/onboarding`, `/forgot-password`
- **Workaround**: Only accessible by clicking "Create an account" from the login page (which triggers client-side navigation bypassing the middleware)
- **File**: `app.proptios.com/middleware.js`
- **Status**: FIXED
- **Resolution note**: Reverified on 2026-03-28. Direct `GET https://app.staging.proptios.com/register/` now returns `200`, and the registration page renders in-browser without bouncing to `/login/`.

### CRIT-3: "Create an account" link triggers login form validation
- **Route**: `/login/`
- **Action**: Click "Create an account" link
- **Expected**: Navigate to `/register/`
- **Actual**: If login form has been touched/submitted, clicking the link triggers form validation errors ("email is a required field") instead of navigating. The `<a>` tag is inside the `<form>` element, so the click propagates as a form submission.
- **Note**: On a fresh page load with empty fields, the link works correctly via client-side navigation
- **Status**: FIXED
- **Resolution note**: Reverified on 2026-03-28. The link is no longer inside the login form in the current page source, direct browser navigation reaches `/register/`, and the earlier devtools-only misread was caused by the devtools click focusing the link before activation rather than exposing a real app regression.

### CRIT-4: Verification code page is non-functional
- **Route**: `/onboarding/success/`
- **Action**: Enter a 4-digit code and click "Verify Account"
- **Expected**: Code is validated server-side, account verified
- **Actual**: "Verify Account" is a link to `/login/` — it navigates away without making any API call. No verification actually happens. The page also shows an error toast: "An error occurred. Please try again or contact support."
- **Console**: `TypeError: Cannot read properties of undefined` during registration submit
- **Status**: FAIL

### CRIT-5: Maintenance request updates are disabled
- **Route**: `/properties/manage/[id]/maintenance/`
- **Action**: Click actions > Manage on a maintenance request
- **Expected**: Edit form with working submit
- **Actual**: Drawer opens with warning: "This drawer is view-only for now. The previous submit path posted to the unit update endpoint, so submit is intentionally disabled." Submit button is disabled.
- **Impact**: Maintenance requests cannot be edited or have their status changed once created
- **Status**: FAIL

---

## Major Bugs

### MAJ-1: Dashboard chart shows "$Infinityk" on Y-axis
- **Route**: `/dashboard/`
- **Element**: Earning Reports chart, Y-axis label
- **Expected**: Numeric scale (e.g., "$0", "$1k")
- **Actual**: "$Infinityk" — broken number formatting when dividing by zero or similar
- **Status**: FAIL

### MAJ-2: Dashboard shows "% 0" instead of "0%"
- **Route**: `/dashboard/`
- **Element**: Revenue Growth card, percentage badge
- **Expected**: "0%"
- **Actual**: "% 0" — format string reversed
- **Status**: FAIL

### MAJ-3: Sidebar navigation shows "undefined" for site name and logo
- **Route**: All authenticated pages (hamburger menu)
- **Action**: Open sidebar navigation
- **Expected**: Site/company name and logo
- **Actual**: Link text shows "undefined", heading shows "undefined", logo alt shows "32x30"
- **Root cause**: Site branding data not loading from the API or not mapped correctly
- **Status**: FAIL

### MAJ-4: Properties overview shows "NaN" for Total Applicants
- **Route**: `/properties/overview/`
- **Element**: "Total Applicants" summary card
- **Expected**: Numeric count (e.g., "0")
- **Actual**: "NaN"
- **Status**: FAIL

### MAJ-5: Invoice creation has hardcoded placeholder data
- **Route**: `/finance/invoice/create/`
- **Expected**: Blank invoice form or form pre-filled with actual site data
- **Actual**: Hardcoded fake data: "Office 149, 450 South Brand Brooklyn", "American Bank", "Tommy Shelby", "ETD95476213874685" (IBAN), "$12,110.55" total due
- **Additional**: Send and Save buttons are disabled — no backend API wired for invoice creation
- **Status**: FAIL

### MAJ-6: Communication page has hardcoded demo issues
- **Route**: `/communication/`
- **Expected**: Empty issues list for new account, or real data
- **Actual**: 3 hardcoded fake issues ("Loud Music Late at Night", "Trash Left in Hallway", "Broken Elevator") with fake reporters (John Doe, Jane Smith, Mike Anderson) and comments from 2023
- **Status**: FIXED IN CODE
- **Resolution note**: The page now loads from the real backend `issues` tables through dedicated communication API routes.

### MAJ-7: Phone number not persisted from property creation
- **Route**: `/properties/manage/[id]/settings/`
- **Action**: Created property with phone "0241234567", then viewed Settings tab
- **Expected**: Phone number field shows "0241234567"
- **Actual**: Phone number field is empty
- **Status**: FAIL

### MAJ-8: Forgot password gives no user feedback
- **Route**: `/forgot-password/`
- **Action**: Enter email and click "Send reset link"
- **Expected**: Success/error message
- **Actual**: No visible feedback — page does nothing after click. User has no idea if it worked.
- **Status**: FAIL

### MAJ-9: Maintenance request status defaults to "Unknown"
- **Route**: `/properties/manage/[id]/maintenance/`
- **Action**: Create a new maintenance request
- **Expected**: Status defaults to "Pending" or "Open"
- **Actual**: Status shows "Unknown"
- **Status**: FAIL

### MAJ-10: Issue reporter shows "Current User" instead of actual name
- **Route**: `/communication/`
- **Action**: Create a new issue or add a comment
- **Expected**: Shows actual user name (e.g., "QA Test User")
- **Actual**: Shows "Current User" for reporter and comment author
- **Status**: FIXED IN CODE
- **Resolution note**: Reporter and comment author names now come from persisted backend user records.

---

## Minor Bugs

### MIN-1: Currency dropdown listbox labeled "Country *" instead of "Default Currency *"
- **Route**: `/register/`
- **Element**: Default Currency dropdown's listbox accessible name
- **Status**: FAIL

### MIN-2: All filter dropdowns labeled "Invoice Status" across multiple pages
- **Routes**: `/finance/payments/`, `/finance/expenses/`, `/properties/manage/[id]/maintenance/`
- **Element**: Status, Payment Method, and Payment Type filter dropdowns all share the group label "Invoice Status" regardless of context
- **Status**: FAIL

### MIN-3: Audit log filter labels are wrong
- **Route**: `/audit/`
- **Element**: Filters labeled "Account Status" and "Invitation Status" — should be "Action Type" and "Status"
- **Status**: FAIL

### MIN-4: Property UUID exposed in grid
- **Route**: `/properties/management/`
- **Element**: Property Name column shows UUID (e.g., "887ba334-5b82-4dba-88c4-b459bc57506b") below the name
- **Expected**: Show address or type instead of internal UUID
- **Status**: FAIL

### MIN-5: Property sidebar doesn't refresh after save
- **Route**: `/properties/manage/[id]/settings/`
- **Action**: Update property name and save
- **Expected**: Left sidebar header updates to new name
- **Actual**: Sidebar still shows old name until page refresh
- **Status**: FAIL

### MIN-6: Property status inconsistency after creation
- **Route**: `/properties/management/`
- **Action**: Create property — grid immediately shows "Inactive", then on next page load shows "Active"
- **Status**: FAIL

### MIN-7: Expenses tab uses "Create Invoice" button
- **Route**: `/finance/expenses/`
- **Action**: Click action button
- **Expected**: "Add Expense" or similar expense-specific action
- **Actual**: "Create Invoice" button linking to the same (disabled) invoice form
- **Status**: FAIL

### MIN-8: Welcome message says "Welcome to MH" on verification page
- **Route**: `/onboarding/success/`
- **Expected**: "Welcome to ProptiOS" or the site name
- **Actual**: "Welcome to MH"
- **Status**: FAIL

### MIN-9: "Back to home" link uses HTTP not HTTPS
- **Route**: `/onboarding/success/`
- **Element**: "Back to home" link points to `http://proptios.com` instead of `https://proptios.com`
- **Status**: FAIL

### MIN-10: Console errors on every page load
- **Route**: All authenticated pages
- **Details**: `/auth/me` returns 500, axios interceptor logs "Unauthorized. Logging out.." then recovers. The `user is empty here:: null` log fires twice on every navigation.
- **Status**: FAIL

### MIN-11: "Leases templates" tab permanently disabled
- **Route**: `/leases/`
- **Element**: "templates" tab — always disabled with no tooltip or explanation
- **Status**: INFO

### MIN-12: "Broadcast" tab permanently disabled
- **Route**: `/communication/`
- **Element**: "Broadcast" tab — always disabled
- **Status**: INFO

### MIN-13: Marketing tab on property detail is empty
- **Route**: `/properties/manage/[id]/marketing/`
- **Expected**: Marketing content or placeholder
- **Actual**: Just heading "Marketing" and a separator — no content
- **Status**: INFO

---

## Modules Tested — Status Matrix

| Module | Page Load | Tab Navigation | Create | Read/List | Update | Delete | Notes |
|--------|-----------|----------------|--------|-----------|--------|--------|-------|
| **Registration** | PASS (via link) | N/A | PASS (creates account) | N/A | N/A | N/A | Direct URL fails (CRIT-2), verification broken (CRIT-4) |
| **Login** | PASS | N/A | N/A | N/A | N/A | N/A | Validation works, wrong creds show error |
| **Forgot Password** | PASS | N/A | N/A | N/A | N/A | N/A | No user feedback (MAJ-8) |
| **Dashboard** | PASS | N/A | N/A | PASS | N/A | N/A | Chart bugs (MAJ-1, MAJ-2) |
| **Properties** | PASS | PASS | PASS | PASS | PASS | Not tested (no delete action visible) | UUID in grid (MIN-4), phone not saved (MAJ-7) |
| **Tenants** | FAIL | N/A | N/A | N/A | N/A | N/A | Page crash (CRIT-1) |
| **Leases** | PASS | PASS (3/4 tabs) | Not tested (requires tenant) | PASS (empty) | N/A | N/A | Templates tab disabled (MIN-11) |
| **Finance** | PASS | PASS (6 tabs) | FAIL (invoice disabled) | PASS (empty) | N/A | N/A | Invoice hardcoded (MAJ-5), label bugs (MIN-2) |
| **User Management** | PASS | PASS (2 tabs) | Not tested | PASS | N/A | N/A | |
| **Audit Log** | PASS | N/A | N/A | PASS | N/A | N/A | Filter labels wrong (MIN-3) |
| **Communication** | PASS | PASS (1/2 tabs) | PASS (issues + comments) | PASS | PASS (status) | N/A | Real backend issues flow now exists; Broadcast tab still disabled |
| **Maintenance** | PASS | N/A | PASS | PASS | FAIL (disabled) | N/A | Status "Unknown" (MAJ-9), update broken (CRIT-5) |
| **Settlement** | PASS | PASS (3 tabs) | Not tested | PASS | N/A | N/A | Mobile money dialog works |

---

## Test Protocol for Agents

Use this protocol when running QA tests against any ProptiOS environment. The test runs in **5 strict phases** executed in order. Do NOT mix phases — complete all creates before any reads, all reads before any updates, etc.

### Environment Setup

1. Target the correct environment URL (staging, local, production)
2. Use Playwright MCP browser tools for all interactions
3. Create a fresh test account via registration if possible — do not reuse existing accounts
4. Record the test account credentials for the session
5. Keep a running list of every entity you create (name, ID, page) — you will need it for Update, Delete, and final Read phases

### Pre-Test: Authentication

Before starting the 5 phases, complete the auth flow:

1. **Register** a new account:
   - Navigate to `/login/`, click "Create an account"
   - Fill every field: name, ID card upload, country, currency, company, site domain, email, password
   - Submit with empty fields first to verify validation fires
   - After submit, check the verification page behavior
   - Record: email and password used

2. **Login** with the new account:
   - Test empty fields → validation
   - Test wrong password → error message
   - Test correct credentials → dashboard redirect
   - Verify dashboard loads with user initials in top-right

3. **Forgot Password** — navigate to `/forgot-password/`, enter email, click send, record what feedback appears

---

### PHASE 1: CREATE — Create everything first

Go through every page and sub-page. Click every "Add" / "Create" button. Fill forms completely and submit. Do this for ALL modules before moving to Phase 2.

#### 1.1 Properties
- [ ] Navigate to `/properties/` > management tab
- [ ] Click "Add Property" — fill all fields (name, email, address, country, phone, type, units)
- [ ] Submit and verify success toast
- [ ] Click into the created property
- [ ] Go to **Units** tab → click "Add Unit" → fill and submit
- [ ] Go to **Maintenance** tab → click "Add Maintenance Request" → fill title, description, select unit, select owner → submit
- [ ] Go to **Leases** tab → click "Create Lease" if available → fill and submit
- [ ] Go to **Tenants** tab → check if "Add Tenant" exists → fill and submit
- [ ] Go to **Marketing** tab → check for any create actions
- [ ] Go to **Settings** tab → note the current values (you'll edit these in Phase 3)

#### 1.2 Tenants (top-level)
- [ ] Navigate to `/tenants/`
- [ ] If page loads: click "Add Tenant" → fill and submit
- [ ] If page crashes: record the crash and skip

#### 1.3 Leases (top-level)
- [ ] Navigate to `/leases/` > management tab
- [ ] Click "Create Lease" → fill all fields → submit
- [ ] Check **compose** tab for any create actions
- [ ] Check **overview** tab for any create actions

#### 1.4 Finance
- [ ] Navigate to `/finance/`
- [ ] **rent payments** tab → click "Create Invoice" → attempt to fill and submit
- [ ] **expenses** tab → check for "Add Expense" or create actions → attempt
- [ ] **settlement** tab:
  - [ ] Transfer sub-tab → click "Set Primary Settlement Account" if shown
  - [ ] Accounts sub-tab → click "Manage" on Mobile Money → fill number and provider → submit
  - [ ] Accounts sub-tab → click "Manage" on Bank Account → fill and submit
- [ ] **statements** tab → check for create actions
- [ ] **reports** tab → check for create actions

#### 1.5 User Management
- [ ] Navigate to `/users/`
- [ ] **Invite Users** tab → fill name, role, email → click "Invite User" → verify
- [ ] **Manage Users** tab → check for any create actions

#### 1.6 Communication
- [ ] Navigate to `/communication/`
- [ ] Click "Create new Issue" → fill title and description → submit
- [ ] Click on the created issue → add a comment in the comment box → click Send
- [ ] Try "Attach File" on a comment

#### 1.7 Audit Log
- [ ] Navigate to `/audit/` — no create actions expected, but verify the page loads

**At the end of Phase 1, you should have created at minimum:**
- 1 property
- 1 unit (inside the property)
- 1 maintenance request (inside the property)
- 1 lease (if the form works)
- 1 tenant (if the page works)
- 1 invoice (if the form works)
- 1 settlement account (if the form works)
- 1 invited user
- 1 communication issue
- 1 comment on an issue

Record every created entity with its name/ID and the page where it lives.

---

### PHASE 2: READ — Read everything you created

Traverse every page, sub-page, and tab. Verify every entity created in Phase 1 is visible and displays correct data.

#### 2.1 Dashboard
- [ ] Navigate to `/dashboard/`
- [ ] Scroll the full page
- [ ] Verify stat cards reflect the entities you created (Total tenants, Units Occupied, Total units, Total Properties)
- [ ] Check Revenue Growth chart renders
- [ ] Check Earning Reports tabs (revenue, expenses, income, maintenance) — click each
- [ ] Check Rent Payments chart renders

#### 2.2 Properties
- [ ] Navigate to `/properties/` > **overview** tab
- [ ] Verify summary cards show updated counts (tenants, leases, units, maintenance, applicants, vacant units, expiring leases)
- [ ] Switch to **management** tab
- [ ] Verify the property you created is in the grid with correct name, address, type, units, status
- [ ] Click the property row to open detail view
- [ ] **Overview** sub-tab: verify unit count, tenant count, maintenance count, applicant count
- [ ] **Tenants** sub-tab: verify tenant appears if one was created
- [ ] **Units** sub-tab: verify the unit you created appears with correct name
- [ ] **Leases** sub-tab: verify lease appears if one was created
- [ ] **Maintenance** sub-tab: verify the request you created appears with correct title, unit, status
- [ ] **Marketing** sub-tab: note what's displayed
- [ ] **Settings** sub-tab: verify all property fields match what you entered

#### 2.3 Tenants (top-level)
- [ ] Navigate to `/tenants/`
- [ ] Verify tenant appears if created, with correct data

#### 2.4 Leases (top-level)
- [ ] Navigate to `/leases/`
- [ ] **overview** tab: check counts
- [ ] **compose** tab: check content
- [ ] **management** tab: verify lease appears if created

#### 2.5 Finance
- [ ] Navigate to `/finance/`
- [ ] **overview** tab: check Expenses, Revenue, Settlements, Profit cards
- [ ] **rent payments** tab: verify invoice/transaction appears if created
- [ ] **expenses** tab: verify expense appears if created
- [ ] **settlement** tab:
  - [ ] Transfer sub-tab: check balance and primary account
  - [ ] History sub-tab: check for settlement history
  - [ ] Accounts sub-tab: verify the accounts you set up appear
- [ ] **statements** tab: check content
- [ ] **reports** tab: check content

#### 2.6 User Management
- [ ] Navigate to `/users/`
- [ ] **Manage Users** tab: verify the invited user appears

#### 2.7 Audit Log
- [ ] Navigate to `/audit/`
- [ ] Verify all your create actions from Phase 1 are logged with correct user, action type, description, timestamp
- [ ] Count audit entries — should match the number of creates you performed

#### 2.8 Communication
- [ ] Navigate to `/communication/`
- [ ] Verify the issue you created appears in the list
- [ ] Click on it — verify description, status, reporter name
- [ ] Verify the comment you posted appears with correct text and timestamp

---

### PHASE 3: UPDATE — Edit everything you created

Go back through every entity and modify it. Verify changes persist.

#### 3.1 Properties
- [ ] Navigate to the property detail > **Settings** tab
- [ ] Change the property name (append " Updated")
- [ ] Change the address
- [ ] Click "Save Changes"
- [ ] Verify success toast
- [ ] Reload the page — verify changes persisted
- [ ] Check if the sidebar/header reflects the new name (it should)

#### 3.2 Property > Units
- [ ] Go to the **Units** tab
- [ ] Click actions menu on the unit row → "Manage"
- [ ] Edit the unit name → submit
- [ ] Verify the grid reflects the change

#### 3.3 Property > Maintenance
- [ ] Go to the **Maintenance** tab
- [ ] Click actions menu → "Manage"
- [ ] Try to edit title or description → submit
- [ ] If submit is disabled, record this as a bug

#### 3.4 Tenants
- [ ] Navigate to `/tenants/`
- [ ] If the page works: click on a tenant → edit a field → save
- [ ] Verify the change persists

#### 3.5 Leases
- [ ] Navigate to `/leases/`
- [ ] If a lease exists: click on it → edit → save

#### 3.6 Finance > Settlement
- [ ] Navigate to settlement > Accounts
- [ ] Click Manage on the account you created
- [ ] Edit the number/provider → save

#### 3.7 Communication
- [ ] Navigate to `/communication/`
- [ ] Click on the issue you created
- [ ] Change the status dropdown (e.g., Open → In Progress)
- [ ] Verify the status change reflects in the issue list

#### 3.8 User Management
- [ ] Navigate to `/users/` > Manage Users
- [ ] If edit action exists on a user row → edit → save

**After every update, reload the page and verify the change persisted. If a change reverts on reload, record it as a bug.**

---

### PHASE 4: DELETE — Delete everything you created

Clean up all test data. Go through every entity you created and delete/suspend/archive it.

#### 4.1 Communication
- [ ] Navigate to `/communication/`
- [ ] Find the issue you created → look for delete/close action
- [ ] If no delete: try changing status to "Closed" or "Resolved"

#### 4.2 Property > Maintenance
- [ ] Go to the property > **Maintenance** tab
- [ ] Click actions menu on the request → look for delete/suspend
- [ ] Execute delete if available

#### 4.3 Property > Units
- [ ] Go to **Units** tab
- [ ] Click actions menu on the unit → look for delete/suspend
- [ ] Execute delete if available
- [ ] Note: deleting the last unit may violate the "min 1 unit" business rule — record what happens

#### 4.4 Leases
- [ ] Navigate to the lease → look for delete/archive/terminate action
- [ ] Execute if available

#### 4.5 Tenants
- [ ] Navigate to the tenant → look for delete/disable action
- [ ] Execute if available

#### 4.6 Finance > Settlement Accounts
- [ ] Navigate to settlement > Accounts
- [ ] Look for remove/delete on configured accounts

#### 4.7 User Management
- [ ] Navigate to `/users/` > Manage Users
- [ ] Look for disable/delete on the invited user

#### 4.8 Properties
- [ ] Navigate to `/properties/` > management tab
- [ ] Click the actions menu on the property row → look for delete/suspend
- [ ] Execute delete if available
- [ ] **Delete the property last** — after all child entities (units, maintenance, leases, tenants) are cleaned up

**For every entity, record:**
- Was a delete/suspend/archive action available? (Yes/No)
- Did a confirmation dialog appear?
- Did the entity disappear from the list?
- Was there a success message?

---

### PHASE 5: READ AGAIN — Verify clean state

After all deletes, traverse every page again to confirm entities are gone and the app is in a clean state.

#### 5.1 Dashboard
- [ ] Navigate to `/dashboard/`
- [ ] Verify stat cards returned to zero (or decremented correctly)
- [ ] Verify charts don't show ghost data

#### 5.2 Properties
- [ ] `/properties/` > overview tab — verify counts are zero/decremented
- [ ] `/properties/` > management tab — verify deleted property is gone from grid
- [ ] If property still appears, check if it shows a "deleted" or "inactive" status (soft-delete leak)

#### 5.3 Tenants
- [ ] `/tenants/` — verify deleted tenant is gone

#### 5.4 Leases
- [ ] `/leases/` — verify deleted lease is gone from all tabs

#### 5.5 Finance
- [ ] Check all finance tabs — verify deleted transactions/invoices are gone
- [ ] Settlement > Accounts — verify deleted accounts are gone

#### 5.6 User Management
- [ ] `/users/` > Manage Users — verify deleted/disabled user is gone or shows disabled status

#### 5.7 Audit Log
- [ ] `/audit/` — verify delete actions are logged
- [ ] The audit log should show both the create AND delete entries — the log itself should never lose entries

#### 5.8 Communication
- [ ] `/communication/` — verify deleted/closed issue is gone or shows closed status

**If any deleted entity still appears in a list, this is a soft-delete leak bug — record it with the exact route and entity.**

---

### Recording Format

For every action across all 5 phases, record findings in this format:

```
### [PHASE] [Module] > [Sub-page] > [Tab]
- **Route**: /exact/url/
- **Action**: What was clicked/typed
- **Expected**: What should happen
- **Actual**: What actually happened
- **Console errors**: Any new errors (or "None")
- **Status**: PASS / FAIL / BLOCKED / INFO
```

### Naming Convention for Test Data

Use names that are obviously test data and include the date:
- Properties: `QA Property YYYY-MM-DD`
- Units: `QA Unit YYYY-MM-DD`
- Tenants: `QA Tenant YYYY-MM-DD`
- Leases: `QA Lease YYYY-MM-DD`
- Issues: `QA Issue YYYY-MM-DD`
- Emails: `qa-YYYY-MM-DD@proptios.com`

### Common Pitfalls

- **Wait after navigation** — pages take 3-5 seconds to load. Always use `wait_for` with 3-4 seconds after `navigate`, then take a snapshot. Never act on a loading/blank page.
- **Auth state loss** — if a page shows only a spinner or `img` + `alert`, wait longer. If it persists, navigate back to `/dashboard/` to re-establish auth, then retry.
- **Sidebar navigation** — only visible after clicking the hamburger menu (first button in the top bar).
- **Dropdown labels are wrong** — many dropdowns have incorrect accessible names (e.g., Currency labeled "Country"). Use snapshot `ref` values to target elements, not role/name queries.
- **File upload** — click the upload button first to trigger the file chooser dialog, then use `browser_file_upload` with the file path.
- **Devtools click nuance** — in Chrome devtools snapshots, clicking a link can focus it first and trigger field blur validation before activation. If the URL does not change immediately, confirm with `Enter` on the focused link or a real Playwright/browser click before recording it as a product bug.
- **Console noise** — `"user is empty here:: null"` and `/auth/me` 500 errors fire on every navigation. These are known issues — only record NEW console errors you haven't seen before.
- **No delete actions** — many modules don't have visible delete buttons. Record this as "DELETE: No action available" rather than skipping silently.
- **Disabled buttons** — some submit/save buttons are intentionally disabled (invoice Send, maintenance update Submit). Check for warning alerts explaining why.
