import { Grid } from '@mui/material'
import PropertyManageTable from './PropertyManageTable'

const ParentPropertyViewManagement = ({ setPropertyData, propertyData }) => {
  return (
    <Grid>
      <PropertyManageTable></PropertyManageTable>
    </Grid>
  )
}

export default ParentPropertyViewManagement
