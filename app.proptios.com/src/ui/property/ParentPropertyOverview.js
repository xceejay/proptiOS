import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import Grid from '@mui/material/Grid'
import NextLink from 'next/link'
import { styled } from '@mui/material/styles'

const ParentPropertyViewOverview = ({ setPropertiesData, propertiesData }) => {
  const Link = styled(NextLink)(({ theme }) => ({
    fontSize: '0.875rem',
    textDecoration: 'none',
    color: theme.palette.primary.main
  }))

  const safeProperties = propertiesData || []
  const hasProperties = safeProperties.length > 0
  const total = selector => safeProperties.reduce((sum, item) => sum + (selector(item) || 0), 0)
  const emptySubtitle = 'Add your first property to get started'

  return (
    <Grid>
      <Grid
        size={{
          xs: 12,
          sm: 12,
          lg: 12
        }}>
        <Grid container spacing={6} sx={{ mb: 4 }}>
          <Grid
            size={{
              xs: 6,
              sm: 6,
              lg: 3
            }}>
            <Link prefetch={true} href='/tenants' underline='none' color='inherit'>
              <CardStatsVertical
                chipText={total(item => item.total_tenants)}
                avatarColor='success'
                chipColor='default'
                title='Total Tenants'
                subtitle={hasProperties ? 'Number of tenants' : emptySubtitle}
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
                chipText={total(item => item.active_tenants)}
                avatarColor='success'
                chipColor='default'
                title='Active Tenants'
                subtitle={hasProperties ? 'Tenants with active account' : emptySubtitle}
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
                chipText={total(item => item.total_leases)}
                avatarColor='warning'
                chipColor='default'
                title='Total Leases'
                subtitle={hasProperties ? 'Leases active' : emptySubtitle}
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
                chipText={total(item => item.total_maintenance_requests)}
                avatarColor='secondary'
                chipColor='default'
                title='Maintenance Requests'
                subtitle={hasProperties ? 'Pending requests' : emptySubtitle}
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
                chipText={total(item => item.pending_maintenance_requests)}
                avatarColor='error'
                chipColor='default'
                title='Pending Maintenance Requests'
                subtitle={hasProperties ? 'Pending requests' : emptySubtitle}
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
                chipText={total(item => item.total_applicants)}
                avatarColor='info'
                chipColor='default'
                title='Total Applicants'
                subtitle={hasProperties ? 'Applicants count' : emptySubtitle}
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
                chipText={total(item => item.units_vacant)}
                avatarColor='error'
                chipColor='default'
                title='Vacant Units'
                subtitle={hasProperties ? 'Units not occupied' : emptySubtitle}
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
                chipText={total(item => item.leases_expiring_soon)}
                avatarColor='error'
                chipColor='default'
                title='Leases Expiring Soon'
                subtitle={hasProperties ? 'Leases expiring in next 30 days' : emptySubtitle}
                avatarIcon='tabler:alarm'
              />
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ParentPropertyViewOverview
