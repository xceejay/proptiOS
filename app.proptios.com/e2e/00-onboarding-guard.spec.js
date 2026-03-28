const path = require('path')
const { test, expect } = require('@playwright/test')

const ID_CARD_PATH = path.join(__dirname, 'fixtures', 'test-id-card.pdf')

function buildGuestUser() {
  const seed = Date.now().toString(36)
  const suffix = Math.random().toString(36).slice(2, 8)
  const siteSlug = `guard-${seed}-${suffix}`.toLowerCase()

  return {
    email: `qa+${siteSlug}@example.com`,
    password: `Pass!${seed}${suffix}`,
    fullName: `QA ${siteSlug}`,
    siteName: `QA ${siteSlug}`,
    siteId: siteSlug,
  }
}

test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Onboarding Guard Rails', () => {
  test('create account without agreeing to terms shows an error and does not get stuck loading', async ({
    page,
  }) => {
    const user = buildGuestUser()
    let registerRequestCount = 0

    page.on('request', request => {
      if (request.url().includes('/auth/register') && request.method() === 'POST') {
        registerRequestCount += 1
      }
    })

    await page.goto('/register', { waitUntil: 'networkidle' })

    await page.getByPlaceholder('Joel Amoako').fill(user.fullName)
    await page.locator('input[type="file"]').setInputFiles(ID_CARD_PATH)
    await page.getByRole('combobox').nth(0).click()
    await page.getByRole('option', { name: 'Ghana' }).click()
    if (await page.getByRole('listbox').isVisible().catch(() => false)) {
      await page.keyboard.press('Escape')
    }
    await page.getByRole('combobox').nth(1).click()
    await page.getByRole('option', { name: 'Ghanaian Cedi' }).click()
    if (await page.getByRole('listbox').isVisible().catch(() => false)) {
      await page.keyboard.press('Escape')
    }
    await page.getByPlaceholder('proptios.com Property Management LTD').fill(user.siteName)
    await page.getByPlaceholder('mypmcompany').fill(user.siteId)
    await page.getByPlaceholder('admin@proptios.com').fill(user.email)
    await page.locator('#auth-login-v2-password').fill(user.password)

    await page.getByRole('button', { name: /create an account/i }).click()

    await expect(page.getByText('You must agree to the privacy policy & terms.')).toBeVisible()
    await expect(page.getByRole('button', { name: /create an account/i })).toBeVisible()
    await expect(page.getByRole('progressbar')).toHaveCount(0)
    await expect(page).toHaveURL(/\/register/, { timeout: 5000 })
    expect(registerRequestCount).toBe(0)
  })
})
