import { Card, Grid } from '@mui/material'
import FinanceTransactionListTable from './FinanceTransactionListTable'

const ParentFinanceViewPayments = ({ setFinanceData, financeData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={20} lg={12}>
        <Card sx={{ mb: 4 }}>
          {' '}
          <FinanceTransactionListTable
            financeData={financeData}
            setFinanceData={setFinanceData}
          ></FinanceTransactionListTable>
        </Card>

        {/* <Card>
  <CardContent></CardContent>
</Card> */}
      </Grid>
    </Grid>
  )
}

export default ParentFinanceViewPayments
