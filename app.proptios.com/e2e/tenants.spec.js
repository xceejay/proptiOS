const { test, expect } = require('./helpers/fixtures')
const { fillField, clearAndFill } = require('./helpers/mui')

const TIMESTAMP = Date.now()
const TEST_TENANT = {
  name: `E2E Tenant ${TIMESTAMP}`,
  email: `e2e-tenant-${TIMESTAMP}@example.com`,
  address: '456 Playwright Ave, Kumasi',
  phone: '+233200000088',
}

/**
 * Helper: open the Add Tenant drawer and wait for it to be ready.
 */
async function openAddTenantDrawer(page) {
  await page.goto('/tenants/management')
  await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

  await page.getByRole('button', { name: /^add tenant$/i }).click()

  const drawer = page.getByRole('dialog')
  await expect(drawer).toBeVisible({ timeout: 5000 })
  await expect(drawer.getByRole('textbox', { name: 'Full name' })).toBeVisible({ timeout: 5000 })

  return drawer
}

test.describe.serial('Tenants CRUD', () => {
  test('CREATE — add a new tenant via the drawer form', async ({ page }) => {
    const drawer = await openAddTenantDrawer(page)

    await fillField(page, 'Full name', TEST_TENANT.name, drawer)
    await fillField(page, 'Email', TEST_TENANT.email, drawer)
    await fillField(page, 'Address', TEST_TENANT.address, drawer)
    await fillField(page, 'Phone Number', TEST_TENANT.phone, drawer)

    // Verify inputs have values before submitting
    await expect(drawer.getByRole('textbox', { name: 'Full name' })).toHaveValue(TEST_TENANT.name)
    await expect(drawer.getByRole('textbox', { name: 'Email' })).toHaveValue(TEST_TENANT.email)

    // Set up response listener before clicking submit
    const postPromise = page.waitForResponse(
      (res) => res.url().includes('/tenants') && res.request().method() === 'POST'
    )

    await drawer.getByRole('button', { name: /^submit$/i }).click()

    const response = await postPromise
    expect(response.status()).toBeLessThan(400)

    await expect(page.getByText(/invitation email has been sent/i)).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 })
    await expect(page.getByText(TEST_TENANT.name)).toBeVisible({ timeout: 5000 })
  })

  test('READ — search and verify tenant data in the table', async ({ page }) => {
    await page.goto('/tenants/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    // Search for our test tenant
    await page.getByPlaceholder('Quick Search').click()
    await page.getByPlaceholder('Quick Search').fill(TEST_TENANT.name)
    await page.waitForTimeout(500)

    const row = page.locator('[role="row"]', { hasText: TEST_TENANT.name })
    await expect(row).toBeVisible()
    await expect(row.getByText(TEST_TENANT.email)).toBeVisible()
  })

  test('UPDATE — edit tenant address via row action menu', async ({ page }) => {
    await page.goto('/tenants/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const row = page.locator('[role="row"]', { hasText: TEST_TENANT.name })
    await expect(row).toBeVisible({ timeout: 10000 })
    await row.locator('button:has(svg)').last().click()

    await page.getByRole('menuitem', { name: 'Edit' }).click()

    const drawer = page.getByRole('dialog')
    await expect(drawer.getByText('Edit Tenant').first()).toBeVisible({ timeout: 5000 })

    // Wait for form to load
    const nameField = drawer.getByRole('textbox', { name: 'Tenant Name' })
    await expect(nameField).toBeVisible()
    await expect(nameField).not.toHaveValue('')

    const putPromise = page.waitForResponse(
      (res) => res.url().includes('/tenants') && res.request().method() === 'PUT'
    )

    await clearAndFill(page, 'Tenant Address', '789 Updated Road, Accra', drawer)

    await drawer.getByRole('button', { name: /^edit tenant$/i }).click()

    const putResponse = await putPromise
    expect(putResponse.status()).toBeLessThan(400)

    await expect(page.getByText(/change applied/i)).toBeVisible({ timeout: 10000 })
  })

  test('READ DETAIL — navigate to tenant detail page', async ({ page }) => {
    await page.goto('/tenants/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const row = page.locator('[role="row"]', { hasText: TEST_TENANT.name })
    await expect(row).toBeVisible({ timeout: 10000 })
    await row.locator('button:has(svg)').last().click()

    await page.getByRole('menuitem', { name: 'View' }).click()
    await expect(page).toHaveURL(/\/tenants\/manage\/\d+/, { timeout: 10000 })

    await expect(page.getByRole('tab').first()).toBeVisible({ timeout: 10000 })
  })

  test('DELETE — delete test tenant via row action menu', async ({ page }) => {
    await page.goto('/tenants/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const row = page.locator('[role="row"]', { hasText: TEST_TENANT.name })
    await expect(row).toBeVisible({ timeout: 10000 })

    page.on('dialog', (dialog) => dialog.accept())

    await row.locator('button:has(svg)').last().click()
    await page.getByRole('menuitem', { name: /^delete account$/i }).click()

    await expect(page.getByText(/tenant deleted successfully/i)).toBeVisible({ timeout: 10000 })
    await expect(row).not.toBeVisible({ timeout: 5000 })
  })

  test('VALIDATE — form rejects invalid email', async ({ page }) => {
    const drawer = await openAddTenantDrawer(page)

    await fillField(page, 'Full name', 'Bad Email Tenant', drawer)
    await fillField(page, 'Email', 'not-an-email', drawer)

    // Trigger validation by clicking away
    await drawer.getByRole('textbox', { name: 'Full name' }).click()

    await expect(drawer.getByText(/must be a valid email/i)).toBeVisible({ timeout: 3000 })
  })
})
