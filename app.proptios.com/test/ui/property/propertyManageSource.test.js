import fs from 'fs'
import path from 'path'
import { describe, expect, it } from 'vitest'

describe('property management source contracts', () => {
  it('keeps explicit frontend-only states for blocked maintenance and suspend flows', () => {
    const existingTenantSource = fs.readFileSync(
      path.join(process.cwd(), 'src/ui/property/PropertyAddExistingTenantDrawer.js'),
      'utf8'
    )
    const manageUnitSource = fs.readFileSync(
      path.join(process.cwd(), 'src/ui/property/PropertyManageUnitDrawer.js'),
      'utf8'
    )
    const maintenanceDrawerSource = fs.readFileSync(
      path.join(process.cwd(), 'src/ui/property/PropertyManageMaintenanceRequestDrawer.js'),
      'utf8'
    )
    const unitsSource = fs.readFileSync(path.join(process.cwd(), 'src/ui/property/PropertyViewUnits.js'), 'utf8')
    const addPropertyDrawerSource = fs.readFileSync(
      path.join(process.cwd(), 'src/ui/property/AddPropertyDrawer.js'),
      'utf8'
    )
    const editPropertyDrawerSource = fs.readFileSync(
      path.join(process.cwd(), 'src/ui/property/EditPropertyDrawer.js'),
      'utf8'
    )
    const maintenanceSource = fs.readFileSync(
      path.join(process.cwd(), 'src/ui/property/PropertyViewMaintenance.js'),
      'utf8'
    )
    const unitDetailPageSource = fs.readFileSync(
      path.join(process.cwd(), 'src/pages/properties/manage/[id]/unit/[unitId].js'),
      'utf8'
    )

    expect(existingTenantSource).toContain('tenants.editTenants(')
    expect(existingTenantSource).toContain("name='tenant'")
    expect(manageUnitSource).toContain("alert(data.description || 'Failed to update unit')")
    expect(manageUnitSource).toContain('refreshPropertyData()')
    expect(maintenanceDrawerSource).toContain('view-only for now')
    expect(maintenanceDrawerSource).toContain('disabled until the correct maintenance update contract exists')
    expect(addPropertyDrawerSource).toContain("label='Default Unit Rent Amount'")
    expect(addPropertyDrawerSource).toContain('automatically gets a first default unit')
    expect(editPropertyDrawerSource).toContain("label='Default Unit Rent Amount'")
    expect(editPropertyDrawerSource).toContain('does not automatically overwrite existing unit rents')
    expect(unitsSource).toContain('Quick Suspend (Unavailable)')
    expect(unitsSource).toContain('router.push(`/properties/manage/${propertyData.id}/unit/${row.id}`)')
    expect(unitDetailPageSource).toContain('<PropertyUnitDetail propertyData={propertyData} loading={loading} />')
    expect(maintenanceSource).toContain('Quick Suspend (Unavailable)')
  })
})
