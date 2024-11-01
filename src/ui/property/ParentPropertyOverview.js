import { Grid, Typography } from '@mui/material'
import PropertyManageTable from './PropertyManageTable'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

const ParentPropertyViewOverview = ({ setPropertiesData, propertiesData }) => {
  return (
    <Grid>
      <Grid item xs={12} sm={12} lg={12}>
        <Grid container spacing={6} sx={{ mb: 4 }}>
          {propertiesData.length > 0 ? (
            <>
              <Grid
                item
                xs={6}
                sm={6}
                lg={3}
                onClick={() => {
                  window.location.href = '/tenants'
                }}
              >
                <CardStatsVertical
                  chipText={propertiesData.reduce((total, item) => total + item.total_tenants, 0)}
                  avatarColor='success'
                  chipColor='default'
                  title='Total Tenants'
                  subtitle='Number of tenants'
                  avatarIcon='tabler:user'
                />
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                lg={3}
                onClick={() => {
                  window.location.href = '/tenants'
                }}
              >
                <CardStatsVertical
                  chipText={propertiesData.reduce((total, item) => total + item.active_tenants, 0)}
                  avatarColor='success'
                  chipColor='default'
                  title='Active Tenants'
                  subtitle='Tenants with active account'
                  avatarIcon='tabler:user-check'
                />
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                lg={3}
                onClick={() => {
                  window.location.href = '/leases'
                }}
              >
                <CardStatsVertical
                  chipText={propertiesData.reduce((total, item) => total + item.total_leases, 0)}
                  avatarColor='warning'
                  chipColor='default'
                  title='Total Leases'
                  subtitle='Leases active'
                  avatarIcon='tabler:file'
                />
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                lg={3}
                onClick={() => {
                  window.location.href = '/properties/management'
                }}
              >
                <CardStatsVertical
                  chipText={propertiesData.reduce((total, item) => total + item.total_maintenance_requests, 0)}
                  avatarColor='secondary'
                  chipColor='default'
                  title='Maintenance Requests'
                  subtitle='Pending requests'
                  avatarIcon='tabler:tools'
                />
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                lg={3}
                onClick={() => {
                  window.location.href = '/properties/management'
                }}
              >
                <CardStatsVertical
                  chipText={propertiesData.reduce((total, item) => total + item.total_applicants, 0)}
                  avatarColor='info'
                  chipColor='default'
                  title='Total Applicants'
                  subtitle='Applicants count'
                  avatarIcon='tabler:user-check'
                />
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                lg={3}
                onClick={() => {
                  window.location.href = '/properties/management'
                }}
              >
                <CardStatsVertical
                  chipText={propertiesData.reduce((total, item) => total + item.units_vacant, 0)}
                  avatarColor='error'
                  chipColor='default'
                  title='Vacant Units'
                  subtitle='Units not occupied'
                  avatarIcon='tabler:door'
                />
              </Grid>
              <Grid
                item
                xs={6}
                sm={6}
                lg={3}
                onClick={() => {
                  window.location.href = '/leases'
                }}
              >
                <CardStatsVertical
                  chipText={propertiesData.reduce((total, item) => total + item.leases_expiring_soon, 0)}
                  avatarColor='error'
                  chipColor='default'
                  title='Leases Expiring Soon'
                  subtitle='Leases expiring in next 30 days'
                  avatarIcon='tabler:alarm'
                />
              </Grid>
            </>
          ) : // <Grid item xs={12} sx={{ textAlign: 'center', p: 4 }}>
          //   <Typography variant='h5'>No data available to show</Typography>
          // </Grid>
          null}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ParentPropertyViewOverview
