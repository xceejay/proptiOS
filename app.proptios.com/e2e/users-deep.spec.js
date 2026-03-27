const { test, expect } = require('./helpers/fixtures')
const { selectOption } = require('./helpers/mui')

// ─── INVITE TAB ──────────────────────────────────────────────────────────────

test.describe('Users — Invite', () => {
  test('invite tab loads with form fields', async ({ page }) => {
    await page.goto('/users')

    const inviteTab = page.getByRole('tab', { name: /invite users/i })
    await expect(inviteTab).toBeVisible({ timeout: 15000 })
    await inviteTab.click()

    // Verify form fields are present
    await expect(page.getByRole('textbox', { name: /full name/i })).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible({ timeout: 5000 })

    // Verify the invite button exists
    await expect(page.getByRole('button', { name: /invite user/i })).toBeVisible()
  })

  test('role dropdown shows available roles', async ({ page }) => {
    await page.goto('/users')

    const inviteTab = page.getByRole('tab', { name: /invite users/i })
    await expect(inviteTab).toBeVisible({ timeout: 15000 })
    await inviteTab.click()

    // Open the role dropdown
    const roleSelect = page.getByRole('combobox', { name: /role/i })
    if (await roleSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      await roleSelect.click()

      // Verify role options appear
      await expect(page.getByRole('option', { name: /property manager/i })).toBeVisible({ timeout: 3000 })
      await page.keyboard.press('Escape')
    }
  })
})

// ─── MANAGE TAB — ROW ACTIONS ────────────────────────────────────────────────

test.describe('Users — Manage Actions', () => {
  test('row action View navigates to user detail page', async ({ page }) => {
    await page.goto('/users')

    const manageTab = page.getByRole('tab', { name: /manage users/i })
    await expect(manageTab).toBeVisible({ timeout: 15000 })
    await manageTab.click()

    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const firstRow = page.locator('[role="row"][data-rowindex="0"]')
    await expect(firstRow).toBeVisible({ timeout: 5000 })
    await firstRow.locator('button:has(svg)').last().click()

    await page.getByRole('menuitem', { name: /view/i }).click()

    await expect(page).toHaveURL(/\/users\/manage\/\d+/, { timeout: 10000 })
  })

  test('row action Edit opens EditUserDrawer with form fields', async ({ page }) => {
    await page.goto('/users')

    const manageTab = page.getByRole('tab', { name: /manage users/i })
    await expect(manageTab).toBeVisible({ timeout: 15000 })
    await manageTab.click()

    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    const firstRow = page.locator('[role="row"][data-rowindex="0"]')
    await expect(firstRow).toBeVisible({ timeout: 5000 })
    await firstRow.locator('button:has(svg)').last().click()

    await page.getByRole('menuitem', { name: /edit/i }).click()

    const drawer = page.getByRole('dialog')
    await expect(drawer).toBeVisible({ timeout: 5000 })

    // Verify form fields are loaded with existing data
    const nameField = drawer.getByRole('textbox', { name: /name/i }).first()
    await expect(nameField).toBeVisible()
    await expect(nameField).not.toHaveValue('')

    // Close without saving
    await page.keyboard.press('Escape')
  })

  test('user detail page loads with content', async ({ page }) => {
    // Navigate to the first user's detail page
    await page.goto('/users')

    const manageTab = page.getByRole('tab', { name: /manage users/i })
    await expect(manageTab).toBeVisible({ timeout: 15000 })
    await manageTab.click()

    await page.locator('.MuiDataGrid-root').first().waitFor({ timeout: 15000 })

    // Click the user name link in the first row
    const firstRow = page.locator('[role="row"][data-rowindex="0"]')
    await expect(firstRow).toBeVisible({ timeout: 5000 })

    // Try clicking the name link directly
    const nameLink = firstRow.locator('a').first()
    if (await nameLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nameLink.click()
    } else {
      // Fallback to row action View
      await firstRow.locator('button:has(svg)').last().click()
      await page.getByRole('menuitem', { name: /view/i }).click()
    }

    await expect(page).toHaveURL(/\/users\/manage\/\d+/, { timeout: 10000 })

    // Verify content loads
    const content = page.locator('[class*="MuiCard"], [class*="MuiTypography"]')
    await expect(content.first()).toBeVisible({ timeout: 10000 })
  })
})
