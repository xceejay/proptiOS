// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'

import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'

// ** Custom Components
import FinanceSettlementHistoryTable from './FinanceSettlementHistoryTable'
import FinanceSettlementConfigurationTab from './FinanceSettlementConfigurationTab'
import { CardActionArea, CardActions, CardHeader, Icon } from '@mui/material'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

import { useFinance } from 'src/hooks/useFinance'

const ParentFinanceViewSettlement = ({ setFinanceData, financeData }) => {
  const [settlementData, setSettlementData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [frequency, setFrequency] = useState(financeData?.settlementFrequency || 'daily')
  const [tabValue, setTabValue] = useState('1')
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

  const finance = useFinance()

  useEffect(() => {
    setLoading(true)
    if (finance) {
      finance.getAllSettlementDetails(
        responseData => {
          const { data } = responseData
          if (data?.status === 'NO_RES') {
            console.log('No results found')
          } else if (data?.status === 'FAILED') {
            console.error('Failed:', data.description)
            toast.error(data.description || 'Failed to fetch settlements', { duration: 5000 })
          } else {
            setSettlementData(data)
          }
          setLoading(false)
        },
        error => {
          toast.error(error.response?.data?.description || 'An error occurred', { duration: 5000 })
          setLoading(false)
        }
      )
    }
  }, [])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleFrequencyChange = event => {
    setFrequency(event.target.value)
  }

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true)
  }

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false)
  }

  const handleSaveFrequency = () => {
    // Save settlement frequency logic (e.g., API call)
    console.log('Saving settlement frequency:', frequency)
    setFinanceData(prevData => ({ ...prevData, settlementFrequency: frequency }))
    setOpenConfirmDialog(false)
  }

  const renderPrimaryAccountDetails = (accounts, field) => {
    const primaryAccount = accounts?.find(account => account.primary === 1)
    if (!primaryAccount) return 'NO PRIMARY ACCOUNT'

    if (field === 'type') return primaryAccount.type
    if (field === 'address')
      return primaryAccount.type === 'mobile_money' ? primaryAccount.msisdn : primaryAccount.bank_account_number
    if (field === 'details') {
      return primaryAccount.type === 'mobile_money'
        ? `${primaryAccount.type} (${primaryAccount.mobile_money_provider})`
        : `${primaryAccount.type} : ${primaryAccount.bank_name}`
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <TabContext value={tabValue}>
          <TabList onChange={handleTabChange} variant='fullWidth' aria-label='settlement tabs'>
            <Tab label='Transfer' value='1' />
            <Tab label='History' value='2' />
            <Tab label='Accounts' value='3' />
          </TabList>

          <TabPanel value='1'>
            <Card>
              <CardActions>
                <Button size='small' variant='text' color='primary' onClick={() => setTabValue('3')}>
                  Set Primary Settlement Account
                </Button>
              </CardActions>

              <CardContent>
                <Typography variant='subtitle2' fontSize='13px'>
                  Settle rent payments to your primary account, whether it's a bank account or mobile money wallet,
                  directly from our platform.
                </Typography>

                <Box mt={5} display='flex' flexDirection='column' gap={5}>
                  <Box display='flex' gap={2}>
                    <Typography variant='body1'>Balance:</Typography>
                    <Typography variant='body1' color='primary'>
                      {`${settlementData?.currency || ''} ${settlementData?.balance || 0}`}
                    </Typography>
                  </Box>

                  <Box display='flex' gap={2}>
                    <Typography variant='body1'>Primary Account:</Typography>
                    <Typography variant='body1' textTransform='uppercase' color='primary'>
                      {renderPrimaryAccountDetails(settlementData?.accounts, 'details')}
                    </Typography>
                  </Box>

                  <Box display='flex' gap={2}>
                    <Typography variant='body1'>Primary Account Address:</Typography>
                    <Typography variant='body1' textTransform='uppercase' color='primary'>
                      {renderPrimaryAccountDetails(settlementData?.accounts, 'address')}
                    </Typography>
                  </Box>

                  <Box display='flex' gap={2}>
                    <Typography variant='body1'>Next Settlement Date:</Typography>
                    <Typography variant='body1' color='primary'>
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box display='flex' flexDirection='column' alignItems='center' gap={3}>
                    <Typography variant='h6'>Settlement Frequency</Typography>
                    <TextField
                      select
                      fullWidth
                      label='Settlement Frequency'
                      value={frequency}
                      onChange={handleFrequencyChange}
                    >
                      <MenuItem value='daily'>Daily</MenuItem>
                      <MenuItem value='weekly'>Weekly</MenuItem>
                      <MenuItem value='monthly'>Monthly</MenuItem>
                    </TextField>
                    <Button variant='contained' fullWidth color='primary' onClick={handleOpenConfirmDialog}>
                      Change Frequency
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel value='2'>
            <FinanceSettlementHistoryTable settlementHistoryData={settlementData?.history || []} />
          </TabPanel>

          <TabPanel value='3'>
            <FinanceSettlementConfigurationTab settlementPreferencesData={settlementData?.accounts || []} />
          </TabPanel>
        </TabContext>
      </Grid>

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to set the settlement frequency to {frequency}? By clicking 'Save', you confirm that
            settlements will occur {frequency}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleSaveFrequency} color='primary' variant='contained'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}

export default ParentFinanceViewSettlement
