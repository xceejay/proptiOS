// import { useEffect, useState } from 'react'

// import Grid from '@mui/material/Grid'
// import LeasesEditInfo from '../../ui/leases/LeasesEditInfo'
// import { useRouter } from 'next/router'

// const LeasesPage = () => {
//   const router = useRouter
//   const tab = router.query?.tab || 'active'
//   const [tenantData, setLeaseData] = useState(null)

//   return <LeasesEditInfo tab={tab} tenantData={tenantData} />
// }

// export default LeasesPage

// ** MUI Imports
import Grid from '@mui/material/Grid'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

import LeaseManageTable from 'src/ui/lease/LeaseManageTable'

const LeasePage = () => {
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
      <Grid>
        <LeaseManageTable></LeaseManageTable>
      </Grid>
    </Grid>
  )
}

export default LeasePage
