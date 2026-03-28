import fs from 'node:fs'
import path from 'node:path'

describe('property settings source contracts', () => {
  it('reads property contact fields from the property payload instead of only the property manager payload', () => {
    const settingsSource = fs.readFileSync(
      path.resolve(process.cwd(), 'src/ui/property/PropertyVIewSettings.js'),
      'utf8'
    )

    expect(settingsSource).toContain("property_email: propertyData?.property_email || propertyData?.property_manager?.email || ''")
    expect(settingsSource).toContain(
      "property_tel_number: propertyData?.property_tel_number || propertyData?.property_manager?.tel_number || ''"
    )
    expect(settingsSource).toContain('property_email: property.property_email')
    expect(settingsSource).toContain('property_tel_number: property.property_tel_number')
  })

  it('returns property-owned contact fields in the backend property payloads', () => {
    const backendSource = fs.readFileSync(
      path.resolve(process.cwd(), '../api.pm.proptios.com/app/controllers/module/properties.js'),
      'utf8'
    )

    expect(backendSource).toContain('properties.property_email AS property_email')
    expect(backendSource).toContain('properties.property_tel_number AS property_tel_number')
    expect(backendSource).toContain('properties.country AS property_country')
    expect(backendSource).toContain('propertyInfo.property_email = row.property_email;')
    expect(backendSource).toContain('propertyInfo.property_tel_number = row.property_tel_number;')
    expect(backendSource).toContain('propertyInfo.country = row.property_country;')
    expect(backendSource).toContain('property_email: row.property_email')
    expect(backendSource).toContain('property_tel_number: row.property_tel_number')
    expect(backendSource).toContain('country: row.property_country')
  })
})
