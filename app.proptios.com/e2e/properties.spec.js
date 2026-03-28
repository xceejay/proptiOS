const { test, expect } = require('./helpers/fixtures')
const { selectOption, fillField, clearAndFill } = require('./helpers/mui')

const TIMESTAMP = Date.now()
const TEST_PROPERTY = {
  name: `E2E Property ${TIMESTAMP}`,
  email: `e2e-owner-${TIMESTAMP}@example.com`,
  address: '123 Playwright Street, Accra',
  phone: '+233200000099',
  type: 'Apartment',
  units: '1',
  rentAmount: '1500',
}

/**
 * Helper: open the Add Property drawer and wait for it to be ready.
 */
async function openAddPropertyDrawer(page) {
  await page.goto('/properties/management')
  await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

  await page.getByRole('button', { name: /^add property$/i }).click()

  const drawer = page.getByRole('dialog')
  await expect(drawer).toBeVisible({ timeout: 5000 })
  await expect(drawer.getByRole('textbox', { name: 'Property Name' })).toBeVisible({ timeout: 5000 })

  return drawer
}

/**
 * Helper: fill all fields in the Add/Edit Property form.
 */
async function fillPropertyForm(page, data, container) {
  await fillField(page, 'Property Name', data.name, container)
  await fillField(page, 'Owner Email', data.email, container)
  await fillField(page, 'Property Address', data.address, container)
  await fillField(page, 'Owner Phone Number', data.phone, container)
  await selectOption(page, 'Property Type', data.type, container)

  const unitsInput = container.getByRole('spinbutton', { name: 'Number of Units' })
  await unitsInput.click()
  await unitsInput.clear()
  await unitsInput.fill(data.units)

  const rentInput = container.getByRole('spinbutton', { name: 'Default Unit Rent Amount' })
  await rentInput.click()
  await rentInput.clear()
  await rentInput.fill(data.rentAmount)
}

/**
 * Helper: delete the first property row via the action menu.
 * Returns the name of the deleted property so it can be re-created if needed.
 */
async function deleteFirstProperty(page) {
  const firstRow = page.locator('[role="row"][data-rowindex="0"]')
  await expect(firstRow).toBeVisible({ timeout: 5000 })

  // Grab the property name before deleting
  const nameCell = firstRow.locator('[data-field="property_name"]')
  const deletedName = await nameCell.textContent()

  // Intercept the DELETE
  const deletePromise = page.waitForResponse(
    res => res.url().includes('/properties') && res.request().method() === 'DELETE'
  )

  await firstRow.locator('button:has(svg)').last().click()
  await page.getByRole('menuitem', { name: 'Delete' }).click()

  const deleteResp = await deletePromise
  expect(deleteResp.status()).toBeLessThan(400)

  await expect(page.getByText(/property deleted successfully/i)).toBeVisible({ timeout: 10000 })

  return deletedName
}

