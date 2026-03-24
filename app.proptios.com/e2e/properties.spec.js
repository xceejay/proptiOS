const { test, expect } = require('./helpers/fixtures')

const TIMESTAMP = Date.now()
const TEST_PROPERTY = {
  name: `E2E Property ${TIMESTAMP}`,
  email: `e2e-owner-${TIMESTAMP}@example.com`,
  address: '123 Playwright Street, Accra',
  phone: '+233200000099',
  type: 'Apartment',
  units: '2',
}

test.describe.serial('Properties CRUD', () => {
  test('CREATE — add a new property and verify it appears in the table', async ({ page }) => {
    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    // Intercept the POST to verify it hits the API
    const postPromise = page.waitForResponse(
      res => res.url().includes('/properties') && res.request().method() === 'POST'
    )

    // Open add drawer
    await page.getByRole('button', { name: /add new property/i }).click()
    await expect(page.getByText('Add Property').first()).toBeVisible()

    // Fill every required field
    await page.getByLabel('Property Name').fill(TEST_PROPERTY.name)
    await page.getByLabel('Owner Email').fill(TEST_PROPERTY.email)
    await page.getByLabel('Property Address').fill(TEST_PROPERTY.address)
    await page.getByLabel('Owner Phone Number').fill(TEST_PROPERTY.phone)
    await page.getByLabel('Property Type').click()
    await page.getByRole('option', { name: TEST_PROPERTY.type }).click()
    await page.getByLabel('Number of Units').clear()
    await page.getByLabel('Number of Units').fill(TEST_PROPERTY.units)

    // Submit
    await page.getByRole('button', { name: /^add property$/i }).click()

    // Verify POST hit the API and got 200
    const response = await postPromise
    expect(response.status()).toBeLessThan(400)

    // Verify success toast
    await expect(page.getByText(/property added successfully/i)).toBeVisible({ timeout: 10000 })

    // Drawer should close
    await expect(page.getByLabel('Property Name')).not.toBeVisible({ timeout: 5000 })

    // New property should appear in the table
    await expect(page.getByText(TEST_PROPERTY.name)).toBeVisible({ timeout: 5000 })
  })

  test('READ — verify created property data in the table', async ({ page }) => {
    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    // Search to isolate our test property
    await page.getByPlaceholder('Search Properties').fill(TEST_PROPERTY.name)
    await page.waitForTimeout(500)

    // Verify the row contains the correct data
    const row = page.locator('[role="row"]', { hasText: TEST_PROPERTY.name })
    await expect(row).toBeVisible()
    await expect(row.getByText(TEST_PROPERTY.address)).toBeVisible()
  })

  test('UPDATE — edit property name via row action menu', async ({ page }) => {
    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    // Find our test property row
    const row = page.locator('[role="row"]', { hasText: TEST_PROPERTY.name })
    await expect(row).toBeVisible({ timeout: 10000 })

    // Open the three-dot action menu
    await row.locator('button:has(svg)').last().click()

    // Click Edit
    await page.getByRole('menuitem', { name: 'Edit' }).click()

    // Edit drawer should open with pre-filled data
    await expect(page.getByText('Edit Property').first()).toBeVisible({ timeout: 5000 })

    // Verify form is pre-filled with the correct property name
    const nameField = page.getByLabel('Property Name')
    await expect(nameField).toHaveValue(TEST_PROPERTY.name)

    // Intercept the PUT
    const putPromise = page.waitForResponse(
      res => res.url().includes('/properties') && res.request().method() === 'PUT'
    )

    // Change the address
    const addressField = page.getByLabel('Property Address')
    await addressField.clear()
    await addressField.fill('456 Updated Ave, Accra')

    // Submit the edit
    await page.getByRole('button', { name: /^edit property$/i }).click()

    // Verify PUT succeeded
    const putResponse = await putPromise
    expect(putResponse.status()).toBeLessThan(400)

    // Success toast
    await expect(page.getByText(/property updated successfully/i)).toBeVisible({ timeout: 10000 })
  })

  test('DELETE — delete property via row action menu', async ({ page }) => {
    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const row = page.locator('[role="row"]', { hasText: TEST_PROPERTY.name })
    await expect(row).toBeVisible({ timeout: 10000 })

    // Accept the confirmation dialog that will appear
    page.on('dialog', dialog => dialog.accept())

    // Open action menu and click Delete
    await row.locator('button:has(svg)').last().click()
    await page.getByRole('menuitem', { name: 'Delete' }).click()

    // Wait for the API call and success feedback
    await expect(page.getByText(/deleted|success/i)).toBeVisible({ timeout: 10000 })

    // Property should no longer be in the table
    await expect(row).not.toBeVisible({ timeout: 5000 })
  })

  test('VALIDATE — form prevents submission with missing required fields', async ({ page }) => {
    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    await page.getByRole('button', { name: /add new property/i }).click()
    await expect(page.getByText('Add Property').first()).toBeVisible()

    // Only fill name, leave everything else blank
    await page.getByLabel('Property Name').fill('Incomplete Property')

    // Submit
    await page.getByRole('button', { name: /^add property$/i }).click()

    // Should show validation errors for the missing required fields
    await expect(page.getByText(/owner email field is required/i)).toBeVisible({ timeout: 3000 })
    await expect(page.getByText(/property address field is required/i)).toBeVisible()
    await expect(page.getByText(/phone number is required/i)).toBeVisible()
  })
})
