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

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Components Imports

import ParentFinanceViewOverview from './ParentFinanceViewOverview'
import ParentFinanceViewSettlement from './ParentFinanceViewSettlement'
import ParentFinanceViewRentPayments from './ParentFinanceViewRentPayments'
import ParentFinanceViewExpenses from './ParentFinanceViewExpenses'
import ParentFinanceViewStatements from './ParentFinanceViewStatements'
import ParentFinanceViewReports from './ParentFinanceViewReports'

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

const ParentFinanceViewRight = ({ tab = 'payments', financeData, setFinanceData }) => {
  // ** State
  const [activeTab, setActiveTab] = useState(tab || 'payments')
  const [isLoading, setIsLoading] = useState(true)

  // ** Hooks
  const router = useRouter()
  const { id } = router.query

  const handleChange = (event, value) => {
    setIsLoading(true)
    setActiveTab(value)
    router
      .push({
        pathname: `/finance/${value.toLowerCase()}`
      })
      .then(() => setIsLoading(false))
  }
  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab)
    }
  }, [tab])
  useEffect(() => {
    // if (financeData) {
    //   setIsLoading(false)
    // }

    setIsLoading(false)
  }, [financeData])

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
        <Tab value='payments' label='rent payments' icon={<Icon fontSize='1.125rem' icon='tabler:cash-register' />} />
        <Tab value='expenses' label='expenses' icon={<Icon fontSize='1.125rem' icon='tabler:shopping-cart-minus' />} />

        <Tab value='settlement' label='settlement' icon={<Icon fontSize='1.125rem' icon='tabler:pig-money' />} />
        <Tab value='statements' label='statements' icon={<Icon fontSize='1.125rem' icon='tabler:report-money' />} />
        <Tab value='reports' label='reports' icon={<Icon fontSize='1.125rem' icon='tabler:report' />} />

        {/* <Tab value='reminders' label='' icon={<Icon fontSize='1.125rem' icon='tabler:bell' />} /> */}

        {/* <Tab value='reminders' label='reminders' icon={<Icon fontSize='1.125rem' icon='tabler:bell' />} /> */}
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
              <ParentFinanceViewOverview setFinanceData={setFinanceData} financeData={financeData} />
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='payments'>
              <ParentFinanceViewRentPayments setFinanceData={setFinanceData} financeData={financeData} />
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='expenses'>
              <ParentFinanceViewExpenses setFinanceData={setFinanceData} financeData={financeData} />
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='settlement'>
              <ParentFinanceViewSettlement setFinanceData={setFinanceData} financeData={financeData} />
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='statements'>
              <ParentFinanceViewStatements setFinanceData={setFinanceData} financeData={financeData} />
            </TabPanel>

            <TabPanel sx={{ p: 0 }} value='reports'>
              <ParentFinanceViewReports setFinanceData={setFinanceData} financeData={financeData} />
            </TabPanel>
            {/* <TabPanel sx={{ p: 0 }} value='configuration'>
              <ParentFinanceViewConfiguration setFinanceData={setFinanceData} financeData={financeData} />
            </TabPanel> */}
          </>
        )}
      </Box>
    </TabContext>
  )
}

export default ParentFinanceViewRight
