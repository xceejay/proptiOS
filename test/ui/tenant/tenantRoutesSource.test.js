import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

describe('tenant route source contracts', () => {
  it('routes tenant list and property tenant actions to the real summary/transactions experiences', () => {
    const tenantManageSource = fs.readFileSync(
      path.join(process.cwd(), 'src/ui/tenant/TenantManageTable.js'),
      'utf8'
    )
    const propertyTenantSource = fs.readFileSync(
      path.join(process.cwd(), 'src/ui/property/PropertyManageTenantsTable.js'),
      'utf8'
    )
    const tenantRightSource = fs.readFileSync(path.join(process.cwd(), 'src/ui/tenant/TenantViewRight.js'), 'utf8')
    const tenantTransactionsSource = fs.readFileSync(
      path.join(process.cwd(), 'src/ui/tenant/TenantViewTransactions.js'),
      'utf8'
    )

    expect(tenantManageSource).toContain("href={'/tenants/manage/' + id + '/summary'}")
    expect(tenantManageSource).toContain('tenants.deleteTenants(')
    expect(propertyTenantSource).toContain("href={'/tenants/manage/' + id + '/summary'}")
    expect(propertyTenantSource).toContain('Quick Suspend (Unavailable)')
    expect(tenantRightSource).toContain("value='transactions'")
    expect(tenantTransactionsSource).toContain('tenantData.transactions || []')
  })
})
