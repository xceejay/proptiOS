// ** MUI Imports
import { GridLegacy as Grid } from '@mui/material'

// ** Demo Components Imports
import SettingsViewLeft from 'src/ui/settings/SettingsViewLeft'
import SettingsViewRight from 'src/ui/settings/SettingsViewRight'

const SettingsEditInfo = ({ settingsData, tab }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <SettingsViewLeft settingsData={settingsData} />
      </Grid>
      <Grid item xs={12} md={12} lg={8}>
        <SettingsViewRight settingsData={settingsData} tab={tab} />
      </Grid>
    </Grid>
  )
}

export default SettingsEditInfo
