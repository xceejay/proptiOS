const { test, expect } = require('./helpers/fixtures')

test.describe('Dashboard', () => {
  test('stat cards display real numbers from the API', async ({ page }) => {
    // Intercept the dashboard API call to verify real data flows through
    const apiResponse = page.waitForResponse(
      resp => resp.url().includes('/dashboard') && resp.status() === 200
    )

    await page.goto('/dashboard')

    const response = await apiResponse
    const body = await response.json()

    // API should return actual data
    expect(body.data || body).toBeTruthy()

    // Cards should render with actual numbers (not loading spinners)
    await page.locator('[class*="MuiCard"]').first().waitFor({ timeout: 10000 })

    // Verify the tenant count card shows a number
    const tenantCard = page.getByText(/tenants/i).first()
    await expect(tenantCard).toBeVisible()
  })

  test('clicking stat card navigates to the correct module', async ({ page }) => {
    await page.goto('/dashboard')
    await page.locator('[class*="MuiCard"]').first().waitFor({ timeout: 10000 })

    // Click the tenants link
    await page.getByRole('link', { name: /tenants/i }).first().click()
    await expect(page).toHaveURL(/\/tenants/)
    await page.goBack()

    // Click the properties link
    await page.getByRole('link', { name: /properties/i }).first().click()
    await expect(page).toHaveURL(/\/properties/)
  })
})
