import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

describe('auth site routing source contracts', () => {
  it('threads tenant host information through the browser auth flow', () => {
    const authContextSource = fs.readFileSync(path.join(process.cwd(), 'src/context/AuthContext.js'), 'utf8')
    const axiosMiddlewareSource = fs.readFileSync(path.join(process.cwd(), 'src/pages/middleware/axios.js'), 'utf8')

    expect(authContextSource).toContain("import { buildTenantAppUrl, normalizeSiteHost, resolveCurrentSiteHost } from 'src/utils/siteHost'")
    expect(authContextSource).toContain('redirectToTenantSiteIfNeeded')
    expect(authContextSource).toContain('window.location.assign(targetUrl)')
    expect(axiosMiddlewareSource).toContain("import { resolveCurrentSiteHost } from 'src/utils/siteHost'")
    expect(axiosMiddlewareSource).toContain("config.headers['X-Site-Host'] = requestedSiteHost")
  })
})
