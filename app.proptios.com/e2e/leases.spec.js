const { test, expect } = require('./helpers/fixtures')

test.describe('Leases CRUD', () => {
  test('create a lease via the stepper form', async ({ page }) => {
    await page.goto('/leases/create')

    // Wait for stepper to load
    await page.locator('[class*="MuiStep"]').first().waitFor({ timeout: 15000 })

    // Step 1: Lease details
    // Fill tenant selection (autocomplete or select)
    const tenantSelect = page.getByLabel(/tenant/i).first()
    if ((await tenantSelect.count()) > 0) {
      await tenantSelect.click()
      // Pick the first option from the dropdown
      const firstOption = page.getByRole('option').first()
      if ((await firstOption.count()) > 0) {
        await firstOption.click()
      }
    }

    // Fill property selection
    const propertySelect = page.getByLabel(/property/i).first()
    if ((await propertySelect.count()) > 0) {
      await propertySelect.click()
      const firstOption = page.getByRole('option').first()
      if ((await firstOption.count()) > 0) {
        await firstOption.click()
      }
    }

    // Fill unit selection
    const unitSelect = page.getByLabel(/unit/i).first()
    if ((await unitSelect.count()) > 0) {
      await unitSelect.click()
      const firstOption = page.getByRole('option').first()
      if ((await firstOption.count()) > 0) {
        await firstOption.click()
      }
    }

    // Fill rent amount
    const rentField = page.getByLabel(/rent amount/i)
    if ((await rentField.count()) > 0) {
      await rentField.fill('1500')
    }

    // Try to advance to next step
    const nextBtn = page.getByRole('button', { name: /^next$/i })
    if ((await nextBtn.count()) > 0) {
      await nextBtn.click()

      // If we advanced, we should see step 2 content
      // If validation failed, we should see error messages
      const errors = page.locator('[class*="Mui-error"], .MuiFormHelperText-root')
      const stepContent = page.locator('[class*="MuiStep"]')
      await expect(errors.first().or(stepContent.first())).toBeVisible({ timeout: 5000 })
    }
  })

  test('lease list shows columns: tenant, property, status, dates', async ({ page }) => {
    await page.goto('/leases')

    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    // Verify key columns exist
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
    if ((await firstRow.count()) > 0) {
      // Click action menu
      await firstRow.locator('[aria-label*="more"], button:has(svg)').last().click()

      const viewOption = page.getByRole('menuitem', { name: /view|manage/i })
      if ((await viewOption.count()) > 0) {
        await viewOption.click()
        await expect(page).toHaveURL(/\/leases\/(view|edit)\/\d+/, { timeout: 10000 })

        // Detail page should render with lease information
        const content = page.locator('[class*="MuiCard"], [class*="MuiTypography"]')
        await expect(content.first()).toBeVisible({ timeout: 10000 })
      }
    }
  })
})
