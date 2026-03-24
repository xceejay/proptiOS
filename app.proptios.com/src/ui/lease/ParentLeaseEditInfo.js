// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import ParentLeaseViewRight from './ParentLeaseViewRight'

const LeaseEditInfo = ({ leaseData, tab }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid size={12} md={5} lg={4}>
        <LeaseViewLeft leaseData={leaseData} />
      </Grid> */}
      <Grid size={12} md={12} lg={12}>
        <ParentLeaseViewRight leaseData={leaseData} tab={tab} />
      </Grid>
    </Grid>
  )
}

export default LeaseEditInfo
