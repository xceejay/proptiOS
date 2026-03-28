const { test, expect } = require('./helpers/fixtures')

test.describe('Finance', () => {
  test('payments tab loads transaction data', async ({ page }) => {
    await page.goto('/finance/payments')

    const content = page.locator('.MuiDataGrid-root, [class*="MuiCard"]')
    await expect(content.first()).toBeVisible({ timeout: 15000 })
  })

  test('finance page has visible tabs', async ({ page }) => {
    await page.goto('/finance')

    await page.getByRole('tab').first().waitFor({ timeout: 15000 })
    const tabCount = await page.getByRole('tab').count()
    expect(tabCount).toBeGreaterThan(0)

    // Click the first two tabs to verify they load content
    for (let i = 0; i < Math.min(tabCount, 3); i++) {
      await page.getByRole('tab').nth(i).click({ force: true })
      await page.waitForTimeout(500)

      const content = page.locator(
        '.MuiDataGrid-root, [class*="MuiCard"], [class*="MuiTypography"], canvas, .apexcharts-canvas'
      )
      await expect(content.first()).toBeVisible({ timeout: 10000 })
    }
  })
})
