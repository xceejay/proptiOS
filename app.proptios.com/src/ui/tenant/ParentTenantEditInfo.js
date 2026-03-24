// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import ParentTenantViewRight from './ParentTenantViewRight'

const TenantEditInfo = ({ tenantData, tab }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid size={12} md={5} lg={4}>
        <TenantViewLeft tenantData={tenantData} />
      </Grid> */}
      <Grid size={12} md={12} lg={12}>
        <ParentTenantViewRight tenantData={tenantData} tab={tab} />
      </Grid>
    </Grid>
  )
}

export default TenantEditInfo
