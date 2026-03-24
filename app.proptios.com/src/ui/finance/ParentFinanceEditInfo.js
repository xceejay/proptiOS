// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import ParentFinanceViewRight from './ParentFinanceViewRight'

const ParentFinanceEditInfo = ({ setFinanceData, financeData, tab }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid size={12} md={5} lg={4}>
        <FinanceViewLeft setFinanceData={setFinanceData} financeData={financeData} />
      </Grid> */}
      <Grid size={12} md={12} lg={12}>
        <ParentFinanceViewRight tab={tab} setFinanceData={setFinanceData} financeData={financeData} />
      </Grid>
    </Grid>
  )
}

export default ParentFinanceEditInfo
