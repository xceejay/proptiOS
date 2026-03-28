const SHARED_SITE_HOSTS = new Set([
  "app.proptios.com",
  "staging.app.proptios.com",
  "api.pm.proptios.com",
  "staging.api.pm.proptios.com",
  "www.proptios.com",
  "proptios.com",
  "localhost",
  "127.0.0.1",
  "::1",
]);

function normalizeHost(value) {
  if (!value) return null;

  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");

  return normalized || null;
}

function isSharedSiteHost(value) {
  const normalized = normalizeHost(value);
  if (!normalized) return true;

  if (SHARED_SITE_HOSTS.has(normalized)) return true;
  if (normalized.endsWith(".vercel.app")) return true;

  return false;
}

function canonicalizeRequestedSiteHost(value) {
  const normalized = normalizeHost(value);
  if (!normalized || isSharedSiteHost(normalized)) {
    return null;
  }

  if (normalized.endsWith(".staging.proptios.com")) {
    return normalized.replace(/\.staging\.proptios\.com$/, ".proptios.com");
  }

  if (normalized.startsWith("staging.") && normalized.endsWith(".proptios.com")) {
    return normalized.replace(/^staging\./, "");
  }

  return normalized;
}

function getRequestedSiteHost(req) {
  const rawHost =
    req.headers["x-site-host"] ||
    req.headers["x-forwarded-host"] ||
    req.body?.site_host ||
    null;

  return canonicalizeRequestedSiteHost(rawHost);
}

function siteMatchesRequest(userSiteId, requestedSiteHost) {
  const normalizedUserSiteId = normalizeHost(userSiteId);
  const normalizedRequestedSiteHost = canonicalizeRequestedSiteHost(requestedSiteHost);

  if (!normalizedRequestedSiteHost) return true;

  return normalizedUserSiteId === normalizedRequestedSiteHost;
}

module.exports = {
  canonicalizeRequestedSiteHost,
  getRequestedSiteHost,
  normalizeHost,
  siteMatchesRequest,
};
