const { test, expect } = require('./helpers/fixtures')
const { AUTH_MODE, readTestUser } = require('./helpers/auth-state')
const { fillField, clearAndFill, selectOption, selectFirstOption } = require('./helpers/mui')
const { appendNote, getEntity, recordEntity, resetProtocolState, STATE_FILE } = require('./helpers/qa-protocol')

const TIMESTAMP = Date.now()
const BASE_URL = `http://127.0.0.1:${process.env.E2E_PORT || 3001}`
const QA_PROPERTY = {
  name: `QA Property ${TIMESTAMP}`,
  updatedName: `QA Property ${TIMESTAMP} Updated`,
  email: `qa-property-${TIMESTAMP}@example.com`,
  address: `QA Address ${TIMESTAMP}`,
  updatedAddress: `QA Address ${TIMESTAMP} Updated`,
  phone: '+233200001111',
  updatedPhone: '+233200001119',
  type: 'Apartment',
  units: '1',
  rentAmount: '1750',
}
const QA_TENANT = {
  name: `QA Tenant ${TIMESTAMP}`,
  email: `qa-tenant-${TIMESTAMP}@proptios.com`,
  address: `QA Tenant Address ${TIMESTAMP}`,
  updatedAddress: `QA Tenant Address ${TIMESTAMP} Updated`,
  phone: '+233200001112',
}
const QA_MAINTENANCE = {
  title: `QA Maintenance ${TIMESTAMP}`,
  description: `QA maintenance request ${TIMESTAMP}`,
}
const QA_ISSUE = {
  title: `QA Issue ${TIMESTAMP}`,
  description: `QA issue body ${TIMESTAMP}`,
  comment: `QA issue comment ${TIMESTAMP}`,
}

