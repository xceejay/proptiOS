// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import SettingsViewLeft from 'src/ui/settings/SettingsViewLeft'
import SettingsViewRight from 'src/ui/settings/SettingsViewRight'

const SettingsView = ({ tab, invoiceData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={12} md={5} lg={4}>
        <SettingsViewLeft />
      </Grid>
      <Grid size={12} md={12} lg={8}>
        <SettingsViewRight tab={tab} invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default SettingsView
