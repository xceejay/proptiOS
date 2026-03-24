const { test, expect } = require('./helpers/fixtures')

test.describe('Finance', () => {
  test('payments tab loads transaction data', async ({ page }) => {
    await page.goto('/finance/payments')

    // Wait for data to load
    const content = page.locator('.MuiDataGrid-root, [class*="MuiCard"]')
    await expect(content.first()).toBeVisible({ timeout: 15000 })
  })

  test('navigate between finance tabs and verify each loads', async ({ page }) => {
    await page.goto('/finance')
    await page.getByRole('tab').first().waitFor({ timeout: 15000 })

    // Get all tab names
    const tabs = page.getByRole('tab')
    const tabCount = await tabs.count()

    for (let i = 0; i < tabCount; i++) {
      const tab = tabs.nth(i)
      const tabName = await tab.textContent()

      await tab.click()
      await page.waitForTimeout(1000)

      // Each tab should render some content (not a blank page)
      const content = page.locator(
        '.MuiDataGrid-root, [class*="MuiCard"], [class*="MuiTypography"], canvas, .apexcharts-canvas'
      )
      await expect(content.first()).toBeVisible({
        timeout: 10000,
      })
    }
  })

  test('expense table has correct columns', async ({ page }) => {
    await page.goto('/finance/expenses')

    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    await expect(page.getByRole('columnheader', { name: /description/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /amount/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /status/i })).toBeVisible()
  })
})
