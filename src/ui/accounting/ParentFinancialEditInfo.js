// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import ParentFinancialViewRight from './ParentFinancialViewRight'

const ParentFinancialEditInfo = ({ setFinancialData, financialData, tab }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12} md={5} lg={4}>
        <FinancialViewLeft setFinancialData={setFinancialData} financialData={financialData} />
      </Grid> */}
      <Grid item xs={12} md={7} lg={12}>
        <ParentFinancialViewRight tab={tab} setFinancialData={setFinancialData} financialData={financialData} />
      </Grid>
    </Grid>
  )
}

export default ParentFinancialEditInfo
