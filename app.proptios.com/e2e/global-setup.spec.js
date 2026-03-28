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

const API_BASE =
  process.env.E2E_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:2024'
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
  console.log('setup:persistAuthState:start', email)
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
  console.log('setup:persistAuthState:done', email)
}

async function registerViaUi(page, user) {
  console.log('setup:registerViaUi:start', user.email)
  await page.goto('/register', { waitUntil: 'networkidle' })
  if (!page.url().includes('/register')) {
    const createAccountLink = page.getByRole('link', { name: /create an account/i })
    if (await createAccountLink.isVisible().catch(() => false)) {
      await createAccountLink.click()
    }
  }

  const fullNameInput = page.getByPlaceholder('Joel Amoako')
  const companyInput = page.getByPlaceholder('proptios.com Property Management LTD')
  const siteIdInput = page.getByPlaceholder('mypmcompany')
  const emailInput = page.getByPlaceholder('admin@proptios.com')
  const passwordInput = page.locator('#auth-login-v2-password')
  const countrySelect = page.getByRole('combobox').nth(0)
  const currencySelect = page.getByRole('combobox').nth(1)

  await expect(page).toHaveURL(/\/register/, { timeout: 15000 })
  await expect(fullNameInput).toBeVisible({ timeout: 15000 })

  await fullNameInput.fill(user.fullName)
  await expect(fullNameInput).toHaveValue(user.fullName)
  console.log('setup:filled:full_name')
  await page.locator('input[type="file"]').setInputFiles(ID_CARD_PATH)
  console.log('setup:filled:id_card')
  await countrySelect.click()
  await page.getByRole('option', { name: 'Ghana' }).click()
  if (await page.getByRole('listbox').isVisible().catch(() => false)) {
    await page.keyboard.press('Escape')
  }
  console.log('setup:filled:country')
  await currencySelect.click()
  await page.getByRole('option', { name: 'Ghanaian Cedi' }).click()
  if (await page.getByRole('listbox').isVisible().catch(() => false)) {
    await page.keyboard.press('Escape')
  }
  console.log('setup:filled:currency')
  await companyInput.fill(user.siteName)
  await expect(companyInput).toHaveValue(user.siteName)
  console.log('setup:filled:company')
  await siteIdInput.fill(user.siteId)
  await expect(siteIdInput).toHaveValue(user.siteId)
  console.log('setup:filled:site_id')
  await emailInput.fill(user.email)
  await expect(emailInput).toHaveValue(user.email)
  console.log('setup:filled:email')
  await passwordInput.fill(user.password)
  await expect(passwordInput).toHaveValue(user.password)
  console.log('setup:filled:password')
  await page.getByRole('checkbox', { name: /i agree to/i }).check()
  console.log('setup:filled:checkbox')

  const registerResponse = page.waitForResponse(
    res => res.url().includes('/auth/register') && res.request().method() === 'POST'
  )

  await page.getByRole('button', { name: /create an account/i }).click()
  console.log('setup:clicked:submit')

  const response = await registerResponse
  console.log('setup:register:response', response.status())
  expect(response.status(), `Register API call failed: ${await response.text()}`).toBeLessThan(400)
  await expect(page).toHaveURL(/\/onboarding\/success/, { timeout: 20000 })
  console.log('setup:registerViaUi:done', user.email)
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
