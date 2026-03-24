import { buildPropertyOverviewStats, buildPropertyUnitsData } from 'src/ui/property/propertyOverviewModel'

describe('propertyOverviewModel', () => {
  it('builds overview stats from property data', () => {
    const stats = buildPropertyOverviewStats({
      units: [{ id: 1 }, { id: 2 }, { id: 3 }],
      applicants: [{ id: 'a1' }, { id: 'a2' }],
      tenants: [{ id: 't1' }],
      maintenance_requests: [{ id: 'm1' }, { id: 'm2' }]
    })

    expect(stats).toHaveLength(4)
    expect(stats.map(stat => stat.title)).toEqual(['Units', 'Applicants', 'Maintenance', 'Tenants'])
    expect(stats.map(stat => stat.stats)).toEqual(['3 units', '2 applicants', '2 requests', '1 tenants'])
  })

  it('falls back to aggregate counts when nested arrays are missing', () => {
    const stats = buildPropertyOverviewStats({
      allocated_units: 8,
      total_applicants: 3,
      total_maintenance_requests: 5,
      total_tenants: 6
    })

    expect(stats.map(stat => stat.stats)).toEqual(['8 units', '3 applicants', '5 requests', '6 tenants'])
  })

  it('joins units to tenants defensively', () => {
    const units = buildPropertyUnitsData({
      units: [{ id: 1, tenant_id: 7 }, { id: 2, tenant_id: 999 }],
      tenants: [{ id: 7, name: 'Alice' }]
    })

    expect(units[0].tenant).toEqual({ id: 7, name: 'Alice' })
    expect(units[1].tenant).toBeNull()
  })
})
