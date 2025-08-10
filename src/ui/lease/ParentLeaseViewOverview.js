// ** MUI Imports

import { GridLegacy as Grid } from '@mui/material'

import { styled } from '@mui/material/styles'

import MuiTimeline from '@mui/lab/Timeline'

import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

// Styled Timeline component
const Timeline = styled(MuiTimeline)(({ theme }) => ({
  margin: 0,
  padding: 0,
  marginLeft: theme.spacing(0.75),
  '& .MuiTimelineItem-root': {
    '&:before': {
      display: 'none'
    },
    '&:last-child': {
      minHeight: 60
    }
  }
}))

const ParentLeaseViewOverview = ({ leaseData }) => {
  return (
    <Grid container spacing={6}>
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
              subtitle='Total active leases'
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
            subtitle='Total archived leases'
            avatarIcon='tabler:woman'
          />
        </Grid> */}

          <Grid item xs={6} sm={6} lg={3}>
            <CardStatsVertical
              chipText={'0'}
              avatarColor='primary'
              chipColor='default'
              title='Total'
              subtitle='Total leases'
              avatarIcon='tabler:woman'
            />
          </Grid>
          <Grid item xs={6} sm={6} lg={3}>
            <CardStatsVertical
              chipText={'0'}
              avatarColor='warning'
              chipColor='default'
              title='Expiring Soon'
              subtitle='Leases expiring soon'
              avatarIcon='tabler:woman'
            />
          </Grid>
          <Grid item xs={6} sm={6} lg={3}>
            <CardStatsVertical
              chipText={'0'}
              avatarColor='secondary'
              chipColor='default'
              title='Archived'
              subtitle='Total archived leases'
              avatarIcon='tabler:woman'
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ParentLeaseViewOverview
