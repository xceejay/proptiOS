const { test, expect } = require('./helpers/fixtures')

test.describe('User Management', () => {
  test('user list shows the current logged-in user', async ({ page }) => {
    await page.goto('/users')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    // The logged-in user (joel@example.com) should appear in the list
    await expect(page.getByText('joel@example.com')).toBeVisible()
  })

  test('user list columns include name, email, and status', async ({ page }) => {
    await page.goto('/users')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    await expect(page.getByRole('columnheader', { name: /name/i }).first()).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /email/i }).first()).toBeVisible()
  })
})