test.describe.serial('QA Protocol — CRUDR', () => {
  test.skip(AUTH_MODE !== 'onboarding', 'QA protocol suite requires E2E_AUTH_MODE=onboarding so it can start from a fresh account.')

  test('AUTH — fresh onboarding user can complete the pre-test auth checks', async ({ browser }) => {
    const user = readTestUser()
    resetProtocolState({
      authMode: AUTH_MODE,
      stateFile: STATE_FILE,
      user,
    })
    recordEntity('account', user)

    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } })
    const page = await context.newPage()

    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' })
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible({ timeout: 15000 })

    const createAccountLink = page.getByRole('link', { name: /create an account/i })
    await expect(createAccountLink).toBeVisible()
    await createAccountLink.click()
    await page.waitForURL(/\/register/, { timeout: 5000 })
    appendNote({
      phase: 'AUTH',
      detail: 'Login page create-account link reached /register successfully.',
    })

    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /login/i }).click()
    await expect(page.getByText(/required/i).first()).toBeVisible({ timeout: 5000 })

    await page.getByLabel('Email').fill(user.email)
    await page.locator('#auth-login-v2-password').fill(`${user.password}-wrong`)
    await page.getByRole('button', { name: /login/i }).click()
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })

    const forgotPasswordLink = page.getByRole('link', { name: /forgot password/i })
    await expect(forgotPasswordLink).toBeVisible()
    await forgotPasswordLink.click()
    await page.waitForURL(/\/forgot-password/, { timeout: 5000 })
    appendNote({
      phase: 'AUTH',
      detail: 'Forgot password route was reachable from the login screen.',
    })

    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' })
    await page.getByLabel('Email').fill(user.email)
    await page.locator('#auth-login-v2-password').fill(user.password)
    await page.getByRole('button', { name: /login/i }).click()
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 })
    await expect(page.getByText(/total tenants/i)).toBeVisible({ timeout: 15000 })

    await context.close()
  })

  test('PHASE 1 CREATE — create property, maintenance request, tenant, and communication issue', async ({ page }) => {
    test.setTimeout(180_000)

    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    await page.getByRole('button', { name: /^add property$/i }).click()
    const propertyDrawer = page.getByRole('dialog')
    await expect(propertyDrawer).toBeVisible({ timeout: 5000 })

    await fillField(page, 'Property Name', QA_PROPERTY.name, propertyDrawer)
    await fillField(page, 'Owner Email', QA_PROPERTY.email, propertyDrawer)
    await fillField(page, 'Property Address', QA_PROPERTY.address, propertyDrawer)
    await fillField(page, 'Owner Phone Number', QA_PROPERTY.phone, propertyDrawer)
    await selectOption(page, 'Property Type', QA_PROPERTY.type, propertyDrawer)

    const unitsInput = propertyDrawer.getByRole('spinbutton', { name: 'Number of Units' })
    await unitsInput.clear()
    await unitsInput.fill(QA_PROPERTY.units)

    const rentInput = propertyDrawer.getByRole('spinbutton', { name: 'Default Unit Rent Amount' })
    await rentInput.clear()
    await rentInput.fill(QA_PROPERTY.rentAmount)

    const propertyCreateResponse = page.waitForResponse(
      res => res.url().includes('/properties') && res.request().method() === 'POST'
    )
    await propertyDrawer.getByRole('button', { name: /^add property$/i }).click()
    const propertyResponse = await propertyCreateResponse
    expect(propertyResponse.status()).toBeLessThan(400)
    const propertyPayload = await propertyResponse.json().catch(() => null)
    const propertyId = propertyPayload?.data?.[0]?.id ? String(propertyPayload.data[0].id) : null

    recordEntity('property', {
      id: propertyId,
      name: QA_PROPERTY.name,
      currentName: QA_PROPERTY.name,
      address: QA_PROPERTY.address,
      currentAddress: QA_PROPERTY.address,
      unitsExpected: 1,
    })

    if (propertyId) {
      await page.goto(`/properties/manage/${propertyId}/units`)
    } else {
      const propertyRow = page.locator('[role="row"]', { hasText: QA_PROPERTY.name }).first()
      await expect(propertyRow).toBeVisible({ timeout: 10000 })
      await propertyRow.click()
      await expect(page).toHaveURL(/\/properties\/manage\/\d+(\/overview)?\/?$/, { timeout: 10000 })
      await page.getByRole('tab', { name: /units/i }).click()
    }
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })
    await expect(page.getByText('Unit 1')).toBeVisible({ timeout: 10000 })
    recordEntity('unit', { name: 'Unit 1', propertyName: QA_PROPERTY.name })

    if (propertyId) {
      await page.goto(`/properties/manage/${propertyId}/maintenance`)
    } else {
      await page.getByRole('tab', { name: /maintenance/i }).click()
    }
    await page.locator('.MuiDataGrid-root, .MuiCardContent-root').first().waitFor({ timeout: 15000 })
    await page.getByRole('button', { name: /add maintenance/i }).click()
    const maintenanceDrawer = page.getByRole('dialog')
    await expect(maintenanceDrawer).toBeVisible({ timeout: 5000 })
    const maintenanceTitleInput = maintenanceDrawer.getByRole('textbox', { name: 'Title' })
    const maintenanceDescriptionInput = maintenanceDrawer.getByRole('textbox', { name: 'Description' })
    await expect(maintenanceTitleInput).toBeVisible({ timeout: 10000 })
    await expect(maintenanceDescriptionInput).toBeVisible({ timeout: 10000 })
    await maintenanceTitleInput.fill(QA_MAINTENANCE.title)
    await maintenanceDescriptionInput.fill(QA_MAINTENANCE.description)
    await selectOption(page, 'Request Owner', 'Property', maintenanceDrawer)

    const maintenanceCreateResponse = page.waitForResponse(
      res => res.url().includes('/maintenance-requests') && res.request().method() === 'POST',
      { timeout: 15000 }
    )
    await maintenanceDrawer.getByRole('button', { name: /^submit$/i }).click()
    const maintenanceResponse = await maintenanceCreateResponse
    expect(maintenanceResponse.status()).toBeLessThan(400)
    await expect(page.getByText(/request has been successfully added/i)).toBeVisible({ timeout: 10000 })
    recordEntity('maintenance', {
      title: QA_MAINTENANCE.title,
      status: 'created',
    })

    if (propertyId) {
      await page.goto(`/properties/manage/${propertyId}/tenants`)
    } else {
      await page.getByRole('tab', { name: /tenants/i }).click()
    }
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })
    await page.getByRole('button', { name: /add new tenant/i }).click()
    const tenantDrawer = page.getByRole('dialog')
    await expect(tenantDrawer).toBeVisible({ timeout: 5000 })
    await fillField(page, 'Full name', QA_TENANT.name, tenantDrawer)
    await fillField(page, 'Email', QA_TENANT.email, tenantDrawer)
    await fillField(page, 'Address', QA_TENANT.address, tenantDrawer)
    await selectOption(page, 'Country', 'Ghana', tenantDrawer)
    await fillField(page, 'Phone Number', QA_TENANT.phone, tenantDrawer)

    const tenantCreateResponse = page.waitForResponse(
      res => res.url().includes('/tenants') && res.request().method() === 'POST'
    )
    await tenantDrawer.getByRole('button', { name: /^submit$/i }).click()
    const tenantResponse = await tenantCreateResponse
    expect(tenantResponse.status()).toBeLessThan(400)
    await expect(page.getByText(QA_TENANT.email, { exact: true }).first()).toBeVisible({ timeout: 10000 })
    recordEntity('tenant', {
      name: QA_TENANT.name,
      currentName: QA_TENANT.name,
      email: QA_TENANT.email,
      address: QA_TENANT.address,
      currentAddress: QA_TENANT.address,
    })

    await page.goto('/communication')
    await expect(page.getByRole('tab', { name: 'Issues' })).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('Loading issues...')).toHaveCount(0, { timeout: 15000 })

    const issueCreateResponse = page.waitForResponse(
      res => res.url().includes('/communication/issues') && res.request().method() === 'POST'
    )
    await page.getByRole('button', { name: /create new issue/i }).click()
    const issueDialog = page.getByRole('dialog')
    await expect(issueDialog).toBeVisible({ timeout: 5000 })
    await issueDialog.getByLabel('Issue title').fill(QA_ISSUE.title)
    await issueDialog.getByLabel('Issue description').fill(QA_ISSUE.description)
    await issueDialog.getByRole('button', { name: /create issue/i }).click()
    const issueResponse = await issueCreateResponse
    expect(issueResponse.status()).toBeLessThan(400)

    const issuePayload = await issueResponse.json().catch(() => null)
    recordEntity('issue', {
      id: issuePayload?.data?.id || null,
      title: QA_ISSUE.title,
      status: 'Open',
    })

    const commentResponse = page.waitForResponse(
      res =>
        res.url().includes('/communication/issues/') &&
        res.url().includes('/comments') &&
        res.request().method() === 'POST'
    )
    await page.getByPlaceholder('Add a comment...').fill(QA_ISSUE.comment)
    await page.getByRole('button', { name: /^send$/i }).click()
    const createdCommentResponse = await commentResponse
    expect(createdCommentResponse.status()).toBeLessThan(400)
    await expect(page.getByText(QA_ISSUE.comment)).toBeVisible({ timeout: 10000 })
    recordEntity('comment', { text: QA_ISSUE.comment })
  })

  test('PHASE 2 READ — verify created entities across dashboard, modules, and audit', async ({ page }) => {
    test.setTimeout(90_000)

    const property = getEntity('property')
    const tenant = getEntity('tenant')
    const issue = getEntity('issue')
    const user = getEntity('account')

    const dashboardResponse = page.waitForResponse(
      resp => resp.url().includes('/dashboard') && !resp.url().includes('_next') && resp.status() === 200
    )
    await page.goto('/dashboard')
    await expect(page.getByText('Total tenants')).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('Total Properties')).toBeVisible({ timeout: 15000 })
    await dashboardResponse.catch(() => null)

    await page.goto('/properties/overview')
    await expect(page.getByText(/total applicants/i)).toBeVisible({ timeout: 15000 })

    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })
    await page.getByPlaceholder('Search Properties').fill(property.currentName)
    await expect(page.locator('[role="row"]', { hasText: property.currentName }).first()).toBeVisible({ timeout: 10000 })

    await page.locator('[role="row"]', { hasText: property.currentName }).first().click()
    await expect(page).toHaveURL(/\/properties\/manage\/\d+(\/overview)?\/?$/, { timeout: 10000 })
    await expect(page.getByText(property.currentName).first()).toBeVisible({ timeout: 10000 })

    if (property.id) {
      await page.goto(`/properties/manage/${property.id}/tenants`)
    } else {
      await page.getByRole('tab', { name: /tenants/i }).click()
    }
    await expect(page.getByText(tenant.email)).toBeVisible({ timeout: 10000 })

    if (property.id) {
      await page.goto(`/properties/manage/${property.id}/units`)
    } else {
      await page.getByRole('tab', { name: /units/i }).click()
    }
    await expect(page.getByText('Unit 1')).toBeVisible({ timeout: 10000 })

    if (property.id) {
      await page.goto(`/properties/manage/${property.id}/maintenance`)
    } else {
      await page.getByRole('tab', { name: /maintenance/i }).click()
    }
    await expect(page.getByText(QA_MAINTENANCE.title)).toBeVisible({ timeout: 10000 })

    await page.goto('/tenants/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })
    await page.getByPlaceholder('Quick Search').fill(tenant.currentName)
    await expect(page.locator('[role="row"]', { hasText: tenant.currentName }).first()).toBeVisible({ timeout: 10000 })

    await page.goto('/communication')
    await expect(page.getByText(issue.title).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(QA_ISSUE.comment)).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(new RegExp(user.fullName, 'i')).first()).toBeVisible({ timeout: 10000 })

    await page.goto('/audit')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const token = await page.evaluate(() => window.localStorage.getItem('accessToken'))
    const auditResponse = await page.request.get(`${process.env.E2E_API_URL || 'http://127.0.0.1:2024'}/auditlogs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(auditResponse.ok()).toBeTruthy()

    const auditPayload = await auditResponse.json()
    const auditItems = Array.isArray(auditPayload?.data?.items) ? auditPayload.data.items : []
    expect(
      auditItems.some(item => item?.endpoint === '/properties' && item?.user_action === 'Created')
    ).toBeTruthy()
    expect(
      auditItems.some(item => item?.endpoint === '/tenants' && item?.user_action === 'Created')
    ).toBeTruthy()
    expect(
      auditItems.some(item => item?.endpoint === '/communication/issues' && item?.user_action === 'Created')
    ).toBeTruthy()
    expect(
      auditItems.some(item => item?.endpoint?.includes('/communication/issues/') && item?.endpoint?.endsWith('/comments'))
    ).toBeTruthy()
  })

  test('PHASE 3 UPDATE — modify created entities and verify blocked maintenance behavior intentionally', async ({ page }) => {
    test.setTimeout(180_000)

    const property = getEntity('property')
    const tenant = getEntity('tenant')
    const issue = getEntity('issue')

    if (property.id) {
      await page.goto(`/properties/manage/${property.id}/settings`)
    } else {
      await page.goto('/properties/management')
      await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })
      await page.getByPlaceholder('Search Properties').fill(property.currentName)
      await page.locator('[role="row"]', { hasText: property.currentName }).first().click()
      await expect(page).toHaveURL(/\/properties\/manage\/\d+(\/overview)?\/?$/, { timeout: 10000 })
      await page.getByRole('tab', { name: /settings/i }).click()
    }
    await clearAndFill(page, 'Phone Number', QA_PROPERTY.updatedPhone)
    const saveChangesButton = page.getByRole('button', { name: /save changes/i })
    await expect(saveChangesButton).toBeEnabled({ timeout: 10000 })
    const propertyUpdateResponse = page.waitForResponse(
      res => res.url().includes('/properties') && res.request().method() === 'PUT'
    )
    await saveChangesButton.click()
    const propertyPut = await propertyUpdateResponse
    expect(propertyPut.status()).toBeLessThan(400)
    await expect(page.getByText(/property updated successfully/i)).toBeVisible({ timeout: 10000 })
    await page.reload({ waitUntil: 'networkidle' })
    await expect(page.getByRole('textbox', { name: /phone/i })).toHaveValue(QA_PROPERTY.updatedPhone)
    recordEntity('property', {
      currentPhone: QA_PROPERTY.updatedPhone,
    })

    await page.goto('/tenants/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })
    await page.getByPlaceholder('Quick Search').fill(tenant.currentName)
    const tenantRow = page.locator('[role="row"]', { hasText: tenant.currentName }).first()
    await expect(tenantRow).toBeVisible({ timeout: 10000 })
    await tenantRow.locator('button:has(svg)').last().click()
    await page.getByRole('menuitem', { name: 'Edit' }).click()

    const tenantDrawer = page.getByRole('dialog')
    await expect(tenantDrawer).toBeVisible({ timeout: 5000 })
    const tenantUpdateResponse = page.waitForResponse(
      res => res.url().includes('/tenants') && res.request().method() === 'PUT'
    )
    await clearAndFill(page, 'Tenant Address', QA_TENANT.updatedAddress, tenantDrawer)
    await tenantDrawer.getByRole('button', { name: /^edit tenant$/i }).click()
    const tenantPut = await tenantUpdateResponse
    expect(tenantPut.status()).toBeLessThan(400)
    await expect(page.getByText(/change applied/i)).toBeVisible({ timeout: 10000 })
    recordEntity('tenant', { currentAddress: QA_TENANT.updatedAddress })

    if (property.id) {
      await page.goto(`/properties/manage/${property.id}/maintenance`)
    } else {
      await page.goto('/properties/management')
      await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })
      await page.getByPlaceholder('Search Properties').fill(property.currentName)
      await page.locator('[role="row"]', { hasText: property.currentName }).first().click()
      await page.getByRole('tab', { name: /maintenance/i }).click()
    }
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })
    const firstMaintenanceRow = page.locator('[role="row"][data-rowindex="0"]').first()
    await firstMaintenanceRow.locator('button:has(svg)').last().click()
    const manageMenuItem = page.getByRole('menuitem', { name: /manage/i })
    await expect(manageMenuItem).toBeVisible({ timeout: 10000 })
    await manageMenuItem.click()
    const maintenanceDrawer = page.getByRole('dialog')
    await expect(maintenanceDrawer).toBeVisible({ timeout: 10000 })
    await expect(maintenanceDrawer.getByText(/view-only for now/i)).toBeVisible({ timeout: 10000 })
    await expect(maintenanceDrawer.getByRole('button', { name: /submit/i })).toBeDisabled()
    appendNote({
      phase: 'UPDATE',
      detail: 'Maintenance manage flow intentionally remains view-only until the correct update contract exists.',
    })

    await page.goto('/communication')
    await expect(page.getByText(issue.title).first()).toBeVisible({ timeout: 10000 })
    const statusUpdateResponse = page.waitForResponse(
      res =>
        res.url().includes('/communication/issues/') &&
        res.url().includes('/status') &&
        res.request().method() === 'PATCH'
    )
    await page.getByLabel('Issue Status').click()
    await page.getByRole('option', { name: 'In Progress' }).click()
    const issuePatch = await statusUpdateResponse
    expect(issuePatch.status()).toBeLessThan(400)
    await expect(page.getByLabel('Issue Status')).toContainText('In Progress')
    recordEntity('issue', { status: 'In Progress' })
  })

  test('PHASE 4 DELETE — close the issue and delete the tenant and property', async ({ page }) => {
    const property = getEntity('property')
    const tenant = getEntity('tenant')
    const issue = getEntity('issue')

    await page.goto('/communication')
    await expect(page.getByText(issue.title).first()).toBeVisible({ timeout: 10000 })
    const closeResponse = page.waitForResponse(
      res =>
        res.url().includes('/communication/issues/') &&
        res.url().includes('/status') &&
        res.request().method() === 'PATCH'
    )
    await page.getByLabel('Issue Status').click()
    await page.getByRole('option', { name: 'Closed' }).click()
    const issueClosed = await closeResponse
    expect(issueClosed.status()).toBeLessThan(400)
    await expect(page.getByLabel('Issue Status')).toContainText('Closed')
    recordEntity('issue', { status: 'Closed' })

    await page.goto('/tenants/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })
    await page.getByPlaceholder('Quick Search').fill(tenant.currentName)
    const tenantRow = page.locator('[role="row"]', { hasText: tenant.currentName }).first()
    await expect(tenantRow).toBeVisible({ timeout: 10000 })
    page.on('dialog', dialog => dialog.accept())
    await tenantRow.locator('button:has(svg)').last().click()
    await page.getByRole('menuitem', { name: /^delete account$/i }).click()
    await expect(page.getByText(/tenant deleted successfully/i)).toBeVisible({ timeout: 10000 })
    recordEntity('tenant', { deleted: true })

    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })
    await page.getByPlaceholder('Search Properties').fill(property.currentName)
    const propertyRow = page.locator('[role="row"]', { hasText: property.currentName }).first()
    await expect(propertyRow).toBeVisible({ timeout: 10000 })
    const propertyDeleteResponse = page.waitForResponse(
      res => res.url().includes('/properties') && res.request().method() === 'DELETE'
    )
    await propertyRow.locator('button:has(svg)').last().click()
    await page.getByRole('menuitem', { name: 'Delete' }).click()
    const deletedProperty = await propertyDeleteResponse
    expect(deletedProperty.status()).toBeLessThan(400)
    await expect(page.getByText(/property deleted successfully/i)).toBeVisible({ timeout: 10000 })
    recordEntity('property', { deleted: true })
  })

  test('PHASE 5 READ AGAIN — verify clean state and retained audit history', async ({ page }) => {
    const property = getEntity('property')
    const tenant = getEntity('tenant')
    const issue = getEntity('issue')

    await page.goto('/dashboard')
    await expect(page.getByText('Total tenants')).toBeVisible({ timeout: 15000 })

    await page.goto('/properties/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })
    await page.getByPlaceholder('Search Properties').fill(property.currentName)
    await expect(page.locator('[role="row"]', { hasText: property.currentName })).toHaveCount(0)

    await page.goto('/tenants/management')
    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })
    await page.getByPlaceholder('Quick Search').fill(tenant.currentName)
    await expect(page.locator('[role="row"]', { hasText: tenant.currentName })).toHaveCount(0)

    await page.goto('/communication')
    await expect(page.getByText(issue.title).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByLabel('Issue Status')).toContainText('Closed')

    const token = await page.evaluate(() => window.localStorage.getItem('accessToken'))
    const auditResponse = await page.request.get(`${process.env.E2E_API_URL || 'http://127.0.0.1:2024'}/auditlogs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    expect(auditResponse.ok()).toBeTruthy()
    const auditPayload = await auditResponse.json()
    const auditItems = Array.isArray(auditPayload?.data?.items) ? auditPayload.data.items : []
    expect(
      auditItems.some(item => item?.endpoint === '/tenants' && item?.user_action === 'Deleted')
    ).toBeTruthy()
    expect(
      auditItems.some(item => item?.endpoint?.startsWith('/properties/') && item?.user_action === 'Deleted')
    ).toBeTruthy()
    expect(
      auditItems.some(item => item?.endpoint?.includes('/communication/issues/') && item?.endpoint?.endsWith('/status'))
    ).toBeTruthy()
  })
})
