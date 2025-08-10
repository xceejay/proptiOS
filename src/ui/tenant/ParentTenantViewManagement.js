// ** MUI Imports
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import MuiTimeline from '@mui/lab/Timeline'

// ** Icon Imports

// ** Demo Component Imports

// ** Custom Components Imports
import TenantManageTable from './TenantManageTable'

// Styled Timeline component
const Timeline = styled(MuiTimeline)(({ theme }) => ({
  margin: 0,
  padding: 0,
  marginLeft: theme.spacing(0.75),
  '& .MuiTimelineItem-root': {
    '&:before': {
      display: 'none'
    },
    '&:last-child': {
      minHeight: 60
    }
  }
}))

const ParentTenantViewManagement = ({ tenantData }) => {
  return (
    <Grid>
      <TenantManageTable></TenantManageTable>
    </Grid>
  )
}

export default ParentTenantViewManagement
