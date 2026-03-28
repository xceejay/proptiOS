const base = require('@playwright/test')
const fs = require('fs')
const { attachNetworkLogger } = require('./network-logger')
const { AUTH_FILE, AUTH_MODE, readTestUser } = require('./auth-state')

/**
 * Test fixtures with two session modes controlled by E2E_ISOLATE env var.
 *
 * Default (E2E_ISOLATE unset): Single session — one browser, one page for all tests.
 *   Behaves like a real user: open browser, do everything, close.
 *
 * E2E_ISOLATE=1: Isolated — fresh page per test for strict independence.
 *   Useful for CI or debugging flaky state leaks between tests.
 *
 * Usage:
 *   pnpm test:e2e              # single session (default)
 *   pnpm test:e2e:isolate      # fresh page per test
 */
const ISOLATE = !!process.env.E2E_ISOLATE

async function loginViaUi(page) {
  const { email, password } = readTestUser()
  await page.goto('/login')
  await base.expect(page.getByLabel('Email')).toBeVisible({ timeout: 15000 })
  await page.getByLabel('Email').fill(email)
  await page.locator('#auth-login-v2-password').fill(password)

  const loginResponse = page.waitForResponse(
    res => res.url().includes('/auth/login') && res.request().method() === 'POST'
  )

  await page.getByRole('button', { name: /login/i }).click()

  const response = await loginResponse
  base.expect(response.status()).toBeLessThan(400)
  await base.expect(page).not.toHaveURL(/\/login/, { timeout: 15000 })
}

let test

if (ISOLATE) {
  // Fresh page per test — default Playwright behaviour, just add network logging
  test = base.test.extend({
    page: async ({ page }, use, testInfo) => {
      const network = attachNetworkLogger(page, testInfo.title)
      await use(page)
      await network.flush()
    },
  })
} else {
  // Single session — one page shared across all tests in the worker
  test = base.test.extend({
    // Worker-scoped shared context + page
    _sharedContext: [
      async ({ browser }, use) => {
        const ctx = await browser.newContext({
          storageState:
            AUTH_MODE === 'onboarding' && fs.existsSync(AUTH_FILE)
              ? AUTH_FILE
              : { cookies: [], origins: [] },
        })
        await use(ctx)
        await ctx.close()
      },
      { scope: 'worker' },
    ],
    _sharedPage: [
      async ({ _sharedContext }, use) => {
        const page = await _sharedContext.newPage()
        if (AUTH_MODE !== 'onboarding') {
          await loginViaUi(page)
        }
        await use(page)
      },
      { scope: 'worker' },
    ],
    // Override the built-in page fixture (test-scoped) to return the shared page
    page: async ({ _sharedPage }, use) => {
      await use(_sharedPage)
    },
  })
}

module.exports = { test, expect: base.expect }
