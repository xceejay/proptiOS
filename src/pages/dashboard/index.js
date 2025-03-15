// import '../../@fake-db'

// ** MUI Import
import Grid from '@mui/material/Grid'
import Link from 'next/link'

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
import axios from 'src/pages/middleware/axios'
import { useSite } from 'src/hooks/useSite'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [DashData, setDashData] = useState(null)
  const site = useSite()
  const [loading, setLoading] = useState(false)

  const paginationModel = {}

  useEffect(() => {
    site.getAllDashboard(
      { page: paginationModel?.page || 0, limit: paginationModel?.pageSize || 0 },
      responseData => {
        const { data } = responseData

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
          alert(response.message || 'Failed to fetch properties')
        } else {
          setDashData(data)
        }

        setLoading(false) // Stop loading when the request completes
      },
      error => {
        toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
        setLoading(false) // Stop loading on error
      }
    )
  }, [])

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        {/* <Grid>wanted to do switch for properties</Grid> */}
        <Grid item xs={12} sm={12} lg={12}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={6} lg={3}>
              <Link href='/tenants' style={{ textDecoration: 'none' }}>
                <CardStatsVertical
                  chipText={`${DashData?.total_tenants || 'No Data'} tenants`}
                  avatarColor='info'
                  chipColor='default'
                  title='Total tenants'
                  subtitle='All time'
                  avatarIcon='tabler:woman'
                />
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Link href='/leases' style={{ textDecoration: 'none' }}>
                <CardStatsVertical
                  chipText={`${DashData?.total_leases || 'No Data'} leases`}
                  avatarColor='success'
                  chipColor='default'
                  title='Units Occupied'
                  subtitle='All time'
                  avatarIcon='tabler:home'
                />
              </Link>
            </Grid>
            {/* Grid for properties */}
            <Grid item xs={12} sm={6} lg={3}>
              <Link href='/properties' style={{ textDecoration: 'none' }}>
                <CardStatsVertical
                  chipText={`${DashData?.total_units || 'No Data'} units`}
                  avatarColor='info'
                  chipColor='default'
                  title='Total units'
                  subtitle='All time'
                  avatarIcon='tabler:home'
                />
              </Link>
            </Grid>
            {/* Grid for properties */}
            <Grid item xs={12} sm={6} lg={3}>
              <Link href='/properties' style={{ textDecoration: 'none' }}>
                <CardStatsVertical
                  chipText={`${DashData?.total_properties || 'No Data'} properties`}
                  avatarColor='info'
                  chipColor='default'
                  title='Total Properties'
                  subtitle='All time'
                  avatarIcon='tabler:building-community'
                />
              </Link>
            </Grid>

            <Grid item xs={12} sm={12} lg={12}>
              <CrmRevenueGrowth DashData={DashData} setDashData={setDashData} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={8}>
          <CrmEarningReportsWithTabs DashData={DashData} setDashData={setDashData} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <CrmSalesWithRadarChart DashData={DashData} setDashData={setDashData} />
        </Grid>
        {/* <Grid item xs={12} md={6} lg={4}>
          <CrmBrowserStates DashData={DashData} setDashData={setDashData} />
        </Grid> */}
        {/* <Grid item xs={12} md={6} lg={4}>
          <CrmProjectStatus DashData={DashData} setDashData={setDashData} />
        </Grid> */}
        {/* <Grid item xs={12} md={6} lg={4}>
          <CrmActiveProjects DashData={DashData} setDashData={setDashData} />
        </Grid> */}
        {/* <Grid item xs={12} md={6} lg={12}>
          <CrmLastTransaction DashData={DashData} setDashData={setDashData} />
        </Grid> */}
        {/* <Grid item xs={12} md={6}>
          <CrmActivityTimeline DashData={DashData} setDashData={setDashData} />
        </Grid> */}
      </Grid>
    </ApexChartWrapper>
  )
}

// export async function getServerSideProps(params) {
//   const res = await axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + '/')
//   console.log('res-data', res.data)
//   const DashboardData = res.data

//   return {
//     props: {
//       ...DashboardData
//     }
//   }
// }

Dashboard.acl = { action: 'read', subject: 'dashboard' }

export default Dashboard
