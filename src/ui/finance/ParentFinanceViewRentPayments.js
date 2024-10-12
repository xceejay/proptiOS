// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports

import Grid from '@mui/material/Grid'

import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

import FinanceRentTransactionListTable from './FinanceRentTransactionListTable'
import { useFinance } from 'src/hooks/useFinance'

const ParentFinanceViewRentPayments = ({ setFinanceData, financeData }) => {
  // ** States
  const [value, setValue] = useState('1')
  const [loading, setLoading] = useState(false)
  const [rentTransactions, setRentTransactions] = useState(false)

  const finance = useFinance()

  const Tab = styled(MuiTab)(({ theme }) => ({
    flexDirection: 'row',
    '& svg': {
      marginBottom: '0 !important',
      marginRight: theme.spacing(1.5)
    }
  }))

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const paginationModel = {}

  useEffect(() => {
    finance.getAllRentTransactions(
      { page: paginationModel.page, limit: paginationModel.pageSize },
      responseData => {
        const { data } = responseData

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
          alert(response.message || 'Failed to fetch transactions')
        } else {
          console.log('properties data has been fetched in leases', data)
          setRentTransactions(data)
        }

        setLoading(false) // Stop loading when the request completes
      },
      error => {
        toast.error(error.response.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
        setLoading(false) // Stop loading on error
      }
    )
  }, [])

  return (
    <Grid container>
      <Grid item xs={12}>
        <TabContext value={value}>
          <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
            <Tab value='1' label='History' />
            <Tab value='2' label='Reminders' disabled />
            {/* <Tab value='3' label='Settlement Accounts' /> */}
          </TabList>

          <TabPanel sx={{ mt: 5, padding: 0 }} value='1'>
            <FinanceRentTransactionListTable
              rentTransactions={rentTransactions.transactions}
            ></FinanceRentTransactionListTable>
          </TabPanel>
          <TabPanel sx={{ mt: 5, padding: 0 }} value='2'></TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default ParentFinanceViewRentPayments
