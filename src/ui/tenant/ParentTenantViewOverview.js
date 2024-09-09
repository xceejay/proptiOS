// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import MuiTimeline from '@mui/lab/Timeline'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Component Imports
import TenantInvoiceListTable from 'src/ui/tenant/TenantInvoiceListTable'
import TenantProjectListTable from 'src/ui/tenant/TenantProjectListTable'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
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

const ParentTenantViewOverview = ({ tenantData }) => {
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
              subtitle='Total active tenants'
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
            subtitle='Total archived tenants'
            avatarIcon='tabler:woman'
          />
        </Grid> */}

          <Grid item xs={6} sm={6} lg={3}>
            <CardStatsVertical
              chipText={'0'}
              avatarColor='primary'
              chipColor='default'
              title='Total'
              subtitle='Total tenants'
              avatarIcon='tabler:woman'
            />
          </Grid>
          <Grid item xs={6} sm={6} lg={3}>
            <CardStatsVertical
              chipText={'0'}
              avatarColor='warning'
              chipColor='default'
              title='Expiring Soon'
              subtitle='Tenants expiring soon'
              avatarIcon='tabler:woman'
            />
          </Grid>
          <Grid item xs={6} sm={6} lg={3}>
            <CardStatsVertical
              chipText={'0'}
              avatarColor='secondary'
              chipColor='default'
              title='Archived'
              subtitle='Total archived tenants'
              avatarIcon='tabler:woman'
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ParentTenantViewOverview
