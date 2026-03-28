const { test, expect } = require('./helpers/fixtures')

test.describe('Fresh Account Empty States', () => {
  test('properties overview shows zero-state stat cards for a brand new account', async ({ page }) => {
    await page.goto('/properties/overview')

    await expect(page.getByRole('heading', { name: 'Total Tenants', exact: true })).toBeVisible({ timeout: 15000 })
    await expect(page.getByRole('heading', { name: 'Active Tenants', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Total Leases', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Maintenance Requests', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Pending Maintenance Requests', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Total Applicants', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Vacant Units', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Leases Expiring Soon', exact: true })).toBeVisible()
    await expect(page.getByText('Add your first property to get started')).toHaveCount(8)
  })

  test('tenants management loads safely with an empty-state message for a brand new account', async ({ page }) => {
    await page.goto('/tenants/management')

    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })
    await expect(page.getByRole('button', { name: /^add tenant$/i })).toBeVisible()
    await expect(page.getByText("We couldn't find any data")).toBeVisible()
    await expect(page.getByText('Runtime TypeError')).toHaveCount(0)
  })
})
