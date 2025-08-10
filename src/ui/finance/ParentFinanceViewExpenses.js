// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'


// ** Icon Imports

// ** Third Party Imports

// ** Custom Components

// ** Util Import

// ** Styled Component Imports

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import FinanceExpensesTable from './FinanceExpensesTable'

const ParentFinanceViewExpenses = ({ setFinanceData, financeData }) => {
  const [value, setValue] = useState('1')

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
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
