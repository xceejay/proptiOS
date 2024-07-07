// import '../../@fake-db'

// ** MUI Import
import Grid from '@mui/material/Grid'

// ** Demo Component Imports
import CrmSessions from 'src/ui/dashboard/CrmSessions'
import CrmRevenueGrowth from 'src/ui/dashboard//CrmRevenueGrowth'
import CrmBrowserStates from 'src/ui/dashboard//CrmBrowserStates'
import CrmProjectStatus from 'src/ui/dashboard//CrmProjectStatus'
import CrmActiveProjects from 'src/ui/dashboard//CrmActiveProjects'
import CrmLastTransaction from 'src/ui/dashboard//CrmLastTransaction'
import CrmActivityTimeline from 'src/ui/dashboard//CrmActivityTimeline'
import CrmSalesWithAreaChart from 'src/ui/dashboard//CrmSalesWithAreaChart'
import CrmSalesWithRadarChart from 'src/ui/dashboard//CrmSalesWithRadarChart'
import CrmEarningReportsWithTabs from 'src/ui/dashboard//CrmEarningReportsWithTabs'

// ** Custom Component Imports
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Dashboard = () => {
  const [DashData, setDashData] = useState(null)

  useEffect(() => {
    const testReq = async () => {
      try {
        const response = await axios.get('http://api.pm.manages.homes', {
          params: {
            firstName: 'Fred',
            lastName: 'Flintstone'
          }
        })

        // console.log(response.data)
        setDashData(response.data)

        // alert('dashdata: ' + JSON.stringify(response.data)) // Alert with the fetched data
      } catch (error) {
        console.error(error)
      }
    }

    testReq()
  }, [])

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        {/* <Grid>wanted to do switch for properties</Grid> */}
        <Grid item xs={12} sm={12} lg={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6} lg={2.5}>
              {/* prettier-ignore */}
              <CardStatsVertical
                stats={DashData?.heartbeat}
                chipText='+2 tenants'
                avatarColor='success'
                chipColor='default'
                title='Units Occupied'
                subtitle='API response below'
                avatarIcon='tabler:home'
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={2.5}>
              <CardStatsVertical
                stats={'4' + ' tenants'}
                chipText={'+0' + ' tenants'}
                avatarColor='info'
                chipColor='default'
                title='Units Vacant'
                subtitle='This week'
                avatarIcon='tabler:home'
              />
            </Grid>
            <Grid item xs={12} sm={12} lg={7}>
              <CrmRevenueGrowth />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={8}>
          <CrmEarningReportsWithTabs />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <CrmSalesWithRadarChart />
        </Grid>
        {/* <Grid item xs={12} md={6} lg={4}>
          <CrmBrowserStates />
        </Grid> */}
        {/* <Grid item xs={12} md={6} lg={4}>
          <CrmProjectStatus />
        </Grid> */}
        {/* <Grid item xs={12} md={6} lg={4}>
          <CrmActiveProjects />
        </Grid> */}
        <Grid item xs={12} md={6} lg={12}>
          <CrmLastTransaction />
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <CrmActivityTimeline />
        </Grid> */}
      </Grid>
    </ApexChartWrapper>
  )
}

export default Dashboard
