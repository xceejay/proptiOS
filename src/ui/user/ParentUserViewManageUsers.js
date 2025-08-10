// ** MUI Imports
import { useState } from 'react'
import { GridLegacy as Grid } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import MuiTimeline from '@mui/lab/Timeline'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Component Imports
import UserTransactionListTable from 'src/ui/user/UserTransactionListTable'
import UserProjectListTable from 'src/ui/user/UserProjectListTable'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
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
      {/* <Grid item xs={12}>
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
      <Grid item xs={12}>
        <UserManageTable></UserManageTable>
      </Grid>
    </Grid>
  )
}

export default ParentUserViewManageUsers
