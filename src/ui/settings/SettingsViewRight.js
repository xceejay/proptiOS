// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTab from '@mui/material/Tab'
import MuiTabList from '@mui/lab/TabList'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components Imports
// import SettingsViewBilling from 'src/ui/settings/SettingsViewBilling'
// import SettingsViewTransactions from 'src/ui/settings/SettingsViewTransactions'
// import SettingsViewSecurity from 'src/ui/settings/SettingsViewSecurity'
// import SettingsViewConnection from 'src/ui/settings/SettingsViewConnection'
// import SettingsViewNotification from 'src/ui/settings/SettingsViewNotification'

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

const SettingsViewRight = ({ tab, settingsData }) => {
  const router = useRouter()
  const { id } = router.query

  // const { tab } = router.query

  // ** State
  const [activeTab, setActiveTab] = useState(tab)
  const [isLoading, setIsLoading] = useState(true)

  // ** Hooks

  const handleChange = (event, value) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/settings/manage/${id}/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
  }
  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])
  useEffect(() => {
    if (settingsData) {
      setIsLoading(false)
    }
  }, [settingsData])

  return (
    <TabContext value={activeTab}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Tab
          sx={{ fontSize: '13px' }}
          value='transactions'
          label='Transactions'
          icon={<Icon fontSize='14px' icon='tabler:settings-check' />}
        />
        <Tab
          sx={{ fontSize: '13px' }}
          value='security'
          label='Security'
          icon={<Icon fontSize='14px' icon='tabler:lock' />}
        />
        <Tab
          sx={{ fontSize: '13px' }}
          disabled
          value='billing-plan'
          label='Billing & Plan'
          icon={<Icon fontSize='14px' icon='tabler:currency-dollar' />}
        />
        {/* <Tab value='notification' label='Notification' icon={<Icon fontSize='1.125rem' icon='tabler:bell' />} /> */}
        {/* <Tab value='connection' label='Connection' icon={<Icon fontSize='1.125rem' icon='tabler:link' />} /> */}
      </TabList>
      <Box sx={{ mt: 6 }}>
        {isLoading ? (
          <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <CircularProgress sx={{ mb: 4 }} />
            <Typography>Loading...</Typography>
          </Box>
        ) : (
          <>
            {/* <TabPanel sx={{ p: 0 }} value='transactions'>
              <SettingsViewTransactions settingsData={settingsData} />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='security'>
              <SettingsViewSecurity />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='billing-plan'>
              <SettingsViewBilling />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='notification'>
              <SettingsViewNotification />
            </TabPanel>
            <TabPanel sx={{ p: 0 }} value='connection'>
              <SettingsViewConnection />
            </TabPanel> */}
          </>
        )}
      </Box>
    </TabContext>
  )
}

export default SettingsViewRight
