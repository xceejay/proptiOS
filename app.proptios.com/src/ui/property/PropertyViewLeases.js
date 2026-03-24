// ** React Imports

// ** Next Import

// ** MUI Imports

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

// ** Icon Imports

import PropertyLeaseTable from './PropertyLeaseTable'

const PropertyViewLeases = ({ setPropertyData, propertyData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={12} lg={12}>
        <Card sx={{ mb: 4 }}>
          <PropertyLeaseTable setPropertyData={setPropertyData} propertyData={propertyData} />
        </Card>

        {/* <Card>
          <CardContent></CardContent>
        </Card> */}
      </Grid>
    </Grid>
  )
}

export default PropertyViewLeases
