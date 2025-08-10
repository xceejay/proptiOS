// ** MUI Imports
import { useState } from 'react'
import Grid from '@mui/material/Grid'
import { styled } from '@mui/material/styles'
import MuiTimeline from '@mui/lab/Timeline'

// ** Icon Imports

// ** Demo Component Imports

// ** Custom Components Imports
import UserManageTable from './UserManageTable'

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

const ParentUserViewManageUsers = ({ userData }) => {
  const [tabValue, setTabValue] = useState('1')
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Grid container spacing={6}>
      {/* <Grid size={12}>
        <TabContext value={tabValue}>
          <TabList onChange={handleTabChange} variant='fullWidth' aria-label='settlement tabs'>
            <Tab label='Active' value='1' />
            <Tab label='Pending' value='2' />
            <Tab label='Disabled' value='3' />
          </TabList>
          <TabPanel value='1'>
            <UserManageTable></UserManageTable>
          </TabPanel>
        </TabContext>
      </Grid> */}
      <Grid size={12}>
        <UserManageTable></UserManageTable>
      </Grid>
    </Grid>
  )
}

export default ParentUserViewManageUsers
