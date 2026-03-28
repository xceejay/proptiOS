import authConfig from 'src/configs/auth'
import { normalizeSiteHost } from 'src/utils/siteHost'

const COOKIE_MAX_AGE = 60 * 60 * 24
const COOKIE_NAME = authConfig.storageTokenKeyName

function getCookieDomain(hostname) {
  const normalized = normalizeSiteHost(hostname)
  if (!normalized) return null

  if (normalized === 'localhost' || normalized === '127.0.0.1') {
    return null
  }

  if (normalized.endsWith('.proptios.com')) {
    return '.proptios.com'
  }

  return null
}

function readCookie(name) {
  if (typeof document === 'undefined') return null

  const prefix = `${name}=`
  const entry = document.cookie
    .split(';')
    .map(value => value.trim())
    .find(value => value.startsWith(prefix))

  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null
}

function writeCookie(name, value) {
  if (typeof document === 'undefined') return

  const domain = getCookieDomain(window.location.hostname)
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    `Max-Age=${COOKIE_MAX_AGE}`,
    'SameSite=Lax',
    'Secure'
  ]

  if (domain) {
    parts.push(`Domain=${domain}`)
  }

  document.cookie = parts.join('; ')
}

function clearCookie(name) {
  if (typeof document === 'undefined') return

  const domain = getCookieDomain(window.location.hostname)
  const parts = [`${name}=`, 'Path=/', 'Expires=Thu, 01 Jan 1970 00:00:00 GMT', 'SameSite=Lax', 'Secure']

  if (domain) {
    parts.push(`Domain=${domain}`)
  }

  document.cookie = parts.join('; ')
}

export function getStoredAccessToken() {
  if (typeof window === 'undefined') return null

  return window.localStorage.getItem(COOKIE_NAME) || readCookie(COOKIE_NAME)
}

export function persistAccessToken(token) {
  if (typeof window === 'undefined' || !token) return

  window.localStorage.setItem(COOKIE_NAME, token)
  writeCookie(COOKIE_NAME, token)
}

export function clearAccessToken() {
  if (typeof window === 'undefined') return

  window.localStorage.removeItem(COOKIE_NAME)
  clearCookie(COOKIE_NAME)
}

export function syncAccessTokenFromCookie() {
  if (typeof window === 'undefined') return null

  const cookieToken = readCookie(COOKIE_NAME)
  if (cookieToken && !window.localStorage.getItem(COOKIE_NAME)) {
    window.localStorage.setItem(COOKIE_NAME, cookieToken)
  }

  return cookieToken
}
