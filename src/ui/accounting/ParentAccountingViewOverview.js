import { Grid } from '@mui/material'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

const ParentAccountingViewOverview = ({ setAccountingData, accountingData }) => {
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
                title='Active'
                subtitle='Total active properties'
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
              title='Total'
              subtitle='Total properties'
              avatarIcon='tabler:woman'
            />
          </Grid>
          <Grid item xs={6} sm={6} lg={3}>
            <CardStatsVertical
              chipText={'0'}
              avatarColor='warning'
              chipColor='default'
              title='Expiring Soon'
              subtitle='Properties expiring soon'
              avatarIcon='tabler:woman'
            />
          </Grid>
          <Grid item xs={6} sm={6} lg={3}>
            <CardStatsVertical
              chipText={'0'}
              avatarColor='secondary'
              chipColor='default'
              title='Archived'
              subtitle='Total archived properties'
              avatarIcon='tabler:woman'
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ParentAccountingViewOverview
