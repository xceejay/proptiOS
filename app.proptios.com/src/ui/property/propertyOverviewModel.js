const getCount = (arrayLike, fallbackCount) => {
  if (Array.isArray(arrayLike)) {
    return arrayLike.length
  }

  return typeof fallbackCount === 'number' ? fallbackCount : 0
}

export const buildPropertyUnitsData = propertyData => {
  if (!propertyData?.units || !propertyData?.tenants) {
    return []
  }

  return (propertyData.units ?? []).map(unit => {
    const foundTenant = (propertyData.tenants ?? []).find(tenant => tenant.id === unit.tenant_id)

    return {
      ...unit,
      tenant: foundTenant || null
    }
  })
}

export const buildPropertyUnitDetail = (propertyData, unitId) => {
  if (!propertyData || !unitId) {
    return null
  }

  const normalizedUnitId = String(unitId)
  const units = buildPropertyUnitsData(propertyData)
  const unit = units.find(currentUnit => String(currentUnit.id) === normalizedUnitId)

  if (!unit) {
    return null
  }

  const lease =
    (propertyData.leases ?? []).find(currentLease => {
      if (currentLease?.unit?.id != null) {
        return String(currentLease.unit.id) === normalizedUnitId
      }

      if (currentLease?.unit_id != null) {
        return String(currentLease.unit_id) === normalizedUnitId
      }

      return false
    }) || null

  return {
    property: propertyData,
    unit,
    tenant: unit.tenant || null,
    lease
  }
}

export const buildPropertyOverviewStats = propertyData => [
  {
    title: 'Units',
    stats: `${getCount(propertyData?.units, propertyData?.allocated_units ?? propertyData?.units_count)} units`,
    chipText: `+${getCount(propertyData?.units, propertyData?.allocated_units ?? propertyData?.units_count)} units`,
    avatarColor: 'primary',
    subtitle: 'All time',
    avatarIcon: 'tabler:bed'
  },
  {
    title: 'Applicants',
    stats: `${getCount(propertyData?.applicants, propertyData?.total_applicants)} applicants`,
    chipText: `+${getCount(propertyData?.applicants, propertyData?.total_applicants)} applicants`,
    avatarColor: 'info',
    subtitle: 'All time',
    avatarIcon: 'tabler:forms'
  },
  {
    title: 'Maintenance',
    stats: `${getCount(propertyData?.maintenance_requests, propertyData?.total_maintenance_requests)} requests`,
    chipText: `+${getCount(propertyData?.maintenance_requests, propertyData?.total_maintenance_requests)} requests`,
    avatarColor: 'success',
    avatarIcon: 'tabler:tool'
  },
  {
    title: 'Tenants',
    stats: `${getCount(propertyData?.tenants, propertyData?.total_tenants)} tenants`,
    chipText: `+${getCount(propertyData?.tenants, propertyData?.total_tenants)} tenants`,
    avatarColor: 'primary',
    avatarIcon: 'tabler:friends'
  }
]
