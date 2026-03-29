const SITE_DOMAIN_SUFFIX = ".proptios.com";
const SITE_ID_LABEL_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

const normalizeSiteIdLabel = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");

const isValidSiteIdLabel = (value) =>
  SITE_ID_LABEL_PATTERN.test(String(value || "").trim().toLowerCase());

const parseCanonicalSiteId = (value) => {
  const siteId = String(value || "").trim().toLowerCase();
  if (!siteId.endsWith(SITE_DOMAIN_SUFFIX)) {
    return null;
  }

  const label = siteId.slice(0, -SITE_DOMAIN_SUFFIX.length);
  if (!isValidSiteIdLabel(label)) {
    return null;
  }

  return {
    siteId,
    siteSubdomain: label,
  };
};

module.exports = {
  SITE_DOMAIN_SUFFIX,
  SITE_ID_LABEL_PATTERN,
  normalizeSiteIdLabel,
  isValidSiteIdLabel,
  parseCanonicalSiteId,
};
