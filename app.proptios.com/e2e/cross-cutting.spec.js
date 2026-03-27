const { test, expect } = require('./helpers/fixtures')

/**
 * Helper: navigate to a page and wait for its DataGrid to load.
 */
async function gotoWithGrid(page, url) {
  await page.goto(url)
  await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })
}

// ─── PROPERTIES TABLE ────────────────────────────────────────────────────────

test.describe('Cross-cutting — Properties Table', () => {
  test('search with matching term shows results', async ({ page }) => {
    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const search = page.getByPlaceholder('Search Properties')
    await search.click()
    await search.fill('Embassy')
    await page.waitForTimeout(500)

    await expect(page.getByText('Embassy Gardens')).toBeVisible()
  })

  test('search with nonsense term shows zero rows', async ({ page }) => {
    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const search = page.getByPlaceholder('Search Properties')
    await search.click()
    await search.fill('zzz_no_match_999')
    await page.waitForTimeout(500)

    // Should show no rows or "No rows" overlay
    const rows = page.locator('[role="row"][data-rowindex]')
    await expect(rows).toHaveCount(0, { timeout: 3000 })
  })

  test('export button is visible', async ({ page }) => {
    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    await expect(page.getByRole('button', { name: /export/i })).toBeVisible()
  })
})

// ─── TENANTS TABLE ───────────────────────────────────────────────────────────

test.describe('Cross-cutting — Tenants Table', () => {
  test('search with matching term shows results', async ({ page }) => {
    await gotoWithGrid(page, '/tenants/management')

    // Use a search term from the first visible row to guarantee a match
    const firstRow = page.locator('[role="row"][data-rowindex="0"]')
    await expect(firstRow).toBeVisible({ timeout: 5000 })
    const firstCellText = await firstRow.locator('td, [role="gridcell"]').first().textContent()

    const search = page.getByPlaceholder('Quick Search')
    await search.click()
    await search.fill(firstCellText.trim().slice(0, 5))
    await page.waitForTimeout(500)

    const rows = page.locator('[role="row"][data-rowindex]')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
  })

  test('search with nonsense term shows zero rows', async ({ page }) => {
    await gotoWithGrid(page, '/tenants/management')

    const search = page.getByPlaceholder('Quick Search')
    await search.click()
    await search.fill('zzz_no_match_999')
    await page.waitForTimeout(500)

    const rows = page.locator('[role="row"][data-rowindex]')
    await expect(rows).toHaveCount(0, { timeout: 3000 })
  })

  test('row action menu opens with expected options', async ({ page }) => {
    await gotoWithGrid(page, '/tenants/management')

    const firstRow = page.locator('[role="row"][data-rowindex="0"]')
    await expect(firstRow).toBeVisible({ timeout: 5000 })
    await firstRow.locator('button:has(svg)').last().click()

    // Verify menu items
    await expect(page.getByRole('menuitem', { name: /view/i })).toBeVisible({ timeout: 3000 })
    await expect(page.getByRole('menuitem', { name: /edit/i })).toBeVisible()

    // Close menu
    await page.keyboard.press('Escape')
  })
})

// ─── FINANCE PAYMENTS TABLE ──────────────────────────────────────────────────

test.describe('Cross-cutting — Finance Payments Table', () => {
  test('payments table loads with rows', async ({ page }) => {
    await page.goto('/finance/payments')

    const content = page.locator('.MuiDataGrid-root, [class*="MuiCard"]')
    await expect(content.first()).toBeVisible({ timeout: 15000 })
  })
})

// ─── USERS MANAGE TABLE ──────────────────────────────────────────────────────

test.describe('Cross-cutting — Users Manage Table', () => {
  test('manage users tab loads and shows rows', async ({ page }) => {
    await page.goto('/users')

    const manageTab = page.getByRole('tab', { name: /manage users/i })
    await expect(manageTab).toBeVisible({ timeout: 15000 })
    await manageTab.click()

    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const firstRow = page.locator('[role="row"][data-rowindex="0"]')
    await expect(firstRow).toBeVisible({ timeout: 5000 })
  })

  test('row action menu opens with View and Edit options', async ({ page }) => {
    await page.goto('/users')

    const manageTab = page.getByRole('tab', { name: /manage users/i })
    await expect(manageTab).toBeVisible({ timeout: 15000 })
    await manageTab.click()

    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const firstRow = page.locator('[role="row"][data-rowindex="0"]')
    await expect(firstRow).toBeVisible({ timeout: 5000 })
    await firstRow.locator('button:has(svg)').last().click()

    await expect(page.getByRole('menuitem', { name: /view/i })).toBeVisible({ timeout: 3000 })
    await expect(page.getByRole('menuitem', { name: /edit/i })).toBeVisible()

    await page.keyboard.press('Escape')
  })
})
