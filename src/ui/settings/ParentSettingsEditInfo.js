// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports

import ParentSettingsViewRight from './ParentSettingsViewRight'

const ParentSettingsEditInfo = ({ settingsData, tab }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12} md={5} lg={4}>
        <SettingsViewLeft settingsData={settingsData} />
      </Grid> */}
      <Grid item xs={12} md={12} lg={12}>
        <ParentSettingsViewRight settingsData={settingsData} tab={tab} />
      </Grid>
    </Grid>
  )
}

export default ParentSettingsEditInfo
