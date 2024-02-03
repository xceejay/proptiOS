// ** MUI Imports
import Grid from '@mui/material/Grid'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import StepperCustomHorizontal from 'src/ui/tenant/quick-setup/StepperCustomHorizontal'

const TenantsQuickSetup = () => {
  return (
    <DatePickerWrapper>
      <Grid item xs={12}>
        <StepperCustomHorizontal />
      </Grid>
    </DatePickerWrapper>
  )
}

export default TenantsQuickSetup
