import { Card, Grid } from '@mui/material'
import FinancialTransactionListTable from './FinancialTransactionListTable'

const ParentFinancialViewPayments = ({ setFinancialData, financialData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={20} lg={24}>
        <Card sx={{ mb: 4 }}>
          {' '}
          <FinancialTransactionListTable
            financialData={financialData}
            setFinancialData={setFinancialData}
          ></FinancialTransactionListTable>
        </Card>

        {/* <Card>
  <CardContent></CardContent>
</Card> */}
      </Grid>
    </Grid>
  )
}

export default ParentFinancialViewPayments
