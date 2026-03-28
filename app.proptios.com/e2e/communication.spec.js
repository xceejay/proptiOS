const { test, expect } = require('./helpers/fixtures')
const { readTestUser } = require('./helpers/auth-state')

const TIMESTAMP = Date.now()
const TEST_ISSUE = {
  title: `E2E Communication Issue ${TIMESTAMP}`,
  description: `Communication issue created by Playwright at ${TIMESTAMP}`,
  comment: `E2E comment ${TIMESTAMP}`,
}

test.describe.serial('Communication Issues', () => {
  test('CREATE/READ/UPDATE — create a real issue, comment, and change status', async ({ page }) => {
    const { fullName } = readTestUser()

    await page.goto('/communication')
    await expect(page.getByRole('tab', { name: 'Issues' })).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('Loading issues...')).toHaveCount(0, { timeout: 15000 })

    await expect(page.getByText('Loud Music Late at Night')).toHaveCount(0)
    await expect(page.getByText('Trash Left in Hallway')).toHaveCount(0)
    await expect(page.getByText('Broken Elevator')).toHaveCount(0)

    const createResponse = page.waitForResponse(
      res => res.url().includes('/communication/issues') && res.request().method() === 'POST'
    )

    await page.getByRole('button', { name: /create new issue/i }).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible({ timeout: 5000 })
    await dialog.getByLabel('Issue title').fill(TEST_ISSUE.title)
    await dialog.getByLabel('Issue description').fill(TEST_ISSUE.description)
    await dialog.getByRole('button', { name: /create issue/i }).click()

    const created = await createResponse
    expect(created.status()).toBeLessThan(400)

    await expect(page.getByText(TEST_ISSUE.title).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(TEST_ISSUE.description).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText(new RegExp(fullName, 'i')).first()).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Current User')).toHaveCount(0)

    const commentResponse = page.waitForResponse(
      res => res.url().includes('/communication/issues/') && res.url().includes('/comments') && res.request().method() === 'POST'
    )

    await page.getByPlaceholder('Add a comment...').fill(TEST_ISSUE.comment)
    await page.getByRole('button', { name: /^send$/i }).click()

    const commented = await commentResponse
    expect(commented.status()).toBeLessThan(400)
    await expect(page.getByText(TEST_ISSUE.comment)).toBeVisible({ timeout: 10000 })

    const statusResponse = page.waitForResponse(
      res => res.url().includes('/communication/issues/') && res.url().includes('/status') && res.request().method() === 'PATCH'
    )

    await page.getByLabel('Issue Status').click()
    await page.getByRole('option', { name: 'Closed' }).click()

    const updated = await statusResponse
    expect(updated.status()).toBeLessThan(400)
    await expect(page.getByLabel('Issue Status')).toContainText('Closed')
  })
})
