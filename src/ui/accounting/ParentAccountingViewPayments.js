import { Grid } from '@mui/material'
import AccountingTable from './AccountingTable'

const ParentAccountingViewPayments = ({ setAccountingData, accountingData }) => {
  return (
    <Grid>
      <AccountingTable></AccountingTable>
    </Grid>
  )
}

export default ParentAccountingViewPayments
