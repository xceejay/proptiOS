import { buildMaintenanceRequests, filterMaintenanceRequests } from 'src/ui/property/propertyMaintenanceModel'

describe('propertyMaintenanceModel', () => {
  it('builds maintenance rows without crashing on missing relations', () => {
    expect(
      buildMaintenanceRequests({
        maintenance_requests: [{ id: 1, tenant_id: 9, unit_id: 4 }],
        tenants: [],
        units: []
      })
    ).toEqual([{ id: 1, tenant_id: 9, unit_id: 4, tenant: null, unit: null }])
  })

  it('searches maintenance rows across actual maintenance fields', () => {
    const rows = [
      { title: 'Leak', description: 'Kitchen sink', tenant: { name: 'Alice' }, unit: { name: 'A1' }, status: 'open' }
    ]

    expect(filterMaintenanceRequests(rows, 'kitchen')).toEqual(rows)
    expect(filterMaintenanceRequests(rows, 'alice')).toEqual(rows)
  })
})
