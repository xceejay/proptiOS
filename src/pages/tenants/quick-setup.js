// ** MUI Imports
import Grid from '@mui/material/Grid'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import TenantsQuickSetupForm from 'src/ui/tenant/quick-setup/TenantQuickSetupForm'

const TenantsQuickSetup = () => {
  return (
    <DatePickerWrapper>
      <Grid item xs={12}>
        <TenantsQuickSetupForm />
      </Grid>
    </DatePickerWrapper>
  )
}

export default TenantsQuickSetup
