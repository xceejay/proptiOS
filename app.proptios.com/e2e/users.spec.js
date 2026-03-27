const { test, expect } = require('./helpers/fixtures')

test.describe('User Management', () => {
  test('user list shows the current logged-in user', async ({ page }) => {
    await page.goto('/users')

    // Users page has tabs: "Invite Users" and "Manage Users"
    // Click "Manage Users" tab to show the DataGrid
    const manageTab = page.getByRole('tab', { name: /manage users/i })
    await expect(manageTab).toBeVisible({ timeout: 15000 })
    await manageTab.click()

    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    // The logged-in user (joel@example.com) should appear in the list
    await expect(page.getByText('joel@example.com')).toBeVisible({ timeout: 10000 })
  })

  test('user list columns include name and role', async ({ page }) => {
    await page.goto('/users')

    const manageTab = page.getByRole('tab', { name: /manage users/i })
    await expect(manageTab).toBeVisible({ timeout: 15000 })
    await manageTab.click()

    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    await expect(page.getByRole('columnheader', { name: /name/i }).first()).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /role/i }).first()).toBeVisible()
  })
})
