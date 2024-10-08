// ** React Imports
// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** MUI Imports

// ** Third Party Imports
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import DatePicker from 'react-datepicker'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import CardHeader from '@mui/material/CardHeader'

import InputLabel from '@mui/material/InputLabel'
import CardContent from '@mui/material/CardContent'

import { TextField } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import FinanceTransactionListTable from './FinanceTransactionListTable'
import FinanceStatementsTable from './FinanceStatementsTable'
import { useFinance } from 'src/hooks/useFinance'

const ParentFinanceViewStatements = ({ setFinanceData, financeData }) => {
  const [transactions, setAllTransactions] = useState(null)
  const finance = useFinance()
  const paginationModel = {}
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(addDays(new Date(), 15))
  const [startDateRange, setStartDateRange] = useState(new Date())
  const [endDateRange, setEndDateRange] = useState(addDays(new Date(), 45))

  const handleOnChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const CustomInput = forwardRef((props, ref) => {
    const startDate = format(props.start, 'MM/dd/yyyy')
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return <TextField inputRef={ref} label={props.label || ''} {...props} value={value} />
  })

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    setStartDateRange(start)
    setEndDateRange(end)
  }

  useEffect(() => {
    finance.getAllTransactions(
      { page: paginationModel.page, limit: paginationModel.pageSize },
      responseData => {
        const { data } = responseData

        if (data?.status === 'FAILED') {
          alert(response.message || 'Failed to fetch transactions')
        } else {
          console.log('properties data has been fetched in leases', data)
          setAllTransactions(data)
        }

        setLoading(false) // Stop loading when the request completes
      },
      error => {
        console.error('Properties cannot be retrieved:', error)
        setLoading(false) // Stop loading on error
      }
    )
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <Card> */}
        {/* <CardContent sx={{ mt: 2 }}>
            <TabContext value={value}>
              <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
                <Tab value='1' label='Balance' />
                <Tab value='2' label='History' />
                <Tab value='3' label='Accounts' />
              </TabList>
              <TabPanel value='1'>
                <Typography>
                  Settle rent payments to your primary account, whether it's a bank account or a mobile money wallet,
                  directly from our platform.
                </Typography>
              </TabPanel>
              <TabPanel value='2'>
                <Typography>
                  <FinanceSettlementHistoryTable></FinanceSettlementHistoryTable>
                </Typography>
              </TabPanel>
              <TabPanel value='3'>
                <FinanceSettlementConfigurationTab></FinanceSettlementConfigurationTab>
              </TabPanel>
            </TabContext>
          </CardContent> */}

        {/* <CardHeader title='Search Statements'></CardHeader> */}
        {/*
          <CardContent>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>
                <div>
                  <DatePickerWrapper>
                    <DatePicker
                      selectsRange
                      monthsShown={2}
                      endDate={endDateRange}
                      selected={startDateRange}
                      startDate={startDateRange}
                      shouldCloseOnSelect={false}
                      id='date-range-picker-months'
                      onChange={handleOnChangeRange}
                      customInput={<CustomInput label='Choose date range' end={endDateRange} start={startDateRange} />}
                    />
                  </DatePickerWrapper>
                </div>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}></Box>
            </Box>
          </CardContent>
        </Card> */}

        {/* <Card sx={{ mt: 2 }}> */}
        {/* <CardContent sx={{ mt: 2 }}>
            <TabContext value={value}>
              <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
                <Tab value='1' label='Balance' />
                <Tab value='2' label='History' />
                <Tab value='3' label='Accounts' />
              </TabList>
              <TabPanel value='1'>
                <Typography>
                  Settle rent payments to your primary account, whether it's a bank account or a mobile money wallet,
                  directly from our platform.
                </Typography>
              </TabPanel>
              <TabPanel value='2'>
                <Typography>
                  <FinanceSettlementHistoryTable></FinanceSettlementHistoryTable>
                </Typography>
              </TabPanel>
              <TabPanel value='3'>
                <FinanceSettlementConfigurationTab></FinanceSettlementConfigurationTab>
              </TabPanel>
            </TabContext>
          </CardContent> */}

        {/* <CardContent>
            <FinanceStatementsTable></FinanceStatementsTable>
          </CardContent> */}
        {/* </Card> */}
        <FinanceStatementsTable financeData={transactions}></FinanceStatementsTable>
      </Grid>
    </Grid>
  )
}

export default ParentFinanceViewStatements
