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
import TenantManageTable from './TenantManageTable'

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

const ParentTenantViewManagement = ({ tenantData }) => {
  return (
    <Grid>
      <TenantManageTable></TenantManageTable>
    </Grid>
  )
}

export default ParentTenantViewManagement
