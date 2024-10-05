import { Grid } from '@mui/material'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

const ParentFinanceViewOverview = ({ setFinanceData, financeData }) => {
  return (
    <Grid>
      <Grid item xs={12} sm={12} lg={12}>
        <Grid container spacing={6} sx={{ mb: 4 }}>
          <Grid item xs={6} sm={6} lg={3}>
            {/* prettier-ignore */}
            <CardStatsVertical

                // stats={"0"}
                chipText={"0"}
                avatarColor='success'
                chipColor='default'
                title='Expenses'
                subtitle='Total property expenses'
                avatarIcon='tabler:home'
              />
          </Grid>

          {/*
          THIS ONE has stats
          <Grid item xs={6} sm={6} lg={3}>
            <CardStatsVertical
              stats={"0"}
              chipText={'0'}
              avatarColor='info'
              chipColor='default'
              title='Archived'
              subtitle='Total archived properties'
              avatarIcon='tabler:woman'
            />
          </Grid> */}

          <Grid item xs={6} sm={6} lg={3}>
            <CardStatsVertical
              chipText={'0'}
              avatarColor='primary'
              chipColor='default'
              title='Revenue'
              subtitle='Total property revenue'
              avatarIcon='tabler:woman'
            />
          </Grid>
          <Grid item xs={6} sm={6} lg={3}>
            <CardStatsVertical
              chipText={'0'}
              avatarColor='warning'
              chipColor='default'
              title='Settlements'
              subtitle='Total Settlements'
              avatarIcon='tabler:woman'
            />
          </Grid>
          <Grid item xs={6} sm={6} lg={3}>
            <CardStatsVertical
              chipText={'0'}
              avatarColor='secondary'
              chipColor='default'
              title='Profit'
              subtitle='Profit (revenue - expenses)'
              avatarIcon='tabler:woman'
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ParentFinanceViewOverview
