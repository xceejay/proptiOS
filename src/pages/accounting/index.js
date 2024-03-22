import Grid from '@mui/material/Grid'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CrmEarningReportsWithTabs from 'src/ui/dashboard/CrmEarningReportsWithTabs'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import AccountingTable from 'src/ui/accounting/AccountingTable'

const Accounting = () => {
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item lg={12}>
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
                    avatarColor='info'
                    title='Net Income'
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
                    title='Net Loss'
                    subtitle='Last week'
                    avatarIcon='tabler:currency-dollar'
                  />
                </Grid>
                <Grid item xs={6} md={3} lg={6}>
                  <CardStatsVertical
                    stats='1.28k'
                    chipText='-12.2%'
                    chipColor='default'
                    avatarColor='info'
                    title='Property Value'
                    subtitle='Last week'
                    avatarIcon='tabler:home'
                  />
                </Grid>
                <Grid item xs={6} md={3} lg={6}>
                  <CardStatsVertical
                    stats='1.28k'
                    chipText='-12.2%'
                    chipColor='default'
                    avatarColor='warning'
                    title='Tax Payable'
                    subtitle='Last week'
                    avatarIcon='tabler:receipt-2'
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
