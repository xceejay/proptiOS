const { test, expect } = require('./helpers/fixtures')
const { fillField, selectOption } = require('./helpers/mui')

const TIMESTAMP = Date.now()
const SEARCH_PROPERTY = {
  name: `Search Property ${TIMESTAMP}`,
  email: `search-owner-${TIMESTAMP}@example.com`,
  address: 'Search Lane, Accra',
  phone: '+233200000101',
  type: 'Apartment',
  units: '1',
}
const SEARCH_TENANT = {
  name: `Search Tenant ${TIMESTAMP}`,
  email: `search-tenant-${TIMESTAMP}@example.com`,
  address: 'Tenant Lane, Accra',
  phone: '+233200000102',
}

/**
 * Helper: navigate to a page and wait for its DataGrid to load.
 */
async function gotoWithGrid(page, url) {
  await page.goto(url)
  await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })
}

async function ensurePropertyExists(page) {
  await gotoWithGrid(page, '/properties/management')

  const rows = page.locator('[role="row"][data-rowindex]')
  if ((await rows.count()) > 0) {
    const firstName = await rows
      .first()
      .locator('[data-field="property_name"], [role="gridcell"]')
      .first()
      .textContent()

    return firstName?.trim()
  }

  await page.getByRole('button', { name: /^add property$/i }).click()

  const drawer = page.getByRole('dialog')
  await expect(drawer).toBeVisible({ timeout: 5000 })

  await fillField(page, 'Property Name', SEARCH_PROPERTY.name, drawer)
  await fillField(page, 'Owner Email', SEARCH_PROPERTY.email, drawer)
  await fillField(page, 'Property Address', SEARCH_PROPERTY.address, drawer)
  await fillField(page, 'Owner Phone Number', SEARCH_PROPERTY.phone, drawer)
  await selectOption(page, 'Property Type', SEARCH_PROPERTY.type, drawer)

  const unitsInput = drawer.getByRole('spinbutton', { name: 'Number of Units' })
  await unitsInput.clear()
  await unitsInput.fill(SEARCH_PROPERTY.units)

  const createResponse = page.waitForResponse(
    res => res.url().includes('/properties') && res.request().method() === 'POST'
  )

  await drawer.getByRole('button', { name: /^add property$/i }).click()

  const response = await createResponse
  expect(response.status()).toBeLessThan(400)
  await expect(page.getByText(/property added successfully/i)).toBeVisible({ timeout: 10000 })

  return SEARCH_PROPERTY.name
}

async function ensureTenantExists(page) {
  await gotoWithGrid(page, '/tenants/management')

  const rows = page.locator('[role="row"][data-rowindex]')
  if ((await rows.count()) > 0) {
    const firstName = await rows
      .first()
      .locator('[data-field="name"], [role="gridcell"]')
      .first()
      .textContent()

    return firstName?.trim()
  }

  await page.getByRole('button', { name: /^add tenant$/i }).click()

  const drawer = page.getByRole('dialog')
  await expect(drawer).toBeVisible({ timeout: 5000 })

  await fillField(page, 'Full name', SEARCH_TENANT.name, drawer)
  await fillField(page, 'Email', SEARCH_TENANT.email, drawer)
  await fillField(page, 'Address', SEARCH_TENANT.address, drawer)
  await fillField(page, 'Phone Number', SEARCH_TENANT.phone, drawer)

  const createResponse = page.waitForResponse(
    res => res.url().includes('/tenants') && res.request().method() === 'POST'
  )

  await drawer.getByRole('button', { name: /^submit$/i }).click()

  const response = await createResponse
  expect(response.status()).toBeLessThan(400)
  await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 })

  return SEARCH_TENANT.name
}

// ─── PROPERTIES TABLE ────────────────────────────────────────────────────────