test.describe.serial('Properties CRUD', () => {
  test('SETUP — delete existing properties to make room for test data', async ({ page }) => {
    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    // Delete 1 property to free a subscription slot (max 2) for our test property.
    // We only delete 1 so that at least 1 existing property remains for the leases test.
    const row = page.locator('[role="row"][data-rowindex="0"]')
    if (await row.isVisible({ timeout: 3000 }).catch(() => false)) {
      await deleteFirstProperty(page)
      await page.waitForTimeout(1000)
    }
  })

  test('CREATE — add a new property and verify it appears in the table', async ({ page }) => {
    const drawer = await openAddPropertyDrawer(page)

    await fillPropertyForm(page, TEST_PROPERTY, drawer)

    // Verify inputs have values before submitting
    await expect(drawer.getByRole('textbox', { name: 'Property Name' })).toHaveValue(TEST_PROPERTY.name)
    await expect(drawer.getByRole('textbox', { name: 'Owner Email' })).toHaveValue(TEST_PROPERTY.email)

    // Set up response listener before clicking submit
    const postPromise = page.waitForResponse(
      res => res.url().includes('/properties') && res.request().method() === 'POST'
    )

    await drawer.getByRole('button', { name: /^add property$/i }).click()

    const response = await postPromise
    expect(response.status()).toBeLessThan(400)

    await expect(page.getByText(/property added successfully/i)).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 })
    await expect(page.getByText(TEST_PROPERTY.name)).toBeVisible({ timeout: 5000 })
  })

  test('READ — verify created property data in the table', async ({ page }) => {
    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    await page.getByPlaceholder('Search Properties').click()
    await page.getByPlaceholder('Search Properties').fill(TEST_PROPERTY.name)
    await page.waitForTimeout(500)

    const row = page.locator('[role="row"]', { hasText: TEST_PROPERTY.name })
    await expect(row).toBeVisible()
    await expect(row.getByText(TEST_PROPERTY.address)).toBeVisible()
  })

  test('READ — property creation also creates the first default unit', async ({ page }) => {
    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const row = page.locator('[role="row"]', { hasText: TEST_PROPERTY.name })
    await expect(row).toBeVisible({ timeout: 10000 })
    await row.click()

    await page.getByRole('tab', { name: /units/i }).click()
    await expect(page).toHaveURL(/\/properties\/manage\/\d+\/units/, { timeout: 10000 })
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    await expect(page.getByText('Unit 1')).toBeVisible({ timeout: 10000 })
  })

  test('UPDATE — edit property address via row action menu', async ({ page }) => {
    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const row = page.locator('[role="row"]', { hasText: TEST_PROPERTY.name })
    await expect(row).toBeVisible({ timeout: 10000 })
    await row.locator('button:has(svg)').last().click()

    await page.getByRole('menuitem', { name: 'Edit' }).click()

    const drawer = page.getByRole('dialog')
    await expect(drawer.getByText('Edit Property').first()).toBeVisible({ timeout: 5000 })

    const nameField = drawer.getByRole('textbox', { name: 'Property Name' })
    await expect(nameField).toBeVisible()
    await expect(nameField).toHaveValue(TEST_PROPERTY.name)

    const putPromise = page.waitForResponse(
      res => res.url().includes('/properties') && res.request().method() === 'PUT'
    )

    await clearAndFill(page, 'Property Address', '456 Updated Ave, Accra', drawer)

    await drawer.getByRole('button', { name: /^edit property$/i }).click()

    const putResponse = await putPromise
    expect(putResponse.status()).toBeLessThan(400)

    await expect(page.getByText(/property updated successfully/i)).toBeVisible({ timeout: 10000 })
  })

  test('DELETE — delete the test property to clean up', async ({ page }) => {
    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const row = page.locator('[role="row"]', { hasText: TEST_PROPERTY.name })
    await expect(row).toBeVisible({ timeout: 10000 })

    const deletePromise = page.waitForResponse(
      res => res.url().includes('/properties') && res.request().method() === 'DELETE'
    )

    await row.locator('button:has(svg)').last().click()
    await page.getByRole('menuitem', { name: 'Delete' }).click()

    const deleteResp = await deletePromise
    expect(deleteResp.status()).toBeLessThan(400)

    await expect(page.getByText(/property deleted successfully/i)).toBeVisible({ timeout: 10000 })
    await expect(row).not.toBeVisible({ timeout: 5000 })
  })

  test('VALIDATE — form prevents submission with missing required fields', async ({ page }) => {
    const drawer = await openAddPropertyDrawer(page)

    await fillField(page, 'Property Name', 'Incomplete Property', drawer)

    await drawer.getByRole('button', { name: /^add property$/i }).click()

    await expect(drawer.getByText(/owner email field is required/i)).toBeVisible({ timeout: 3000 })
    await expect(drawer.getByText(/property address field is required/i)).toBeVisible()
    await expect(drawer.getByText(/phone number is required/i)).toBeVisible()
  })
})
