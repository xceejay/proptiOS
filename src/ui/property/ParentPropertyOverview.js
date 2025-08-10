import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import { Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import NextLink from 'next/link'
import { styled } from '@mui/material/styles'

const ParentPropertyViewOverview = ({ setPropertiesData, propertiesData }) => {
  const Link = styled(NextLink)(({ theme }) => ({
    fontSize: '0.875rem',
    textDecoration: 'none',
    color: theme.palette.primary.main
  }))

  return (
    <Grid>
      <Grid
        size={{
          xs: 12,
          sm: 12,
          lg: 12
        }}>
        <Grid container spacing={6} sx={{ mb: 4 }}>
          {propertiesData.length > 0 ? (
            <>
              <Grid
                size={{
                  xs: 6,
                  sm: 6,
                  lg: 3
                }}>
                <Link prefetch={true} href='/tenants' underline='none' color='inherit'>
                  <CardStatsVertical
                    chipText={propertiesData.reduce((total, item) => total + item.total_tenants, 0)}
                    avatarColor='success'
                    chipColor='default'
                    title='Total Tenants'
                    subtitle='Number of tenants'
                    avatarIcon='tabler:user'
                  />
                </Link>
              </Grid>
              <Grid
                size={{
                  xs: 6,
                  sm: 6,
                  lg: 3
                }}>
                <Link prefetch={true} href='/tenants' underline='none' color='inherit'>
                  <CardStatsVertical
                    chipText={propertiesData.reduce((total, item) => total + item.active_tenants, 0)}
                    avatarColor='success'
                    chipColor='default'
                    title='Active Tenants'
                    subtitle='Tenants with active account'
                    avatarIcon='tabler:user-check'
                  />
                </Link>
              </Grid>
              <Grid
                size={{
                  xs: 6,
                  sm: 6,
                  lg: 3
                }}>
                <Link prefetch={true} href='/leases' underline='none' color='inherit'>
                  <CardStatsVertical
                    chipText={propertiesData.reduce((total, item) => total + item.total_leases, 0)}
                    avatarColor='warning'
                    chipColor='default'
                    title='Total Leases'
                    subtitle='Leases active'
                    avatarIcon='tabler:file'
                  />
                </Link>
              </Grid>
              <Grid
                size={{
                  xs: 6,
                  sm: 6,
                  lg: 3
                }}>
                <Link prefetch={true} href='/properties/management' underline='none' color='inherit'>
                  <CardStatsVertical
                    chipText={propertiesData.reduce((total, item) => total + item.total_maintenance_requests, 0)}
                    avatarColor='secondary'
                    chipColor='default'
                    title='Maintenance Requests'
                    subtitle='Pending requests'
                    avatarIcon='tabler:tools'
                  />
                </Link>
              </Grid>
              <Grid
                size={{
                  xs: 6,
                  sm: 6,
                  lg: 3
                }}>
                <Link prefetch={true} href='/properties/management' underline='none' color='inherit'>
                  <CardStatsVertical
                    chipText={propertiesData.reduce((total, item) => total + item.pending_maintenance_requests, 0)}
                    avatarColor='error'
                    chipColor='default'
                    title='Pending Maintenance Requests'
                    subtitle='Pending requests'
                    avatarIcon='tabler:tools'
                  />
                </Link>
              </Grid>
              <Grid
                size={{
                  xs: 6,
                  sm: 6,
                  lg: 3
                }}>
                <Link prefetch={true} href='/properties/management' underline='none' color='inherit'>
                  <CardStatsVertical
                    chipText={propertiesData.reduce((total, item) => total + item.total_applicants, 0)}
                    avatarColor='info'
                    chipColor='default'
                    title='Total Applicants'
                    subtitle='Applicants count'
                    avatarIcon='tabler:user-check'
                  />
                </Link>
              </Grid>
              <Grid
                size={{
                  xs: 6,
                  sm: 6,
                  lg: 3
                }}>
                <Link prefetch={true} href='/properties/management' underline='none' color='inherit'>
                  <CardStatsVertical
                    chipText={propertiesData.reduce((total, item) => total + item.units_vacant, 0)}
                    avatarColor='error'
                    chipColor='default'
                    title='Vacant Units'
                    subtitle='Units not occupied'
                    avatarIcon='tabler:door'
                  />
                </Link>
              </Grid>
              <Grid
                size={{
                  xs: 6,
                  sm: 6,
                  lg: 3
                }}>
                <Link prefetch={true} href='/leases' underline='none' color='inherit'>
                  <CardStatsVertical
                    chipText={propertiesData.reduce((total, item) => total + item.leases_expiring_soon, 0)}
                    avatarColor='error'
                    chipColor='default'
                    title='Leases Expiring Soon'
                    subtitle='Leases expiring in next 30 days'
                    avatarIcon='tabler:alarm'
                  />
                </Link>
              </Grid>
            </>
          ) : // <Grid size={12} sx={{ textAlign: 'center', p: 4 }}>
          //   <Typography variant='h5'>No data available to show</Typography>
          // </Grid>
          null}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ParentPropertyViewOverview
