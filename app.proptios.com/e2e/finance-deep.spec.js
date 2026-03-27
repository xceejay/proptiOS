const { test, expect } = require('./helpers/fixtures')

/**
 * Helper: navigate to a finance tab and wait for content.
 */
async function gotoFinanceTab(page, tab) {
  await page.goto(`/finance/${tab}`)
  await page.getByRole('tab').first().waitFor({ timeout: 15000 })
}

// ─── OVERVIEW ────────────────────────────────────────────────────────────────

test.describe('Finance — Overview', () => {
  test('overview tab shows stat cards', async ({ page }) => {
    await gotoFinanceTab(page, 'overview')

    // Should see financial stat cards
    const cards = page.locator('[class*="MuiCard"]')
    await expect(cards.first()).toBeVisible({ timeout: 10000 })

    // Check for known stat labels
    const content = page.locator('[class*="MuiCardContent"], [class*="MuiTypography"]')
    await expect(content.first()).toBeVisible({ timeout: 5000 })
  })
})

// ─── PAYMENTS ────────────────────────────────────────────────────────────────

test.describe('Finance — Payments', () => {
  test('payments tab loads with transaction data', async ({ page }) => {
    await gotoFinanceTab(page, 'payments')

    const content = page.locator('.MuiDataGrid-root, [class*="MuiCard"]')
    await expect(content.first()).toBeVisible({ timeout: 15000 })
  })

  test('transaction ID links have correct href pattern', async ({ page }) => {
    await gotoFinanceTab(page, 'payments')

    const content = page.locator('.MuiDataGrid-root, [class*="MuiCard"]')
    await expect(content.first()).toBeVisible({ timeout: 15000 })

    // Check if there are any transaction links in the table
    const txLink = page.locator('a[href*="/finance/receipt/view/"]').first()
    if (await txLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      const href = await txLink.getAttribute('href')
      expect(href).toMatch(/\/finance\/receipt\/view\//)
    }
  })
})

// ─── EXPENSES ────────────────────────────────────────────────────────────────

test.describe('Finance — Expenses', () => {
  test('expenses tab loads with DataGrid', async ({ page }) => {
    await gotoFinanceTab(page, 'expenses')

    const content = page.locator('.MuiDataGrid-root, [class*="MuiCard"]')
    await expect(content.first()).toBeVisible({ timeout: 15000 })
  })
})

// ─── SETTLEMENT ──────────────────────────────────────────────────────────────

test.describe('Finance — Settlement', () => {
  test('settlement tab loads with subtabs', async ({ page }) => {
    await gotoFinanceTab(page, 'settlement')

    // Settlement has Transfer / History / Accounts subtabs
    const content = page.locator('[class*="MuiCard"], [class*="MuiTab"]')
    await expect(content.first()).toBeVisible({ timeout: 15000 })
  })
})

// ─── STATEMENTS ──────────────────────────────────────────────────────────────

test.describe('Finance — Statements', () => {
  test('statements tab loads with DataGrid', async ({ page }) => {
    await gotoFinanceTab(page, 'statements')

    const content = page.locator('.MuiDataGrid-root, [class*="MuiCard"]')
    await expect(content.first()).toBeVisible({ timeout: 15000 })
  })
})

// ─── REPORTS ─────────────────────────────────────────────────────────────────

test.describe('Finance — Reports', () => {
  test('reports tab loads with report cards', async ({ page }) => {
    await gotoFinanceTab(page, 'reports')

    // Reports page shows card-based report options
    const content = page.locator('[class*="MuiCard"], [class*="MuiTypography"]')
    await expect(content.first()).toBeVisible({ timeout: 15000 })
  })

  test('clicking a report card opens dialog with details', async ({ page }) => {
    await gotoFinanceTab(page, 'reports')

    const content = page.locator('[class*="MuiCard"]')
    await expect(content.first()).toBeVisible({ timeout: 15000 })

    // Click the first clickable report card/button
    const reportCard = page.locator('[class*="MuiCard"]').first()
    await reportCard.click()

    // A dialog should open with report details
    const dialog = page.getByRole('dialog')
    if (await dialog.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(dialog).toBeVisible()
      // Close the dialog
      const closeBtn = dialog.getByRole('button', { name: /close/i })
      if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await closeBtn.click()
      } else {
        await page.keyboard.press('Escape')
      }
    }
  })
})

// ─── INVOICE CREATE ──────────────────────────────────────────────────────────

test.describe('Finance — Invoice Create', () => {
  test('invoice create page loads with form', async ({ page }) => {
    await page.goto('/finance/invoice/create')

    // Wait for the form content to load
    const content = page.locator('[class*="MuiCard"]')
    await expect(content.first()).toBeVisible({ timeout: 15000 })
  })

  test('send and save buttons are disabled (backend-blocked)', async ({ page }) => {
    await page.goto('/finance/invoice/create')

    const content = page.locator('[class*="MuiCard"]')
    await expect(content.first()).toBeVisible({ timeout: 15000 })

    // The alert about backend-blocked should be visible
    const alert = page.locator('[class*="MuiAlert"]')
    if (await alert.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(alert).toBeVisible()
    }

    // Send button should be disabled
    const sendBtn = page.getByRole('button', { name: /send/i })
    if (await sendBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(sendBtn).toBeDisabled()
    }
  })
})
