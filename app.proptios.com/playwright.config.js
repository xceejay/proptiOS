// @ts-check
const { defineConfig, devices } = require('@playwright/test')

const PORT = Number(process.env.E2E_PORT || 3001)
const BASE_URL = `http://127.0.0.1:${PORT}`
const API_URL = process.env.E2E_API_URL || 'http://127.0.0.1:2024'

module.exports = defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: 'list',

  use: {
    baseURL: BASE_URL,
    storageState: 'e2e/.auth.json',
    trace: 'on-first-retry',
  },

  // Start the Next.js dev server pointed at the local API
  webServer: {
    command: `./node_modules/.bin/next dev --hostname 127.0.0.1 --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !!process.env.CI,
    timeout: 30_000,
    env: {
      NEXT_PUBLIC_API_BASE_URL: API_URL,
    },
  },

  projects: [
    {
      name: 'setup',
      testMatch: '**/global-setup.spec.js',
      use: { storageState: { cookies: [], origins: [] } },
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],
})
