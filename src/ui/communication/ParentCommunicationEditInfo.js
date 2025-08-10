// ** MUI Imports
import { GridLegacy as Grid } from '@mui/material'

// ** Demo Components Imports

import ParentCommunicationViewRight from './ParentCommunicationViewRight'

const CommunicationEditInfo = ({ communicationData, tab }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12} md={5} lg={4}>
        <CommunicationViewLeft communicationData={communicationData} />
      </Grid> */}
      <Grid item xs={12} md={12} lg={12}>
        <ParentCommunicationViewRight communicationData={communicationData} tab={tab} />
      </Grid>
    </Grid>
  )
}

export default CommunicationEditInfo
