// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import PropertyViewLeft from 'src/ui/property/PropertyViewLeft'
import PropertyViewRight from 'src/ui/property/PropertyViewRight'

const PropertyEditInfo = ({ tab, invoiceData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <PropertyViewLeft />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <PropertyViewRight tab={tab} invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default PropertyEditInfo
