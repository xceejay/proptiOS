// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import LeasesViewLeft from 'src/ui/leases/LeasesViewLeft'
import LeasesViewRight from 'src/ui/leases/LeasesViewRight'

const LeasesEditInfo = ({ leasesData, tab }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12} md={5} lg={4}>
        <LeasesViewLeft leasesData={leasesData} />
      </Grid> */}

      {/* doubled all the values for size of grid */}
      <Grid item xs={24} md={14} lg={16}>
        <LeasesViewRight leasesData={leasesData} tab={tab} />
      </Grid>
    </Grid>
  )
}

export default LeasesEditInfo
