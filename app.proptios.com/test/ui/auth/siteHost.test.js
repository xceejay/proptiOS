import {
  buildTenantAppHost,
  buildTenantAppUrl,
  isSharedSiteHost,
  normalizeSiteHost,
  resolveRequestedSiteHost,
} from 'src/utils/siteHost'

describe('siteHost utilities', () => {
  it('treats shared app hosts as non-tenant hosts', () => {
    expect(isSharedSiteHost('app.proptios.com')).toBe(true)
    expect(isSharedSiteHost('staging.app.proptios.com')).toBe(true)
    expect(isSharedSiteHost('preview-app.vercel.app')).toBe(true)
  })

  it('normalizes requested staging tenant hosts back to the canonical site id', () => {
    expect(resolveRequestedSiteHost('staging.riverfront.proptios.com')).toBe('riverfront.proptios.com')
    expect(resolveRequestedSiteHost('riverfront.proptios.com')).toBe('riverfront.proptios.com')
  })

  it('builds the correct tenant host for production and staging shared app hosts', () => {
    expect(buildTenantAppHost('riverfront.proptios.com', 'app.proptios.com')).toBe('riverfront.proptios.com')
    expect(buildTenantAppHost('riverfront.proptios.com', 'staging.app.proptios.com')).toBe(
      'staging.riverfront.proptios.com'
    )
  })

  it('builds an absolute tenant url when running from a deployed shared app host', () => {
    expect(buildTenantAppUrl('riverfront.proptios.com', 'app.proptios.com', '/dashboard')).toBe(
      'https://riverfront.proptios.com/dashboard'
    )
    expect(buildTenantAppUrl('riverfront.proptios.com', 'staging.app.proptios.com', '/dashboard')).toBe(
      'https://staging.riverfront.proptios.com/dashboard'
    )
  })

  it('returns only the path when running on localhost', () => {
    expect(buildTenantAppUrl('riverfront.proptios.com', '127.0.0.1', '/dashboard')).toBe('/dashboard')
    expect(normalizeSiteHost('https://Riverfront.proptios.com:443/dashboard')).toBe('riverfront.proptios.com')
  })
})
