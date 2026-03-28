const SHARED_SITE_HOSTS = new Set([
  'app.proptios.com',
  'app.staging.proptios.com',
  'api.pm.proptios.com',
  'api.staging.proptios.com',
  'www.proptios.com',
  'proptios.com',
  'localhost',
  '127.0.0.1',
])

export function normalizeSiteHost(value) {
  if (!value) return null

  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/:\d+$/, '')
    .replace(/\.$/, '')

  return normalized || null
}

export function isSharedSiteHost(value) {
  const normalized = normalizeSiteHost(value)
  if (!normalized) return true

  if (SHARED_SITE_HOSTS.has(normalized)) return true
  if (normalized.endsWith('.vercel.app')) return true
  if (normalized === '[::1]') return true

  return false
}

export function resolveRequestedSiteHost(value) {
  const normalized = normalizeSiteHost(value)
  if (!normalized || isSharedSiteHost(normalized)) {
    return null
  }

  if (normalized.endsWith('.staging.proptios.com')) {
    return normalized.replace(/\.staging\.proptios\.com$/, '.proptios.com')
  }

  return normalized
}

export function resolveCurrentSiteHost() {
  if (typeof window === 'undefined') return null

  return resolveRequestedSiteHost(window.location.hostname)
}

export function isStagingHost(value) {
  const normalized = normalizeSiteHost(value)
  if (!normalized) return false

  return normalized === 'app.staging.proptios.com' || normalized.endsWith('.staging.proptios.com')
}

export function buildTenantAppHost(siteId, currentHost) {
  const canonicalSiteId = normalizeSiteHost(siteId)
  const activeHost = normalizeSiteHost(currentHost)

  if (!canonicalSiteId) return null
  if (!activeHost || activeHost === 'localhost' || activeHost === '127.0.0.1') {
    return null
  }

  if (isStagingHost(activeHost) && !canonicalSiteId.startsWith('staging.')) {
    return canonicalSiteId.replace(/\.proptios\.com$/, '.staging.proptios.com')
  }

  return canonicalSiteId
}

export function buildTenantAppUrl(siteId, currentHost, path = '/') {
  const targetHost = buildTenantAppHost(siteId, currentHost)
  const normalizedPath = path && path.startsWith('/') ? path : `/${path || ''}`

  if (!targetHost) return normalizedPath

  return `https://${targetHost}${normalizedPath}`
}
