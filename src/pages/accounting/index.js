import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CrmEarningReportsWithTabs from 'src/ui/dashboard/CrmEarningReportsWithTabs'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import EcommerceTransactionsHorizontal from 'src/ui/accounting/EcommerceTransactionsHorizontal'
import AccountingTable from 'src/ui/accounting/AccountingTable'
import { Box } from '@mui/system'

const Accounting = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item lg={12}>
          {/* <Grid item xs={12} md={8} lg={12}>
          <EcommerceTransactionsHorizontal />
        </Grid> */}
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} lg={8}>
              <CrmEarningReportsWithTabs />
            </Grid>

            <Grid item xs={12} lg={4}>
              <Grid container spacing={6}>
                <Grid item xs={6} md={3} lg={6}>
                  <CardStatsVertical
                    stats='1.28k'
                    chipText='-12.2%'
                    chipColor='default'
                    avatarColor='error'
                    title='Total Profit'
                    subtitle='Last week'
                    avatarIcon='tabler:currency-dollar'
                  />
                </Grid>
                <Grid item xs={6} md={3} lg={6}>
                  <CardStatsVertical
                    stats='1.28k'
                    chipText='-12.2%'
                    chipColor='default'
                    avatarColor='error'
                    title='Total Profit'
                    subtitle='Last week'
                    avatarIcon='tabler:currency-dollar'
                  />
                </Grid>
                <Grid item xs={6} md={3} lg={6}>
                  <CardStatsVertical
                    stats='1.28k'
                    chipText='-12.2%'
                    chipColor='default'
                    avatarColor='error'
                    title='Total Profit'
                    subtitle='Last week'
                    avatarIcon='tabler:currency-dollar'
                  />
                </Grid>
                <Grid item xs={6} md={3} lg={6}>
                  <CardStatsVertical
                    stats='1.28k'
                    chipText='-12.2%'
                    chipColor='default'
                    avatarColor='error'
                    title='Total Profit'
                    subtitle='Last week'
                    avatarIcon='tabler:currency-dollar'
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
          <AccountingTable></AccountingTable>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  )
}

export default Accounting
