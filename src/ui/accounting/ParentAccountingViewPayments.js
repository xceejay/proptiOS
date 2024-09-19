import { Card, Grid } from '@mui/material'
import AccountingTransactionListTable from './AccountingTransactionListTable'

const ParentAccountingViewPayments = ({ setAccountingData, accountingData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={20} lg={24}>
        <Card sx={{ mb: 4 }}>
          {' '}
          <AccountingTransactionListTable
            accountingData={accountingData}
            setAccountingData={setAccountingData}
          ></AccountingTransactionListTable>
        </Card>

        {/* <Card>
  <CardContent></CardContent>
</Card> */}
      </Grid>
    </Grid>
  )
}

export default ParentAccountingViewPayments
