// ** React Imports
import { useState, useEffect, useContext } from 'react'

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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components Imports
import PropertyViewBilling from 'src/ui/property/PropertyViewBilling'
import PropertyViewOverview from 'src/ui/property/PropertyViewOverview'
import PropertyViewUnits from 'src/ui/property/PropertyViewUnits'
import PropertyViewMaintenance from 'src/ui/property/PropertyViewMaintenance'
import PropertyViewMarketing from './PropertyViewMarketing'
import PropertyViewSettings from 'src/ui/property/PropertyViewSettings'
import PropertyViewTenants from './PropertyViewTenants'
import PropertyViewLeases from './PropertyViewLeases'
import { AbilityContext } from 'src/layouts/components/acl/Can'

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

const UserViewRight = ({ tab, propertyData, setPropertyData }) => {
  const ability = useContext(AbilityContext)

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
        pathname: `/properties/manage/${id}/${value.toLowerCase()}`
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
    if (propertyData) {
      setIsLoading(false)
    }
  }, [propertyData])

  return (
    <TabContext value={activeTab}>
      <TabList
        variant='scrollable'
        scrollButtons='auto'
        onChange={handleChange}
        aria-label='forced scroll tabs example'
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        {/* Conditionally render Tabs based on CASL permissions */}
        {ability.can('read', 'overview') && (
          <Tab value='overview' label='Overview' icon={<Icon fontSize='1.125rem' icon='tabler:home' />} />
        )}

        {ability.can('read', 'tenants') && (
          <Tab value='tenants' label='Tenants' icon={<Icon fontSize='1.125rem' icon='tabler:friends' />} />
        )}

        {ability.can('read', 'units') && (
          <Tab value='units' label='Units' icon={<Icon fontSize='1.125rem' icon='tabler:cash' />} />
        )}

        {ability.can('read', 'leases') && (
          <Tab value='leases' label='Leases' icon={<Icon fontSize='1.125rem' icon='tabler:contract' />} />
        )}

        {ability.can('read', 'maintenance') && (
          <Tab value='maintenance' label='Maintenance' icon={<Icon fontSize='1.125rem' icon='tabler:tool' />} />
        )}

        <Tab
          disabled
          value='marketing'
          label='Marketing'
          icon={<Icon fontSize='1.125rem' icon='tabler:speakerphone' />}
        />
        <Tab disabled value='settings' label='Settings' icon={<Icon fontSize='1.125rem' icon='tabler:settings' />} />
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
              <PropertyViewOverview setPropertyData={setPropertyData} propertyData={propertyData} />
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='tenants'>
              <PropertyViewTenants setPropertyData={setPropertyData} propertyData={propertyData} />
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='units'>
              <PropertyViewUnits setPropertyData={setPropertyData} propertyData={propertyData} />
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='leases'>
              <PropertyViewLeases setPropertyData={setPropertyData} propertyData={propertyData} />
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='maintenance'>
              <PropertyViewMaintenance setPropertyData={setPropertyData} propertyData={propertyData} />
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='marketing'>
              <PropertyViewMarketing setPropertyData={setPropertyData} propertyData={propertyData} />
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='settings'>
              <PropertyViewSettings setPropertyData={setPropertyData} propertyData={propertyData} />
            </TabPanel>
          </>
        )}
      </Box>
    </TabContext>
  )
}

export default UserViewRight
