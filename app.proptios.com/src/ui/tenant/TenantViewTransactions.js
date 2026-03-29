import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import UserTransactionListTable from 'src/ui/user/UserTransactionListTable'

const TenantViewTransactions = ({ tenantData }) => {
  if (!tenantData) {
    return (
      <Grid container spacing={6}>
        <Grid size={12}>
          <Alert severity='error'>Tenant details could not be loaded, so transactions are unavailable for this route.</Alert>
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <UserTransactionListTable userTransactionData={tenantData.transactions || []} />
      </Grid>
    </Grid>
  )
}

export default TenantViewTransactions
