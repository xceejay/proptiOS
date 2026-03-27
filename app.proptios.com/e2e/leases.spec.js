const { test, expect } = require('./helpers/fixtures')
const { selectOption, selectMultiple, fillField } = require('./helpers/mui')

test.describe('Leases CRUD', () => {
  test('create a lease via the stepper form', async ({ page }) => {
    test.setTimeout(90_000) // 6-step form needs more than the default 30s
    const propertiesResponse = page.waitForResponse(
      res => res.url().includes('/properties/all') && res.request().method() === 'GET' && res.ok()
    )
    await page.goto('/leases/create')
    await propertiesResponse

    await expect(page.getByText('Create Lease Agreement')).toBeVisible({ timeout: 15000 })

    // ── Step 0: Select Property, Unit, and Tenant ──

    const leaseTitle = `E2E Test Lease ${Date.now()}`
    await fillField(page, 'Lease Title', leaseTitle)

    const token = await page.evaluate(() => window.localStorage.getItem('accessToken'))
    expect(token, 'Lease creation requires an authenticated browser session').toBeTruthy()

    const apiBase = process.env.E2E_API_URL || 'http://127.0.0.1:2024'
    const propertiesApiResponse = await page.request.get(`${apiBase}/properties/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(propertiesApiResponse.ok(), 'Failed to fetch property data for lease preconditions').toBeTruthy()

    const propertiesPayload = await propertiesApiResponse.json()
    const properties = Array.isArray(propertiesPayload?.data) ? propertiesPayload.data : []

    const candidate = properties
      .flatMap(property =>
        (property.units || []).map(unit => ({
          property,
          unit,
          tenant: (property.tenants || []).find(tenant => tenant.id === unit.tenant_id),
        }))
      )
      .find(item => item.property?.name && item.unit?.name && item.tenant?.name)

    expect(candidate, 'Lease creation requires at least one property with a unit that already has a tenant').toBeTruthy()

    await selectOption(page, 'Select Property', candidate.property.name)

    await selectOption(page, 'Select Unit', candidate.unit.name)

    await selectOption(page, 'Select Tenant', candidate.tenant.name)

    // Click Next
    await page.getByRole('button', { name: /^next$/i }).click()

    await expect(page.getByLabel('Lease Start Date')).toBeVisible({ timeout: 10000 })

    // ── Step 1: Lease Details ──

    await fillField(page, 'Lease Start Date', '2026-04-01')
    await page.keyboard.press('Escape')

    await fillField(page, 'Lease End Date', '2027-03-31')
    await page.keyboard.press('Escape')

    await selectOption(page, 'Renewal Terms', 'Auto Renewal')
    await fillField(page, 'Lease Terms', 'Standard 12-month residential lease')

    await page.getByRole('button', { name: /^next$/i }).click()

    // ── Step 2: Payment Details ──
    await expect(page.getByText('Payment Details')).toBeVisible({ timeout: 10000 })

    await selectOption(page, 'Payment Currency', /Ghanaian Cedi/i)
    await fillField(page, 'Rent Amount', '1500')
    await selectOption(page, 'Rent Payment Frequency', 'Monthly')
    await selectMultiple(page, 'Payment Methods', ['Mobile Money'])

    await fillField(page, 'Security Deposit', '3000')
    await fillField(page, 'Grace Period (days)', '5')

    await page.getByRole('button', { name: /^next$/i }).click()

    // ── Step 3: Policies and Responsibilities ──
    await expect(page.getByText('Policies and Responsibilities')).toBeVisible({ timeout: 10000 })

    await selectOption(page, 'Maintenance Responsibility', 'Tenant')
    await selectOption(page, 'Pet Policy', 'Not Allowed')
    await fillField(page, 'Termination Clause', '30-day written notice required')
    await fillField(page, 'Notice Period', '30')

    await page.getByRole('button', { name: /^next$/i }).click()

    // ── Step 4: Optional Terms ──
    await expect(page.getByLabel('Guarantor Name')).toBeVisible({ timeout: 10000 })
    await fillField(page, 'Occupants Count', '2')
    await page.getByRole('button', { name: /^next$/i }).click()

    // ── Step 5: Review and Submit ──
    await expect(page.getByText('Review Lease Agreement Details')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(leaseTitle)).toBeVisible()

    await page.getByRole('button', { name: /^save$/i }).click()

    await expect(page.getByText(/changes has been saved/i)).toBeVisible({ timeout: 10000 })

    await page.goto('/leases')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })
    await expect(page.getByText(leaseTitle)).toBeVisible({ timeout: 10000 })
  })

  test('lease list shows columns: tenant, property, status, dates', async ({ page }) => {
    await page.goto('/leases')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    await expect(page.getByRole('columnheader', { name: /tenant/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /property/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /status/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /start date/i })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: /end date/i })).toBeVisible()
  })

  test('view a lease detail page from the list', async ({ page }) => {
    await page.goto('/leases')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const firstRow = page.locator('[role="row"][data-rowindex="0"]')
    if (await firstRow.isVisible({ timeout: 3000 }).catch(() => false)) {
      await firstRow.locator('button:has(svg)').last().click()

      const viewOption = page.getByRole('menuitem', { name: /view|manage/i })
      if (await viewOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        await viewOption.click()
        await expect(page).toHaveURL(/\/leases\/(view|edit)\/\d+/, { timeout: 10000 })

        const content = page.locator('[class*="MuiCard"], [class*="MuiTypography"]')
        await expect(content.first()).toBeVisible({ timeout: 10000 })
      }
    }
  })
})
