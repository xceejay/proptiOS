// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import TenantViewLeft from 'src/ui/tenant/TenantViewLeft'
import TenantViewRight from 'src/ui/tenant/TenantViewRight'
import ParentTenantViewRight from './ParentTenantViewRight'

const TenantEditInfo = ({ tenantData, tab }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12} md={5} lg={4}>
        <TenantViewLeft tenantData={tenantData} />
      </Grid> */}
      <Grid item xs={12} md={7} lg={12}>
        <ParentTenantViewRight tenantData={tenantData} tab={tab} />
      </Grid>
    </Grid>
  )
}

export default TenantEditInfo
