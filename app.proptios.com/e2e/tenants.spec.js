const { test, expect } = require('./helpers/fixtures')

const TIMESTAMP = Date.now()
const TEST_TENANT = {
  name: `E2E Tenant ${TIMESTAMP}`,
  email: `e2e-tenant-${TIMESTAMP}@example.com`,
  address: '456 Playwright Ave, Kumasi',
  phone: '+233200000088',
}

test.describe.serial('Tenants CRUD', () => {
  test('CREATE — add a new tenant and verify invitation is sent', async ({ page }) => {
    await page.goto('/tenants/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    // Intercept the POST
    const postPromise = page.waitForResponse(
      res => res.url().includes('/tenants') && res.request().method() === 'POST'
    )

    // Open add drawer
    await page.getByRole('button', { name: /add new tenant/i }).click()
    await expect(page.getByText('Add Tenant').first()).toBeVisible()

    // Fill form
    await page.getByLabel('Full name').fill(TEST_TENANT.name)
    await page.getByLabel('Email').fill(TEST_TENANT.email)
    await page.getByLabel('Address').fill(TEST_TENANT.address)
    await page.getByLabel('Phone Number').fill(TEST_TENANT.phone)

    // Submit
    await page.getByRole('button', { name: /^submit$/i }).click()

    // Verify POST succeeded
    const response = await postPromise
    expect(response.status()).toBeLessThan(400)

    // Success toast — invitation email sent
    await expect(page.getByText(/invitation email has been sent/i)).toBeVisible({ timeout: 10000 })

    // Drawer should close
    await expect(page.getByLabel('Full name')).not.toBeVisible({ timeout: 5000 })

    // New tenant should appear in the table
    await expect(page.getByText(TEST_TENANT.name)).toBeVisible({ timeout: 5000 })
  })

  test('READ — search and verify tenant data in the table', async ({ page }) => {
    await page.goto('/tenants/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    // Search
    await page.getByPlaceholder('Quick Search').fill(TEST_TENANT.name)
    await page.waitForTimeout(500)

    // Verify row has correct data
    const row = page.locator('[role="row"]', { hasText: TEST_TENANT.name })
    await expect(row).toBeVisible()
    await expect(row.getByText(TEST_TENANT.email)).toBeVisible()
  })

  test('UPDATE — edit tenant name via row action menu', async ({ page }) => {
    await page.goto('/tenants/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    // Find test tenant row and open action menu
    const row = page.locator('[role="row"]', { hasText: TEST_TENANT.name })
    await expect(row).toBeVisible({ timeout: 10000 })
    await row.locator('button:has(svg)').last().click()

    // Click Edit
    await page.getByRole('menuitem', { name: 'Edit' }).click()

    // Edit drawer should open with pre-filled data
    await expect(page.getByText('Edit Tenant').first()).toBeVisible({ timeout: 5000 })
    const nameField = page.getByLabel('Tenant Name')
    await expect(nameField).toHaveValue(TEST_TENANT.name)

    // Intercept the PUT
    const putPromise = page.waitForResponse(
      res => res.url().includes('/tenants') && res.request().method() === 'PUT'
    )

    // Change the address
    const addressField = page.getByLabel('Tenant Address')
    await addressField.clear()
    await addressField.fill('789 Updated Road, Accra')

    // Submit
    await page.getByRole('button', { name: /edit tenant/i }).click()

    // Verify PUT succeeded
    const putResponse = await putPromise
    expect(putResponse.status()).toBeLessThan(400)

    // Success toast
    await expect(page.getByText(/change applied/i)).toBeVisible({ timeout: 10000 })
  })

  test('READ DETAIL — navigate to tenant detail page', async ({ page }) => {
    await page.goto('/tenants/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    // Find test tenant and open action menu
    const row = page.locator('[role="row"]', { hasText: TEST_TENANT.name })
    await expect(row).toBeVisible({ timeout: 10000 })
    await row.locator('button:has(svg)').last().click()

    // Click View — navigates to /tenants/manage/:id/summary
    await page.getByRole('menuitem', { name: 'View' }).click()
    await expect(page).toHaveURL(/\/tenants\/manage\/\d+/, { timeout: 10000 })

    // Detail page should have tabs
    await expect(page.getByRole('tab').first()).toBeVisible({ timeout: 10000 })
  })

  test('DELETE — delete tenant via row action menu', async ({ page }) => {
    await page.goto('/tenants/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const row = page.locator('[role="row"]', { hasText: TEST_TENANT.name })
    await expect(row).toBeVisible({ timeout: 10000 })

    // Accept the confirmation dialog
    page.on('dialog', dialog => dialog.accept())

    // Open action menu and click Delete Account
    await row.locator('button:has(svg)').last().click()
    await page.getByRole('menuitem', { name: /delete account/i }).click()

    // Verify DELETE API call and success
    await expect(page.getByText(/tenant deleted successfully/i)).toBeVisible({ timeout: 10000 })

    // Tenant should no longer appear
    await expect(row).not.toBeVisible({ timeout: 5000 })
  })

  test('VALIDATE — form rejects invalid email', async ({ page }) => {
    await page.goto('/tenants/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    await page.getByRole('button', { name: /add new tenant/i }).click()

    await page.getByLabel('Full name').fill('Bad Email Tenant')
    await page.getByLabel('Email').fill('not-an-email')

    // Trigger validation by tabbing away
    await page.getByLabel('Full name').click()

    await expect(page.getByText(/must be a valid email/i)).toBeVisible({ timeout: 3000 })
  })
})
