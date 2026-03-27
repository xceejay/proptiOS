const { expect } = require('@playwright/test')

/**
 * MUI interaction helpers for Playwright e2e tests.
 *
 * Key issues solved:
 * 1. MUI DataGrid column menus have aria-labels like "Property Name column menu"
 *    that conflict with drawer form labels. We scope to a container (e.g. drawer).
 * 2. MUI TextField with `select` prop renders a hidden <input> and a visible
 *    <div role="combobox"> trigger. We target the combobox role.
 */

/**
 * Open an MUI Select dropdown by its label text and pick an option.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} label - The label text of the select field
 * @param {string|RegExp} optionText - The option to pick
 * @param {import('@playwright/test').Locator} [container] - Scope (e.g. drawer locator)
 */
async function selectOption(page, label, optionText, container) {
  const scope = container || page
  // MUI TextField with select renders a div[role="combobox"] with aria-labelledby
  // pointing to the InputLabel. Try combobox role first.
  let trigger = scope.getByRole('combobox', { name: label })

  if ((await trigger.count()) === 0) {
    // Fallback: find the FormControl by label, then the combobox inside it
    const control = scope.locator('.MuiFormControl-root', {
      has: page.locator(`label`, { hasText: label }),
    })
    trigger = control.locator('[role="combobox"], .MuiSelect-select')
  }

  await trigger.click()
  await page.getByRole('option', { name: optionText }).click()
}

/**
 * Open an MUI Select, pick the first available option.
 * Returns true if an option was picked, false if dropdown was empty.
 */
async function selectFirstOption(page, label, container) {
  const scope = container || page
  let trigger = scope.getByRole('combobox', { name: label })

  if ((await trigger.count()) === 0) {
    const control = scope.locator('.MuiFormControl-root', {
      has: page.locator(`label`, { hasText: label }),
    })
    trigger = control.locator('[role="combobox"], .MuiSelect-select')
  }

  await trigger.click()

  const options = page.getByRole('option')
  const option = options.first()
  const visible = await option.isVisible({ timeout: 10000 }).catch(() => false)
  if (visible) {
    const optionText = (await option.textContent())?.trim()
    await option.click()

    if (optionText) {
      await expect(trigger).toContainText(optionText, { timeout: 5000 })
    }

    return true
  }
  await page.keyboard.press('Escape')
  return false
}

/**
 * Open an MUI multi-select dropdown, pick one or more options, then close.
 */
async function selectMultiple(page, label, optionTexts, container) {
  const scope = container || page
  let trigger = scope.getByRole('combobox', { name: label })

  if ((await trigger.count()) === 0) {
    const control = scope.locator('.MuiFormControl-root', {
      has: page.locator(`label`, { hasText: label }),
    })
    trigger = control.locator('[role="combobox"], .MuiSelect-select')
  }

  await trigger.click()

  for (const text of optionTexts) {
    await page.getByRole('option', { name: text }).click()
  }

  await page.keyboard.press('Escape')
}

/**
 * Click-to-focus and fill an MUI text field by its label.
 * Uses getByRole('textbox') to avoid matching DataGrid column menu buttons.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} label - The label of the text field
 * @param {string} value - The value to fill
 * @param {import('@playwright/test').Locator} [container] - Scope (e.g. drawer locator)
 */
async function fillField(page, label, value, container) {
  const scope = container || page
  // Use getByRole to avoid matching DataGrid column menu aria-labels
  let input = scope.getByRole('textbox', { name: label })

  // If textbox not found, try spinbutton (number inputs) or generic getByLabel
  if ((await input.count()) === 0) {
    input = scope.getByRole('spinbutton', { name: label })
  }
  if ((await input.count()) === 0) {
    input = scope.getByLabel(label)
  }

  await input.click()
  await input.fill(value)
}

/**
 * Clear and refill an existing MUI text field value.
 */
async function clearAndFill(page, label, value, container) {
  const scope = container || page
  let input = scope.getByRole('textbox', { name: label })

  if ((await input.count()) === 0) {
    input = scope.getByRole('spinbutton', { name: label })
  }
  if ((await input.count()) === 0) {
    input = scope.getByLabel(label)
  }

  await input.click()
  await input.clear()
  await input.fill(value)
}

/**
 * Select by explicit element ID (for fields with custom id props).
 */
async function selectOptionById(page, id, optionText) {
  await page.locator(`#${id}`).click()
  await page.getByRole('option', { name: optionText }).click()
}

module.exports = { selectOption, selectFirstOption, selectMultiple, fillField, clearAndFill, selectOptionById }
