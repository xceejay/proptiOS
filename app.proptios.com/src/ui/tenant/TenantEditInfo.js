// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import TenantViewLeft from 'src/ui/tenant/TenantViewLeft'
import TenantViewRight from 'src/ui/tenant/TenantViewRight'

const TenantEditInfo = ({ tenantData, tab, loading, notFound }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={12} md={12} lg={4}>
        <TenantViewLeft tenantData={tenantData} loading={loading} notFound={notFound} />
      </Grid>
      <Grid size={12} md={12} lg={8}>
        <TenantViewRight tenantData={tenantData} tab={tab} notFound={notFound} />
      </Grid>
    </Grid>
  )
}

export default TenantEditInfo
