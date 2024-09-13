// ** MUI Imports

import Grid from '@mui/material/Grid'

import { styled } from '@mui/material/styles'

import MuiTimeline from '@mui/lab/Timeline'

// ** Custom Components Imports
import LeaseManageTable from './LeaseManageTable'

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

const ParentLeaseViewManagement = ({ leaseData }) => {
  return (
    <Grid>
      <LeaseManageTable></LeaseManageTable>
    </Grid>
  )
}

export default ParentLeaseViewManagement
