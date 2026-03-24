export const buildMaintenanceRequests = propertyData =>
  (propertyData?.maintenance_requests ?? []).map(maintenanceRequest => {
    const foundTenant = (propertyData?.tenants ?? []).find(tenant => tenant.id === maintenanceRequest.tenant_id)
    const foundUnit = (propertyData?.units ?? []).find(unit => unit.id === maintenanceRequest.unit_id)

    return {
      ...maintenanceRequest,
      tenant: foundTenant || null,
      unit: foundUnit || null
    }
  })

export const filterMaintenanceRequests = (maintenanceRequests = [], search = '') => {
  const normalizedSearch = search.trim().toLowerCase()

  if (!normalizedSearch) {
    return maintenanceRequests
  }

  return maintenanceRequests.filter(maintenanceRequest =>
    [
      maintenanceRequest?.title,
      maintenanceRequest?.description,
      maintenanceRequest?.tenant?.name,
      maintenanceRequest?.unit?.name,
      maintenanceRequest?.status,
      maintenanceRequest?.internal_assignee?.name,
      maintenanceRequest?.external_assignee
    ].some(field => (field || '').toLowerCase().includes(normalizedSearch))
  )
}
