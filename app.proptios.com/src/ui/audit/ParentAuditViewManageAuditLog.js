// ** React Imports
import { Grid } from '@mui/material'

import toast from 'react-hot-toast'
import AuditManageTable from './AuditManageTable'

const ParentAuditViewManageAuditLog = ({ auditData }) => {
  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <AuditManageTable></AuditManageTable>
      </Grid>
    </Grid>
  )
}

export default ParentAuditViewManageAuditLog
