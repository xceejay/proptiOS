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

const Dashboard = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        {/* <Grid item xs={6} sm={4} lg={2}>
          <CrmSalesWithAreaChart />
        </Grid>
        <Grid item xs={6} sm={4} lg={2}>
          <CrmSessions />
        </Grid> */}
        <Grid item xs={6} sm={4} lg={2.5}>
          <CardStatsVertical
            stats='1.28k'
            chipText='-12.2%'
            chipColor='default'
            avatarColor='info'
            title='My Total Properties'
            subtitle='Last week'
            avatarIcon='tabler:home'
          />
        </Grid>
        <Grid item xs={6} sm={4} lg={2.5}>
          <CardStatsVertical
            stats='24.67k'
            chipText='+25.2%'
            avatarColor='success'
            chipColor='default'
            title='Total Properties Rented'
            subtitle='Last week'
            avatarIcon='tabler:home'
          />
        </Grid>
        <Grid item xs={6} sm={4} lg={2.5}>
          <CardStatsVertical
            stats='24.67k'
            chipText='+25.2%'
            avatarColor='error'
            chipColor='default'
            title='Total Properties idkyet'
            subtitle='Last week'
            avatarIcon='tabler:home'
          />
        </Grid>
        <Grid item xs={12} sm={8} lg={4}>
          <CrmRevenueGrowth />
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
        <Grid item xs={12} md={6} lg={4}>
          <CrmProjectStatus />
        </Grid>
        {/* <Grid item xs={12} md={6} lg={4}>
          <CrmActiveProjects />
        </Grid> */}
        <Grid item xs={12} md={6}>
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
