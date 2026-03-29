// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTab from '@mui/material/Tab'
import MuiTabList from '@mui/lab/TabList'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components Imports

import ParentLeaseViewOverview from './ParentLeaseViewOverview'
import ParentLeaseViewManagement from './ParentLeaseViewManagement'
import ParentLeaseViewTemplates from './ParentLeaseViewTemplates'
import ParentLeaseViewCompose from './ParentLeaseViewCompose'

// ** Styled Tab component
const Tab = styled(MuiTab)(({ theme }) => ({
  flexDirection: 'row',
  '& svg': {
    marginBottom: '0 !important',
    marginRight: theme.spacing(1.5)
  }
}))

const TabList = styled(MuiTabList)(({ theme }) => ({
  borderBottom: '0 !important',
  '& .MuiTabs-indicator': {
    display: 'none'
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`
  },
  '& .MuiTab-root': {
    lineHeight: 1,
    borderRadius: theme.shape.borderRadius
  }
}))

// const TabList = styled(MuiTabList)(({ theme }) => ({
//   borderBottom: '0 !important',

//   '& .MuiTab-root': {
//     lineHeight: 1,
//     borderRadius: theme.shape.borderRadius
//   }
// }))

const ParentLeaseViewRight = ({ tab, leaseData, setLeaseData }) => {
  // ** State
  const [activeTab, setActiveTab] = useState(tab)
  const [isLoading, setIsLoading] = useState(true)

  // ** Hooks
  const router = useRouter()
  const { id } = router.query

  const handleChange = (event, value) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/leases/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
  }
  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [tab])
  useEffect(() => {
    // if (leaseData) {
    //   setIsLoading(false)
    // }

    setIsLoading(false)
  }, [leaseData])

  return (
    <TabContext value={activeTab}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Tab value='overview' label='overview' icon={<Icon fontSize='1.125rem' icon='tabler:home' />} />
        <Tab value='compose' label='compose' icon={<Icon fontSize='1.125rem' icon='tabler:writing-sign' />} />

        <Tab value='management' label='management' icon={<Icon fontSize='1.125rem' icon='tabler:eye-edit' />} />
        <Tooltip title='Lease templates are coming soon'>
          <span>
            <Tab
              value='templates'
              disabled
              label='Templates'
              icon={<Icon fontSize='1.125rem' icon='tabler:layers-selected' />}
            />
          </span>
        </Tooltip>
      </TabList>
      <Box sx={{ mt: 6 }}>
        {isLoading ? (
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <>
            <TabPanel sx={{ p: 0 }} value='overview'>
              <ParentLeaseViewOverview setLeaseData={setLeaseData} leaseData={leaseData} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='compose'>
              <ParentLeaseViewCompose />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='management'>
              <ParentLeaseViewManagement setLeaseData={setLeaseData} leaseData={leaseData} />
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='templates'>
              <ParentLeaseViewTemplates setLeaseData={setLeaseData} leaseData={leaseData} />
            </TabPanel>
          </>
        )}
      </Box>
    </TabContext>
  )
}

export default ParentLeaseViewRight
