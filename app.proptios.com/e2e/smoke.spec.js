/**
 * Smoke tests — exercise the main nav routes after auth is injected.
 *
 * Prerequisites:
 *   - Local API running on :2024
 *   - Frontend running on :3001 with NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:2024
 */
const { test, expect } = require('./helpers/fixtures')

const NAV_ROUTES = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/properties', label: 'Properties' },
  { path: '/tenants', label: 'Tenants' },
  { path: '/leases', label: 'Leases' },
  { path: '/finance', label: 'Finance' },
  { path: '/users', label: 'User Management' },
  { path: '/audit', label: 'Audit Log' },
  { path: '/communication', label: 'Communication' },
  { path: '/settings', label: 'Settings' },
]

async function assertPageLoaded(page, route) {
  await expect(page).not.toHaveURL(/\/login/, { timeout: 10000 })

  const content = page.locator([
    'h1', 'h2', 'h3', 'h4',
    '[class*="MuiTypography"]',
    '[class*="MuiTab"]',
    '[class*="MuiDataGrid"]',
    '[class*="MuiCard"]',
  ].join(', ')).first()

  await expect(content, `No content rendered on ${route}`).toBeVisible({ timeout: 10000 })
}

test.describe('Navigation smoke tests', () => {
  for (const { path, label } of NAV_ROUTES) {
    test(`${label} page loads`, async ({ page }) => {
      await page.goto(path)
      await assertPageLoaded(page, path)
    })
  }
})

test.describe('Login flow', () => {
  test('login form authenticates and redirects to dashboard', async ({ browser }) => {
    // Login tests need a blank session — no stored auth token
    const ctx = await browser.newContext({ storageState: { cookies: [], origins: [] } })
    const loginPage = await ctx.newPage()

    await loginPage.goto('/login')
    await expect(loginPage.getByLabel('Email')).toBeVisible()

    const loginResponse = loginPage.waitForResponse(
      res => res.url().includes('/auth/login') && res.request().method() === 'POST'
    )

    await loginPage.getByLabel('Email').fill(process.env.E2E_EMAIL || 'joel@example.com')
    await loginPage.locator('#auth-login-v2-password').fill(process.env.E2E_PASSWORD || 'password@123')
    await loginPage.getByRole('button', { name: /login/i }).click()

    const response = await loginResponse
    expect(response.status()).toBeLessThan(400)

    // After successful login, the app should redirect away from /login
    await expect(loginPage).not.toHaveURL(/\/login/, { timeout: 15000 })
    await ctx.close()
  })

  test('wrong password shows validation error', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: { cookies: [], origins: [] } })
    const loginPage = await ctx.newPage()

    await loginPage.goto('/login')
    await loginPage.getByLabel('Email').fill('joel@example.com')
    await loginPage.locator('#auth-login-v2-password').fill('wrongpassword')
    await loginPage.getByRole('button', { name: /login/i }).click()

    await expect(loginPage.getByText(/invalid|incorrect|email or password/i)).toBeVisible({ timeout: 8000 })
    await ctx.close()
  })
})
