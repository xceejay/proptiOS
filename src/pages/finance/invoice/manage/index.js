// import { useEffect, useState } from 'react'

// import Grid from '@mui/material/Grid'
// import InvoicesEditInfo from '../../ui/invoices/InvoicesEditInfo'
// import { useRouter } from 'next/router'

// const InvoicesPage = () => {
//   const router = useRouter
//   const tab = router.query?.tab || 'active'
//   const [tenantData, setInvoiceData] = useState(null)

//   return <InvoicesEditInfo tab={tab} tenantData={tenantData} />
// }

// export default InvoicesPage

// ** MUI Imports
import Grid from '@mui/material/Grid'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

import InvoiceManageTable from 'src/ui/invoice/InvoiceManageTable'

const InvoicePage = () => {
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
                subtitle='Total active invoices'
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
              subtitle='Total archived invoices'
              avatarIcon='tabler:woman'
            />
          </Grid> */}

          <Grid item xs={6} sm={6} lg={3}>
            <CardStatsVertical
              chipText={'0'}
              avatarColor='primary'
              chipColor='default'
              title='Total'
              subtitle='Total invoices'
              avatarIcon='tabler:woman'
            />
          </Grid>
          <Grid item xs={6} sm={6} lg={3}>
            <CardStatsVertical
              chipText={'0'}
              avatarColor='warning'
              chipColor='default'
              title='Expiring Soon'
              subtitle='Invoices expiring soon'
              avatarIcon='tabler:woman'
            />
          </Grid>
          <Grid item xs={6} sm={6} lg={3}>
            <CardStatsVertical
              chipText={'0'}
              avatarColor='secondary'
              chipColor='default'
              title='Archived'
              subtitle='Total archived invoices'
              avatarIcon='tabler:woman'
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid>
        <InvoiceManageTable></InvoiceManageTable>
      </Grid>
    </Grid>
  )
}

export default InvoicePage
