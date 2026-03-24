// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import toast from 'react-hot-toast'


// ** Icon Imports

// ** Third Party Imports

// ** Custom Components

// ** Util Import

// ** Styled Component Imports

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import FinanceExpensesTable from './FinanceExpensesTable'
import { useFinance } from 'src/hooks/useFinance'

const ParentFinanceViewExpenses = ({ setFinanceData, financeData }) => {
  const [expensesData, setExpensesData] = useState(financeData)
  const [errorMessage, setErrorMessage] = useState('')
  const finance = useFinance()

  useEffect(() => {
    if (financeData?.transactions?.expenses) {
      setExpensesData(financeData)
    }
  }, [financeData])

  useEffect(() => {
    finance.getAllTransactions(
      { page: 0, limit: 50 },
      responseData => {
        const { data } = responseData

        if (data?.status === 'FAILED') {
          setErrorMessage(data.message || 'Failed to fetch expenses')

          return
        }

        setErrorMessage('')
        setExpensesData(data)
      },
      error => {
        const nextErrorMessage =
          error.response?.data?.description || 'An error occurred. Please try again or contact support.'
        setErrorMessage(nextErrorMessage)
        toast.error(nextErrorMessage, {
          duration: 5000
        })
      }
    )
  }, [finance])

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <FinanceExpensesTable financeData={expensesData} errorMessage={errorMessage}></FinanceExpensesTable>

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
