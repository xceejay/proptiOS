// ** MUI Imports

import { styled } from '@mui/material/styles'

import { useState } from 'react'
import MuiTimeline from '@mui/lab/Timeline'

// ** Custom Components Imports
import LeaseManageTable from './LeaseManageTable'
import { Grid, FormControl, InputLabel, MenuItem, Select, Card, CardHeader, CardContent } from '@mui/material'

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

const ParentLeaseViewTemplates = ({ leaseData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <Card>
          <LeaseManageTable></LeaseManageTable>
        </Card>
      </Grid>
    </Grid>
  );
}

export default ParentLeaseViewTemplates
