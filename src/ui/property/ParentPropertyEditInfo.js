// ** MUI Imports
import { GridLegacy as Grid } from '@mui/material'

// ** Demo Components Imports
import ParentPropertyViewRight from './ParentPropertyViewRight'

const ParentPropertyEditInfo = ({ setPropertyData, propertyData, tab }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12} md={5} lg={4}>
        <PropertyViewLeft setPropertyData={setPropertyData} propertyData={propertyData} />
      </Grid> */}
      <Grid item xs={12} md={12} lg={12}>
        <ParentPropertyViewRight tab={tab} setPropertyData={setPropertyData} propertyData={propertyData} />
      </Grid>
    </Grid>
  )
}

export default ParentPropertyEditInfo
