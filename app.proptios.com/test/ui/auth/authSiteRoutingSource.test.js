import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

describe('auth site routing source contracts', () => {
  it('threads tenant host information through the browser auth flow', () => {
    const authContextSource = fs.readFileSync(path.join(process.cwd(), 'src/context/AuthContext.js'), 'utf8')
    const axiosMiddlewareSource = fs.readFileSync(path.join(process.cwd(), 'src/pages/middleware/axios.js'), 'utf8')
    const guestGuardSource = fs.readFileSync(path.join(process.cwd(), 'src/@core/components/auth/GuestGuard.js'), 'utf8')

    expect(authContextSource).toContain("import { buildTenantAppUrl, normalizeSiteHost, resolveCurrentSiteHost } from 'src/utils/siteHost'")
    expect(authContextSource).toContain('redirectToTenantSiteIfNeeded')
    expect(authContextSource).toContain('window.location.assign(targetUrl)')
    expect(authContextSource).toContain('__skipAuthToast: true')
    expect(axiosMiddlewareSource).toContain("import { resolveCurrentSiteHost } from 'src/utils/siteHost'")
    expect(axiosMiddlewareSource).toContain("config.headers['X-Site-Host'] = requestedSiteHost")
    expect(axiosMiddlewareSource).toContain('const shouldSkipAuthToast')
    expect(guestGuardSource).not.toContain("alert('Logout to access this page')")
    expect(guestGuardSource).toContain('router.replace(returnUrl)')
  })

  it('uses shared auth storage helpers instead of raw localStorage reads in tenant contexts', () => {
    const files = [
      'src/context/SiteContext.js',
      'src/context/PropertiesContext.js',
      'src/context/TenantsContext.js',
      'src/context/LeasesContext.js',
      'src/context/UsersContext.js',
      'src/context/FinanceContext.js',
      'src/context/AuditContext.js',
      'src/context/CommunicationContext.js'
    ]

    for (const file of files) {
      const source = fs.readFileSync(path.join(process.cwd(), file), 'utf8')
      expect(source).toContain("getStoredAccessToken")
      expect(source).not.toContain("localStorage.getItem('accessToken')")
    }
  })
})
