import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('register site id source contracts', () => {
  it('normalizes and validates site ids as domain-safe labels on the frontend', () => {
    const registerPageSource = fs.readFileSync(path.resolve(process.cwd(), 'src/pages/register/index.js'), 'utf8')
    const onboardingContextSource = fs.readFileSync(path.resolve(process.cwd(), 'src/context/OnboardingContext.js'), 'utf8')
    const helperSource = fs.readFileSync(path.resolve(process.cwd(), 'src/utils/siteId.js'), 'utf8')

    expect(helperSource).toContain('SITE_ID_LABEL_PATTERN')
    expect(helperSource).toContain("replace(/[^a-z0-9-]+/g, '-')")
    expect(helperSource).toContain('buildCanonicalSiteId')
    expect(registerPageSource).toContain("transform(value => normalizeSiteIdLabel(value))")
    expect(registerPageSource).toContain('site-id-domain-label')
    expect(registerPageSource).toContain("onChange={event => onChange(normalizeSiteIdLabel(event.target.value))}")
    expect(onboardingContextSource).toContain("import { buildCanonicalSiteId, normalizeSiteIdLabel } from 'src/utils/siteId'")
    expect(onboardingContextSource).toContain("formData.append('site_id', buildCanonicalSiteId(siteIdLabel))")
  })

  it('rejects invalid site ids and stores the slug separately in the backend', () => {
    const backendSource = fs.readFileSync(
      path.resolve(process.cwd(), '../api.pm.proptios.com/app/controllers/module/auth.js'),
      'utf8'
    )
    const identitySource = fs.readFileSync(
      path.resolve(process.cwd(), '../api.pm.proptios.com/app/services/site_identity.js'),
      'utf8'
    )

    expect(identitySource).toContain('parseCanonicalSiteId')
    expect(identitySource).toContain('SITE_DOMAIN_SUFFIX')
    expect(identitySource).toContain('siteSubdomain')
    expect(backendSource).toContain('const parsedSiteIdentity = parseCanonicalSiteId(site_id);')
    expect(backendSource).toContain('Site ID must be a valid subdomain label.')
    expect(backendSource).toContain('const site_subdomain = parsedSiteIdentity.siteSubdomain;')
    expect(backendSource).toContain('site_subdomain,')
  })
})
