// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import TenantViewLeft from 'src/ui/tenant/TenantViewLeft'
import TenantViewRight from 'src/ui/tenant/TenantViewRight'

const TenantEditInfo = ({ tenantData, tab }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={12} lg={4}>
        <TenantViewLeft tenantData={tenantData} />
      </Grid>
      <Grid item xs={12} md={12} lg={8}>
        <TenantViewRight tenantData={tenantData} tab={tab} />
      </Grid>
    </Grid>
  )
}

export default TenantEditInfo
