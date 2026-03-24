const base = require('@playwright/test')
const { attachNetworkLogger } = require('./network-logger')

/**
 * Extended test fixture that automatically attaches network logging to every test.
 *
 * Logs are written to e2e/logs/<test-name>.log after each test completes.
 *
 * Usage in spec files:
 *   const { test, expect } = require('./helpers/fixtures')
 *   // That's it — page already has network logging attached.
 */
const test = base.test.extend({
  page: async ({ page }, use, testInfo) => {
    const network = attachNetworkLogger(page, testInfo.title)
    await use(page)
    await network.flush()
  },
})

module.exports = { test, expect: base.expect }
