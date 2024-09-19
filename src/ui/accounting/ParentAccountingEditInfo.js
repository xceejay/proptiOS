// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import ParentAccountingViewRight from './ParentAccountingViewRight'

const ParentAccountingEditInfo = ({ setAccountingData, accountingData, tab }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12} md={5} lg={4}>
        <AccountingViewLeft setAccountingData={setAccountingData} accountingData={accountingData} />
      </Grid> */}
      <Grid item xs={12} md={7} lg={12}>
        <ParentAccountingViewRight tab={tab} setAccountingData={setAccountingData} accountingData={accountingData} />
      </Grid>
    </Grid>
  )
}

export default ParentAccountingEditInfo
