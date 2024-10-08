// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import AlertTitle from '@mui/material/AlertTitle'
import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LinearProgress from '@mui/material/LinearProgress'
import TableContainer from '@mui/material/TableContainer'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'

import MuiTab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import Payment from 'payment'
import Cards from 'react-credit-cards'

// ** Custom Components
import CustomChip from 'src/@core/components/mui/chip'
import TenantSubscriptionDialog from 'src/ui/tenant/TenantSubscriptionDialog'

// ** Util Import
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format'

// ** Styled Component Imports
import CardWrapper from 'src/@core/styles/libs/react-credit-cards'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { Accordion, AccordionDetails, AccordionSummary, Chip } from '@mui/material'
import FinanceTransactionListTable from './FinanceTransactionListTable'
import FinanceSettlementHistoryTable from './FinanceSettlementHistoryTable'
import FinanceSettlementConfigurationTab from './FinanceSettlementConfigurationTab'
import FinanceExpensesTable from './FinanceExpensesTable'

const ParentFinanceViewExpenses = ({ setFinanceData, financeData }) => {
  const [value, setValue] = useState('1')

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <FinanceExpensesTable></FinanceExpensesTable>

        {/* <Card>
          <CardContent sx={{ mt: 2, padding: 0 }}>
            <TabContext value={value}>
              <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
                <Tab value='1' label='History' />
                <Tab value='2' label='Scheduling' />
              </TabList>

              <TabPanel value='1'>
                <Typography>
                  <FinanceSettlementHistoryTable></FinanceSettlementHistoryTable>
                </Typography>
              </TabPanel>
              <TabPanel value='2'>
                <FinanceSettlementConfigurationTab></FinanceSettlementConfigurationTab>
              </TabPanel>
            </TabContext>
          </CardContent>
        </Card> */}
      </Grid>
    </Grid>
  )
}

export default ParentFinanceViewExpenses
