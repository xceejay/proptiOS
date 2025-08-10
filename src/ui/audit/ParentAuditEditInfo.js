// ** MUI Imports
import { GridLegacy as Grid } from '@mui/material'

// ** Demo Components Imports

import ParentAuditViewRight from './ParentAuditViewRight'

const AuditEditInfo = ({ auditData, tab }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12} md={5} lg={4}>
        <AuditViewLeft auditData={auditData} />
      </Grid> */}
      <Grid item xs={12} md={12} lg={12}>
        <ParentAuditViewRight auditData={auditData} tab={tab} />
      </Grid>
    </Grid>
  )
}

export default AuditEditInfo
