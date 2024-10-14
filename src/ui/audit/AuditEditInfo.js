// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import AuditViewLeft from 'src/ui/audit/AuditViewLeft'
import AuditViewRight from 'src/ui/audit/AuditViewRight'

const AuditEditInfo = ({ auditData, tab }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <AuditViewLeft auditData={auditData} />
      </Grid>
      <Grid item xs={12} md={12} lg={8}>
        <AuditViewRight auditData={auditData} tab={tab} />
      </Grid>
    </Grid>
  )
}

export default AuditEditInfo
