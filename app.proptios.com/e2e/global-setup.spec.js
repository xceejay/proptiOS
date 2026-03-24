/**
 * Auth setup — runs once before all other tests.
 *
 * Calls the local API to get a JWT, then saves it into the Playwright
 * storage-state file so every subsequent test page already has
 * localStorage.accessToken set and AuthGuard lets it through.
 */
const { test: setup, expect } = require('@playwright/test')
const path = require('path')

const AUTH_FILE = path.join(__dirname, '.auth.json')

const EMAIL = process.env.E2E_EMAIL || 'joel@example.com'
const PASSWORD = process.env.E2E_PASSWORD || 'password@123'
// Must match the API the frontend is pointed at (set in playwright.config.js webServer.env)
const API_BASE = process.env.E2E_API_URL || 'http://127.0.0.1:2024'

setup('authenticate', async ({ page }) => {
  // 1. Get a JWT from the API
  const res = await page.request.post(`${API_BASE}/auth/login`, {
    data: { email: EMAIL, password: PASSWORD },
  })
  expect(res.ok(), `Login API call failed: ${res.status()} ${await res.text()}`).toBeTruthy()

  const body = await res.json()
  expect(body.status, 'Login response status should be SUCCESS').toBe('SUCCESS')

  const token = body.data.token
  expect(token, 'JWT token should be present').toBeTruthy()

  // 2. Navigate to the login page — this won't trigger AuthGuard logout
  //    because login page doesn't redirect away or clear localStorage.
  await page.goto('/login')

  // 3. Inject the JWT — AuthGuard reads localStorage.accessToken on mount
  await page.evaluate(accessToken => {
    window.localStorage.setItem('accessToken', accessToken)
  }, token)

  // 4. Verify the token was actually persisted before saving
  const stored = await page.evaluate(() => window.localStorage.getItem('accessToken'))
  expect(stored, 'Token must be in localStorage before saving state').toBeTruthy()

  // 5. Save storage state (localStorage + cookies) for all subsequent tests
  await page.context().storageState({ path: AUTH_FILE })
})
