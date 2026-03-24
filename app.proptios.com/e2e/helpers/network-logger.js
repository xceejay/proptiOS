/**
 * Attaches network request/response logging to a Playwright page.
 *
 * Captures all API calls (method, URL, status, response body for errors)
 * and writes them to a log file after the test completes.
 *
 * Usage:
 *   const { attachNetworkLogger } = require('./helpers/network-logger')
 *   const network = attachNetworkLogger(page, 'my-test-name')
 *   // ... run your test ...
 *   await network.flush()   // writes e2e/logs/<test-name>.log
 */

const fs = require('fs')
const path = require('path')

const LOG_DIR = path.join(__dirname, '..', 'logs')

function attachNetworkLogger(page, testName) {
  const lines = []
  const startTime = Date.now()

  function ts() {
    return `+${Date.now() - startTime}ms`
  }

  function record(line) {
    lines.push(line)
    console.log(line)
  }

  page.on('request', req => {
    if (isNoise(req.url())) return
    record(`[${ts()}] -> ${req.method()} ${req.url()}`)

    // Log POST/PUT/PATCH request bodies
    const method = req.method()
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      try {
        const postData = req.postData()
        if (postData) {
          const truncated = postData.length > 1000 ? postData.slice(0, 1000) + '...' : postData
          record(`   request body: ${truncated}`)
        }
      } catch {
        // ignore
      }
    }
  })

  page.on('response', async res => {
    const url = res.url()
    if (isNoise(url)) return

    const method = res.request().method()
    const status = res.status()
    const prefix = status >= 400 ? '✗' : '✓'

    record(`[${ts()}] ${prefix} ${status} ${method} ${url}`)

    // Log response body for API calls and errors
    if (status >= 400 || isApiCall(url)) {
      try {
        const body = await res.text()
        const truncated = body.length > 2000 ? body.slice(0, 2000) + '...' : body
        record(`   response body: ${truncated}`)
      } catch {
        record(`   response body: <could not read>`)
      }
    }
  })

  page.on('requestfailed', req => {
    if (isNoise(req.url())) return
    const failure = req.failure()
    record(`[${ts()}] ✗ FAILED ${req.method()} ${req.url()} — ${failure?.errorText || 'unknown'}`)
  })

  return {
    lines,

    /** Write captured log to e2e/logs/<testName>.log */
    async flush() {
      if (!fs.existsSync(LOG_DIR)) {
        fs.mkdirSync(LOG_DIR, { recursive: true })
      }
      const safeName = testName.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 100)
      const logFile = path.join(LOG_DIR, `${safeName}.log`)
      const header = `Network log for: ${testName}\nDate: ${new Date().toISOString()}\n${'='.repeat(80)}\n\n`
      fs.writeFileSync(logFile, header + lines.join('\n') + '\n')
    },

    /** Fail if any 5xx responses were captured */
    assertNoServerErrors() {
      const serverErrors = lines.filter(l => /✗ 5\d{2}/.test(l))
      if (serverErrors.length > 0) {
        throw new Error(`Server errors detected:\n${serverErrors.join('\n')}`)
      }
    },
  }
}

function isNoise(url) {
  return (
    url.includes('_next/') ||
    url.includes('webpack') ||
    url.includes('hot-update') ||
    url.includes('.js') ||
    url.includes('.css') ||
    url.includes('.svg') ||
    url.includes('.png') ||
    url.includes('.ico') ||
    url.includes('.woff') ||
    url.includes('favicon') ||
    url.includes('__nextjs')
  )
}

function isApiCall(url) {
  return url.includes('/api/') || url.includes(':2024') || url.includes('api.pm.proptios')
}

module.exports = { attachNetworkLogger }
