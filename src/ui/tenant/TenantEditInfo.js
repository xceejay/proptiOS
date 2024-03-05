// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import TenantViewLeft from 'src/ui/tenant/TenantViewLeft'
import TenantViewRight from 'src/ui/tenant/TenantViewRight'

const TenantEditInfo = ({ tab, invoiceData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <TenantViewLeft />
      </Grid>
      <Grid item xs={12} md={7} lg={8}>
        <TenantViewRight tab={tab} invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default TenantEditInfo
