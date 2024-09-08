// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
// import LeaseViewLeft from 'src/ui/lease/LeaseViewLeft'
import LeaseViewRight from 'src/ui/lease/LeaseViewRight'

const LeaseEditInfo = ({ leasesData, tab }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12} md={5} lg={4}>
        <LeasesViewLeft leasesData={leasesData} />
      </Grid> */}

      {/* doubled all the values for size of grid */}
      <Grid item xs={24} md={14} lg={16}>
        <LeaseViewRight leasesData={leasesData} tab={tab} />
      </Grid>
    </Grid>
  )
}

export default LeaseEditInfo
