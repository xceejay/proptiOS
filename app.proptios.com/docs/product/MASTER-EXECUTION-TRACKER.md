# Master Execution Tracker

_Last updated: 2026-03-28_

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

---

## 1. Recently Fixed

### Fresh-account and onboarding issues

- Onboarding submit without agreeing to terms no longer leaves the loader stuck
- Tenants management no longer crashes for brand-new accounts
- Properties overview now renders zero-state cards instead of going blank
- Tenant list row actions now support:
  - resend invite
  - enable account
  - disable account
- Property creation now:
  - auto-creates the first default unit
  - enforces a minimum of 1 allocated unit
  - exposes default unit rent messaging in the add/edit drawers
- Units now have a dedicated detail screen reachable from the property Units tab
- New regression tests cover:
  - onboarding terms guard
  - fresh-account empty states
  - dedicated unit detail navigation

### E2E reliability improvements

- onboarding-mode setup now creates a fresh staging user reliably
- guest-route auth no longer incorrectly redirects `/register` to `/login`
- properties cross-cutting tests no longer depend on seeded property data
- tenant empty-state coverage now exists

---

## 2. Active QA Bugs Still Worth Fixing

These are the items that still look open or only partially verified.

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
