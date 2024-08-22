// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import PropertyViewLeft from 'src/ui/property/PropertyViewLeft'
import PropertyViewRight from 'src/ui/property/PropertyViewRight'

const PropertyEditInfo = ({ propertyData, tab }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <PropertyViewLeft propertyData={propertyData} />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <PropertyViewRight propertyData={propertyData} tab={tab} />
      </Grid>
    </Grid>
  )
}

export default PropertyEditInfo
