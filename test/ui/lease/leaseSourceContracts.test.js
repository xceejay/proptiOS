import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

describe('lease source contracts', () => {
  it('keeps create/view/edit routes aligned with the current lease UX', () => {
    const toolbarSource = fs.readFileSync(
      path.join(process.cwd(), 'src/views/table/data-grid/CustomLeaseToolbar.js'),
      'utf8'
    )
    const manageSource = fs.readFileSync(path.join(process.cwd(), 'src/ui/lease/LeaseManageTable.js'), 'utf8')
    const propertyLeaseSource = fs.readFileSync(path.join(process.cwd(), 'src/ui/property/PropertyLeaseTable.js'), 'utf8')
    const editPageSource = fs.readFileSync(path.join(process.cwd(), 'src/pages/leases/edit/[id].js'), 'utf8')

    expect(toolbarSource).toContain("href={'/leases/create'}")
    expect(manageSource).toContain("href={'/leases/edit/' + id}")
    expect(manageSource).toContain('Delete Lease (Unavailable)')
    expect(manageSource).toContain("'/tenants/manage/' + row.tenant.id + '/summary'")
    expect(propertyLeaseSource).toContain("href={'/leases/edit/' + id}")
    expect(propertyLeaseSource).toContain('Delete Lease (Unavailable)')
    expect(editPageSource).toContain('Lease editing is not wired as a standalone page yet')
  })
})
