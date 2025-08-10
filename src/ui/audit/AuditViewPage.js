// ** MUI Imports
import { GridLegacy as Grid } from '@mui/material'

// ** Demo Components Imports
import AuditViewLeft from 'src/ui/audit/AuditViewLeft'
import AuditViewRight from 'src/ui/audit/AuditViewRight'

const AuditView = ({ tab, invoiceData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <AuditViewLeft />
      </Grid>
      <Grid item xs={12} md={12} lg={8}>
        <AuditViewRight tab={tab} invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default AuditView
