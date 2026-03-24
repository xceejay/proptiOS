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
import PropertyViewOverview from 'src/ui/property/PropertyViewOverview'
import PropertyViewUnits from 'src/ui/property/PropertyViewUnits'
import PropertyViewMaintenance from 'src/ui/property/PropertyViewMaintenance'
import PropertyViewMarketing from './PropertyViewMarketing'
import PropertyViewTenants from './PropertyViewTenants'
import PropertyViewLeases from './PropertyViewLeases'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import PropertyViewSettings from './PropertyVIewSettings'

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

const UserViewRight = ({ tab = 'overview', propertyData, setPropertyData }) => {
  const ability = useContext(AbilityContext)

  // ** State
  const [activeTab, setActiveTab] = useState(tab || 'overview')
  const [isLoading, setIsLoading] = useState(true)

  // ** Hooks
  const router = useRouter()
  const { id } = router.query

  // Function to determine the default active tab based on ability
  const getDefaultTab = () => {
    if (ability.can('read', 'property-overview')) return 'overview'
    if (ability.can('read', 'property-tenants')) return 'tenants'
    if (ability.can('read', 'property-units')) return 'units'
    if (ability.can('read', 'property-leases')) return 'leases'
    if (ability.can('read', 'property-maintenance')) return 'maintenance'
    if (ability.can('read', 'property-marketing')) return 'marketing'
    if (ability.can('read', 'property-settings')) return 'settings'
    return 'overview' // Default fallback if no permissions
  }

  // Handle active tab changes and redirects
  const handleChange = (event, value) => {
    setIsLoading(true)
    setActiveTab(value)
    router.replace(`/properties/manage/${id}/${value.toLowerCase()}`).then(() => setIsLoading(false))
  }

  // Set default tab on mount
  useEffect(() => {
    if (!tab) {
      const defaultTab = getDefaultTab()
      setActiveTab(defaultTab)
      router.replace(`/properties/manage/${id}/${defaultTab}`)
    } else {
      setActiveTab(tab)
    }
  }, [ability, tab, router, id])

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
        {ability.can('read', 'property-overview') && (
          <Tab value='overview' label='Overview' icon={<Icon fontSize='1.125rem' icon='tabler:home' />} />
        )}

        {ability.can('read', 'property-tenants') && (
          <Tab value='tenants' label='Tenants' icon={<Icon fontSize='1.125rem' icon='tabler:friends' />} />
        )}

        {ability.can('read', 'property-units') && (
          <Tab value='units' label='Units' icon={<Icon fontSize='1.125rem' icon='tabler:cash' />} />
        )}

        {ability.can('read', 'property-leases') && (
          <Tab value='leases' label='Leases' icon={<Icon fontSize='1.125rem' icon='tabler:contract' />} />
        )}

        {ability.can('read', 'property-maintenance') && (
          <Tab value='maintenance' label='Maintenance' icon={<Icon fontSize='1.125rem' icon='tabler:tool' />} />
        )}

        {ability.can('read', 'property-marketing') && (
          <Tab value='marketing' label='Marketing' icon={<Icon fontSize='1.125rem' icon='tabler:chart-histogram' />} />
        )}

        {ability.can('read', 'property-settings') && (
          <Tab value='settings' label='Settings' icon={<Icon fontSize='1.125rem' icon='tabler:settings' />} />
        )}
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
              {ability.can('read', 'property-overview') ? (
                <PropertyViewOverview setPropertyData={setPropertyData} propertyData={propertyData} />
              ) : (
                <Typography>You do not have permission to view this content.</Typography>
              )}
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='tenants'>
              {ability.can('read', 'property-tenants') ? (
                <PropertyViewTenants setPropertyData={setPropertyData} propertyData={propertyData} />
              ) : (
                <Typography>You do not have permission to view this content.</Typography>
              )}
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='units'>
              {ability.can('read', 'property-units') ? (
                <PropertyViewUnits setPropertyData={setPropertyData} propertyData={propertyData} />
              ) : (
                <Typography>You do not have permission to view this content.</Typography>
              )}
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='leases'>
              {ability.can('read', 'property-leases') ? (
                <PropertyViewLeases setPropertyData={setPropertyData} propertyData={propertyData} />
              ) : (
                <Typography>You do not have permission to view this content.</Typography>
              )}
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='maintenance'>
              {ability.can('read', 'property-maintenance') ? (
                <PropertyViewMaintenance setPropertyData={setPropertyData} propertyData={propertyData} />
              ) : (
                <Typography>You do not have permission to view this content.</Typography>
              )}
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='marketing'>
              {ability.can('read', 'property-marketing') ? (
                <PropertyViewMarketing disabled setPropertyData={setPropertyData} propertyData={propertyData} />
              ) : (
                <Typography>You do not have permission to view this content.</Typography>
              )}
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='settings'>
              {ability.can('read', 'property-settings') ? (
                <PropertyViewSettings disabled setPropertyData={setPropertyData} propertyData={propertyData} />
              ) : (
                <Typography>You do not have permission to view this content.</Typography>
              )}
            </TabPanel>
          </>
        )}
      </Box>
    </TabContext>
  )
}

export default UserViewRight
