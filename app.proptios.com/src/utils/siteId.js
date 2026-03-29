export const SITE_DOMAIN_SUFFIX = '.proptios.com'
export const SITE_ID_LABEL_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/

export const normalizeSiteIdLabel = value =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')

export const isValidSiteIdLabel = value => SITE_ID_LABEL_PATTERN.test(String(value || '').trim().toLowerCase())

export const buildCanonicalSiteId = value => `${normalizeSiteIdLabel(value)}${SITE_DOMAIN_SUFFIX}`
