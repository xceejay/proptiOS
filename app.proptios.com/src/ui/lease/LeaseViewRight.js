// // ** React Imports
// import { useState, useEffect } from 'react'

// // ** Next Import
// import { useRouter } from 'next/router'

// // ** MUI Imports
// import Box from '@mui/material/Box'
// import TabPanel from '@mui/lab/TabPanel'
// import TabContext from '@mui/lab/TabContext'
// import { styled } from '@mui/material/styles'
// import Typography from '@mui/material/Typography'
// import MuiTab from '@mui/material/Tab'
// import MuiTabList from '@mui/lab/TabList'
// import CircularProgress from '@mui/material/CircularProgress'

// // ** Icon Imports
// import Icon from 'src/@core/components/icon'

// // ** Demo Components Imports
// import LeasesViewPast from 'src/ui/leases/LeasesViewPast'

// import { fontSize } from '@mui/system'
// import LeasesViewArchived from './LeasesViewArchived'
// import LeasesViewActive from './LeasesViewActive'

// // ** Styled Tab component
// const Tab = styled(MuiTab)(({ theme }) => ({
//   flexDirection: 'row',
//   '& svg': {
//     marginBottom: '0 !important',
//     marginRight: theme.spacing(1.5)
//   }
// }))

// const TabList = styled(MuiTabList)(({ theme }) => ({
//   borderBottom: '0 !important',
//   '& .MuiTabs-indicator': {
//     display: 'none'
//   },
//   '& .Mui-selected': {
//     backgroundColor: theme.palette.primary.main,
//     color: `${theme.palette.common.white} !important`
//   },
//   '& .MuiTab-root': {
//     lineHeight: 1,
//     borderRadius: theme.shape.borderRadius
//   }
// }))

const LeaseViewRight = ({ tab, leasesData }) => {
  // const router = useRouter()
  // const { id } = router.query
  // // ** State
  // const [activeTab, setActiveTab] = useState(tab)
  // const [isLoading, setIsLoading] = useState(true)
  // // ** Hooks
  // const handleChange = (event, value) => {
  //   setIsLoading(true)
  //   setActiveTab(value)
  //   router
  //     .push({
  //       pathname: `/leases/${value.toLowerCase()}`
  //     })
  //     .then(() => setIsLoading(false))
  // }
  // useEffect(() => {
  //   if (tab && tab !== activeTab) {
  //     setActiveTab(tab)
  //   }
  // }, [tab])
  // useEffect(() => {
  //   //changed temp to display leases billing page
  //   if (!leasesData) {
  //     setIsLoading(false)
  //   }
  // }, [leasesData])
  // return (
  //   <TabContext value={activeTab}>
  //     <TabList
  //       variant='scrollable'
  //       scrollButtons='auto'
  //       onChange={handleChange}
  //       aria-label='forced scroll tabs example'
  //       sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
  //     >
  //       <Tab
  //         sx={{ fontSize: '13px' }}
  //         value='active'
  //         label='Active leases'
  //         icon={<Icon fontSize='14px' icon='tabler:contract' />}
  //       />
  //       <Tab
  //         sx={{ fontSize: '13px' }}
  //         value='past'
  //         label='Past leases'
  //         icon={<Icon fontSize='14px' icon='tabler:contract' />}
  //       />
  //       <Tab
  //         sx={{ fontSize: '13px' }}
  //         value='archived'
  //         label='Archived leases'
  //         icon={<Icon fontSize='14px' icon='tabler:archive' />}
  //       />
  //     </TabList>
  //     <Box sx={{ mt: 6 }}>
  //       {isLoading ? (
  //         <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
  //           <CircularProgress sx={{ mb: 4 }} />
  //           <Typography>Loading...</Typography>
  //         </Box>
  //       ) : (
  //         <>
  //           <TabPanel sx={{ p: 0 }} value='active'>
  //             <LeasesViewActive />
  //           </TabPanel>
  //           <TabPanel sx={{ p: 0 }} value='past'>
  //             <LeasesViewPast />
  //           </TabPanel>
  //           <TabPanel sx={{ p: 0 }} value='archived'>
  //             <LeasesViewArchived />
  //           </TabPanel>
  //         </>
  //       )}
  //     </Box>
  //   </TabContext>
  // )
}

export default LeaseViewRight
