// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Import

// ** MUI Imports

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

import { useDispatch } from 'react-redux'
import PropertyManageUnitDrawer from './PropertyManageUnitDrawer'
import PropertyTenantManageTable from './PropertyManageTenantsTable'

const PropertyViewLeases = ({ setPropertyData, propertyData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={24}>
        <Card sx={{ mb: 4 }}>
          <PropertyTenantManageTable setPropertyData={setPropertyData} propertyData={propertyData} />
        </Card>

        {/* <Card>
          <CardContent></CardContent>
        </Card> */}
      </Grid>
    </Grid>
  )
}

export default PropertyViewLeases
