import { Grid } from '@mui/material'
import PropertyManageTable from './PropertyManageTable'

const ParentPropertyViewOverview = ({ setPropertyData, propertyData }) => {
  return (
    <Grid>
      <PropertyManageTable></PropertyManageTable>
    </Grid>
  )
}

export default ParentPropertyViewOverview
