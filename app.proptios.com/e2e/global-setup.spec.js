/**
 * Auth setup — runs once before all other tests.
 *
 * Default mode logs in with the configured test user.
 * Onboarding mode creates a brand new account via the register page,
 * then logs in with that account and saves storage state.
 */
const { test: setup, expect } = require('@playwright/test')
const path = require('path')
const {
  AUTH_FILE,
  AUTH_MODE,
  clearAuthState,
  readTestUser,
  writeTestUser,
} = require('./helpers/auth-state')

const API_BASE = process.env.E2E_API_URL || 'http://127.0.0.1:2024'
const ID_CARD_PATH = path.join(__dirname, 'fixtures', 'test-id-card.pdf')

function buildFreshUser() {
  const seed = Date.now().toString(36)
  const suffix = Math.random().toString(36).slice(2, 8)
  const siteSlug = `qa-${seed}-${suffix}`.toLowerCase()

  return {
    email: `qa+${siteSlug}@example.com`,
    password: `Pass!${seed}${suffix}`,
    fullName: `QA ${siteSlug}`,
    siteName: `QA ${siteSlug}`,
    siteId: siteSlug,
  }
}

async function persistAuthState(page, email, password) {
  const res = await page.request.post(`${API_BASE}/auth/login`, {
    data: { email, password },
  })
  expect(res.ok(), `Login API call failed: ${res.status()} ${await res.text()}`).toBeTruthy()

  const body = await res.json()
  expect(body.status, 'Login response status should be SUCCESS').toBe('SUCCESS')

  const token = body.data.token
  expect(token, 'JWT token should be present').toBeTruthy()

  await page.goto('/login')
  await page.evaluate(accessToken => {
    window.localStorage.setItem('accessToken', accessToken)
  }, token)

  const stored = await page.evaluate(() => window.localStorage.getItem('accessToken'))
  expect(stored, 'Token must be in localStorage before saving state').toBeTruthy()

  await page.context().storageState({ path: AUTH_FILE })
}

async function registerViaUi(page, user) {
  await page.goto('/register')
  await expect(page.getByLabel('Full name')).toBeVisible({ timeout: 15000 })

  await page.getByLabel('Full name').fill(user.fullName)
  await page.locator('input[type="file"]').setInputFiles(ID_CARD_PATH)
  await page.getByLabel('Country').click()
  await page.getByRole('option', { name: 'Ghana' }).click()
  await page.getByLabel('Default Currency').click()
  await page.getByRole('option', { name: /Ghanaian Cedi/i }).click()
  await page.getByLabel('Affiliated Company').fill(user.siteName)
  await page.locator('input[name="site_id"]').fill(user.siteId)
  await page.getByLabel('Email').fill(user.email)
  await page.locator('#auth-login-v2-password').fill(user.password)
  await page.getByRole('checkbox').check()

  const registerResponse = page.waitForResponse(
    res => res.url().includes('/auth/register') && res.request().method() === 'POST'
  )

  await page.getByRole('button', { name: /create an account/i }).click()

  const response = await registerResponse
  expect(response.status(), `Register API call failed: ${await response.text()}`).toBeLessThan(400)
  await expect(page).toHaveURL(/\/onboarding\/success/, { timeout: 20000 })
}

setup('authenticate', async ({ page }) => {
  clearAuthState()

  if (AUTH_MODE === 'onboarding') {
    const user = buildFreshUser()
    writeTestUser(user)
    await registerViaUi(page, user)
    await persistAuthState(page, user.email, user.password)
    return
  }

  const user = readTestUser()
  writeTestUser(user)
  await persistAuthState(page, user.email, user.password)
})
