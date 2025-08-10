// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Import

// ** MUI Imports

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

// ** Icon Imports

import PropertyTenantManageTable from './PropertyManageTenantsTable'

const PropertyViewTenants = ({ setPropertyData, propertyData }) => {
  // State to track local tenant data for instant updates
  const [localTenantData, setLocalTenantData] = useState(propertyData?.tenants || [])

  // Update local tenant data when propertyData changes from parent
  useEffect(() => {
    if (propertyData?.tenants) {
      setLocalTenantData(propertyData.tenants)
    }
  }, [propertyData])

  // Function to update tenant data locally without triggering API calls
  const handleTenantUpdate = useCallback(
    updatedTenant => {
      setLocalTenantData(prevTenants => {
        return prevTenants.map(tenant => (tenant.id === updatedTenant.id ? updatedTenant : tenant))
      })

      // Update units in propertyData to reflect tenant changes
      const updatedPropertyData = {
        ...propertyData,
        units: propertyData.units.map(unit => {
          // If unit is in updated tenant's units, assign tenant_id
          if (updatedTenant.units?.some(tenantUnit => tenantUnit.id === unit.id)) {
            return { ...unit, tenant_id: updatedTenant.id }
          }
          // If unit was previously assigned to this tenant but no longer is, clear tenant_id
          else if (unit.tenant_id === updatedTenant.id) {
            return { ...unit, tenant_id: null }
          }
          return unit
        })
      }

      // Update parent state with optimistic changes
      setPropertyData(updatedPropertyData)
    },
    [propertyData, setPropertyData]
  )

  return (
    <Grid container spacing={6}>
      <Grid size={12} lg={12}>
        <Card sx={{ mb: 4 }}>
          <PropertyTenantManageTable
            setPropertyData={setPropertyData}
            propertyData={propertyData}
            localTenantData={localTenantData}
            setLocalTenantData={setLocalTenantData}
            onTenantUpdate={handleTenantUpdate}
          />
        </Card>

        {/* <Card>
          <CardContent></CardContent>
        </Card> */}
      </Grid>
    </Grid>
  )
}

export default PropertyViewTenants