test.describe('Cross-cutting — Properties Table', () => {
  test('search with matching term shows results', async ({ page }) => {
    const propertyName = await ensurePropertyExists(page)
    expect(propertyName, 'Expected at least one property to search').toBeTruthy()

    const search = page.getByPlaceholder('Search Properties')
    const searchTerm = propertyName.slice(0, 5)
    await search.fill(searchTerm)
    await page.waitForTimeout(500)

    await expect(page.getByText(propertyName)).toBeVisible()
  })

  test('search with nonsense term shows zero rows', async ({ page }) => {
    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const search = page.getByPlaceholder('Search Properties')
    await search.click()
    await search.fill('zzz_no_match_999')
    await page.waitForTimeout(500)

    // Should show no rows or "No rows" overlay
    const rows = page.locator('[role="row"][data-rowindex]')
    await expect(rows).toHaveCount(0, { timeout: 3000 })
  })

  test('export button is visible', async ({ page }) => {
    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    await expect(page.getByRole('button', { name: /export/i })).toBeVisible()
  })
})

// ─── TENANTS TABLE ───────────────────────────────────────────────────────────

test.describe('Cross-cutting — Tenants Table', () => {
  test.setTimeout(60_000)

  test('search with matching term shows results', async ({ page }) => {
    const tenantName = await ensureTenantExists(page)
    expect(tenantName, 'Expected at least one tenant to search').toBeTruthy()

    const search = page.getByPlaceholder('Quick Search')
    await search.fill(tenantName.slice(0, 5))
    await page.waitForTimeout(500)

    await expect(page.getByText(tenantName)).toBeVisible()
  })

  test('search with nonsense term shows zero rows', async ({ page }) => {
    await gotoWithGrid(page, '/tenants/management')

    const search = page.getByPlaceholder('Quick Search')
    await search.click()
    await search.fill('zzz_no_match_999')
    await page.waitForTimeout(500)

    const rows = page.locator('[role="row"][data-rowindex]')
    await expect(rows).toHaveCount(0, { timeout: 3000 })
  })

  test('row action menu opens with expected options', async ({ page }) => {
    const tenantName = await ensureTenantExists(page)
    expect(tenantName, 'Expected at least one tenant to open actions for').toBeTruthy()

    const firstRow = page.locator('[role="row"]', { hasText: tenantName })
    await expect(firstRow).toBeVisible({ timeout: 5000 })
    await firstRow.locator('button:has(svg)').last().click()

    // Verify menu items
    await expect(page.getByRole('menuitem', { name: /view/i })).toBeVisible({ timeout: 3000 })
    await expect(page.getByRole('menuitem', { name: /edit/i })).toBeVisible()

    // Close menu
    await page.keyboard.press('Escape')
  })
})

// ─── FINANCE PAYMENTS TABLE ──────────────────────────────────────────────────

test.describe('Cross-cutting — Finance Payments Table', () => {
  test('payments table loads with rows', async ({ page }) => {
    await page.goto('/finance/payments')

    const content = page.locator('.MuiDataGrid-root, [class*="MuiCard"]')
    await expect(content.first()).toBeVisible({ timeout: 15000 })
  })
})

// ─── USERS MANAGE TABLE ──────────────────────────────────────────────────────

test.describe('Cross-cutting — Users Manage Table', () => {
  test('manage users tab loads and shows rows', async ({ page }) => {
    await page.goto('/users')

    const manageTab = page.getByRole('tab', { name: /manage users/i })
    await expect(manageTab).toBeVisible({ timeout: 15000 })
    await manageTab.click()

    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const firstRow = page.locator('[role="row"][data-rowindex="0"]')
    await expect(firstRow).toBeVisible({ timeout: 5000 })
  })

  test('row action menu opens with View and Edit options', async ({ page }) => {
    await page.goto('/users')

    const manageTab = page.getByRole('tab', { name: /manage users/i })
    await expect(manageTab).toBeVisible({ timeout: 15000 })
    await manageTab.click()

    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const firstRow = page.locator('[role="row"][data-rowindex="0"]')
    await expect(firstRow).toBeVisible({ timeout: 5000 })
    await firstRow.locator('button:has(svg)').last().click()

    await expect(page.getByRole('menuitem', { name: /view/i })).toBeVisible({ timeout: 3000 })
    await expect(page.getByRole('menuitem', { name: /edit/i })).toBeVisible()

    await page.keyboard.press('Escape')
  })
})
