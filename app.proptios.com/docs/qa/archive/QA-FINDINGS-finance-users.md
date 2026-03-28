# Finance / Users QA Findings

_Last updated: 2026-03-23_

## Environment
- Frontend: `http://localhost:3000`
- API: `http://localhost:2024`
- User: `joel@example.com`
- Scope: `/finance`, finance subtabs/actions, `/users`, user manage/detail flows

## 2026-03-23

### 1. `/finance/payments` route load
- Route tested: `/finance/payments`
- Action tested: Initial page load after authenticated session bootstrap
- Expected result: Finance payments tab renders rent transactions and primary actions without crashing
- Actual result: The page loaded and rendered 7 visible rent-transaction rows with the expected finance tabs and toolbar actions
- Result: Pass
- Relevant file/component: `src/pages/finance/[tab].js`, `src/ui/finance/ParentFinanceViewRight.js`, `src/ui/finance/FinanceRentTransactionListTable.js`

### 2. `/finance/payments` quick search does not filter rows
- Route tested: `/finance/payments`
- Action tested: Entered `nonexistent-finance-term` in Quick Search
- Expected result: Grid should narrow to 0 visible rows for a term that matches nothing
- Actual result: The grid stayed at 7 visible rows before and after the search input change
- Result: Fail
- Relevant file/component: `src/ui/finance/FinanceRentTransactionListTable.js:255`, `src/ui/finance/FinanceRentTransactionListTable.js:270`, `src/ui/finance/FinanceRentTransactionListTable.js:354`

### 3. `/finance/expenses` renders an empty table despite finance data existing in payments
- Route tested: `/finance/expenses`
- Action tested: Opened Expenses tab from an authenticated session
- Expected result: Expenses tab should render expense records or a justified empty state backed by expense-specific data loading
- Actual result: The tab rendered `We couldn't find any data` while `/finance/payments` in the same session had live finance records. Static review matches this: `ParentFinanceViewExpenses` renders `<FinanceExpensesTable>` without passing `financeData`
- Result: Fail
- Relevant file/component: `src/ui/finance/ParentFinanceViewExpenses.js:22`, `src/ui/finance/ParentFinanceViewExpenses.js:28`, `src/ui/finance/FinanceExpensesTable.js`

### 4. `/finance/statements` shows an empty grid plus a server error banner
- Route tested: `/finance/statements`
- Action tested: Opened Statements tab from an authenticated session
- Expected result: Statements tab should render historical finance records or a clean empty state without contradictory error messaging
- Actual result: The tab rendered `We couldn't find any data` and also showed `Server Error: Failed to calculate accounting data`
- Result: Fail
- Relevant file/component: `src/ui/finance/ParentFinanceViewStatements.js:51`, `src/ui/finance/ParentFinanceViewStatements.js:161`, `src/ui/finance/FinanceStatementsTable.js:243`

### 5. `/finance/receipt/view/:id` receipt detail flow is blank from the payments table
- Route tested: `/finance/receipt/view/bb2c7290-b6e5-48ae-b590-f66707d7d3bf`
- Action tested: Opened the first transaction link from `/finance/payments`
- Expected result: Receipt detail page should render receipt content and its side actions
- Actual result: The route loaded the app shell only; no receipt body, preview content, or actions were visible
- Result: Fail
- Relevant file/component: `src/pages/finance/receipt/view/[id].js:16`, `src/pages/finance/receipt/view/[id].js:29`, `src/pages/finance/receipt/view/[id].js:52`

### 6. `/finance/invoice/create` create flow opens
- Route tested: `/finance/invoice/create`
- Action tested: Opened Create Invoice from the finance area
- Expected result: Invoice creation UI should render a usable form shell
- Actual result: The page loaded and rendered the invoice editor layout with invoice metadata, line items, and action buttons (`SEND INVOICE`, `PREVIEW`, `SAVE`)
- Result: Pass
- Relevant file/component: `src/pages/finance/invoice/create/index.js`, `src/views/apps/invoice/add/*`

### 7. `/finance/settlement` subtab load
- Route tested: `/finance/settlement`
- Action tested: Opened Settlement tab
- Expected result: Settlement summary and configuration controls should render without a crash
- Actual result: The tab loaded and showed balance, primary settlement account, next settlement date, settlement frequency, and `CHANGE FREQUENCY`
- Result: Pass
- Relevant file/component: `src/ui/finance/ParentFinanceViewSettlement.js`

### 8. `/finance/reports` subtab load
- Route tested: `/finance/reports`
- Action tested: Opened Reports tab
- Expected result: Report catalog should render without a crash
- Actual result: The tab loaded and displayed the report-card content for Income, Cash Flow, and Performance sections
- Result: Pass
- Relevant file/component: `src/ui/finance/ParentFinanceViewReports.js`

### 9. `/users/manage` route load
- Route tested: `/users/manage`
- Action tested: Initial page load after authenticated session bootstrap
- Expected result: Manage Users table should render current user rows and controls
- Actual result: The page loaded and rendered 3 user rows with filters and action column
- Result: Pass
- Relevant file/component: `src/pages/users/[tab].js`, `src/ui/user/ParentUserViewRight.js`, `src/ui/user/UserManageTable.js`

### 10. `/users/manage` quick search only matches email, not visible user names
- Route tested: `/users/manage`
- Action tested: Entered `Main` in Quick Search while `Joel Main` was visible in the table
- Expected result: Quick Search should match the visible user name and keep `Joel Main` in the results
- Actual result: The table dropped to `0–0 of 0` and showed `We couldn't find any data`, which means name-based search is not working
- Result: Fail
- Relevant file/component: `src/ui/user/UserManageTable.js:435`, `src/ui/user/UserManageTable.js:444`, `src/ui/user/UserManageTable.js:449`, `src/ui/user/UserManageTable.js:506`

### 11. `/users/manage/:id/transactions` detail flow fails for a user linked from Manage Users
- Route tested: `/users/manage/46/transactions`
- Action tested: Opened the `Joel Main` detail link from Manage Users
- Expected result: User detail page should load the user profile and transactions tab for the selected row
- Actual result: The page stayed on `Loading...` and then showed `Server Error: Failed to fetch user`
- Result: Fail
- Relevant file/component: `src/pages/users/manage/[id]/[tab].js:14`, `src/pages/users/manage/[id]/[tab].js:17`, `src/pages/users/manage/[id]/[tab].js:32`, `src/context/UsersContext.js:80`

### 12. `/users/invite` create flow submission not executed
- Route tested: `/users/invite`
- Action tested: Invite-user submission
- Expected result: Create flow should be exercised if safe to mutate in local QA
- Actual result: I did not submit this form because it may send a real external invitation email; that is outside the approved safe-to-do list for this workspace without explicit approval
- Result: Suspect
- Relevant file/component: `src/ui/user/ParentUserViewInviteUsers.js`

## Notes
- No code changes were made during this QA pass.
- Browser verification was done against the live local stack with an authenticated session injected after API login.
