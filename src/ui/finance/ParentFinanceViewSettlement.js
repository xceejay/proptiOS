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
import { useFinance } from 'src/hooks/useFinance'

const ParentFinanceViewSettlement = ({ setFinanceData, financeData }) => {
  const [settlementData, setSettlementData] = useState(null)

  const finance = useFinance()

  // State for settlement frequency selection
  const [frequency, setFrequency] = useState(financeData?.settlementFrequency || 'daily')
  const [value, setValue] = useState('1')

  // State for confirmation dialog
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  // Function to handle frequency change
  const handleFrequencyChange = event => {
    setFrequency(event.target.value)
  }

  // Function to open the confirmation dialog
  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true)
  }

  // Function to close the confirmation dialog
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false)
  }

  // Function to save the scheduled settlement frequency
  const handleSaveFrequency = () => {
    // Logic to save the scheduled settlement frequency (e.g., API call to backend)
    console.log('Saving settlement frequency:', frequency)
    // Update the state with the new frequency
    setFinanceData(prevData => ({ ...prevData, settlementFrequency: frequency }))
    // Close the dialog after saving
    setOpenConfirmDialog(false)
  }

  useEffect(() => {
    finance.getAllSettlementDetails(
      responseData => {
        console.log('Response Data:', responseData) // Check response structure

        const { data } = responseData

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
          console.log('failed', data.description)
          alert(response.message || 'Failed to fetch settlements')
        } else {
          console.log('saving settlement Data')

          setSettlementData(data)
        }

        setLoading(false) // Stop loading when the request completes
      },
      error => {
        console.error('Settlement details cannot be retrieved:', error)
        setLoading(false) // Stop loading on error
      }
    )
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TabContext value={value}>
          <TabList variant='fullWidth' onChange={handleChange} aria-label='full width tabs example'>
            <Tab value='1' label='Transfer' />
            <Tab value='2' label='History' />
            <Tab value='3' label='Accounts' />
          </TabList>

          <TabPanel sx={{ padding: 0, mt: 5 }} value='1'>
            <Card>
              <CardActions>
                {' '}
                <Button
                  size='small'
                  endIcon={<Icon icon='tabler:upload' />}
                  variant='text'
                  color={'primary'}
                  onClick={() => setValue('3')}
                >
                  Set Primary Settlement Account
                </Button>
              </CardActions>

              <CardContent>
                <Typography fontSize={'13px'} variant='subtitle2'>
                  Settle rent payments to your primary account, whether it's a bank account or a mobile money wallet,
                  directly from our platform.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', mt: 5, gap: 5 }}>
                  <Box display={'flex'} gap={2}>
                    <Typography variant='body1'>Balance: </Typography>
                    <Typography color={'primary'} variant='body1'>
                      {'$' + '20'}
                    </Typography>
                  </Box>
                  <Box display={'flex'} gap={2}>
                    <Typography variant='body1'>Primary Account: </Typography>
                    <Typography textTransform={'uppercase'} color={'primary'} variant='body1'>
                      {'Fidelity Bank'}
                    </Typography>
                  </Box>

                  <Box display={'flex'} gap={2}>
                    <Typography variant='body1'>Primary Account Address: </Typography>
                    <Typography textTransform={'uppercase'} color={'primary'} variant='body1'>
                      {'32208028430823048'}
                    </Typography>
                  </Box>
                  <Box display={'flex'} gap={2}>
                    <Typography variant='body1'>Account Type: </Typography>
                    <Typography color={'primary'} variant='body1'>
                      {'BANK'}
                    </Typography>
                  </Box>

                  <Box display={'flex'} gap={2}>
                    <Typography variant='body1'>Next Settlement Date: </Typography>
                    <Typography color={'primary'} variant='body1'>
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Typography sx={{ alignItems: 'center' }} variant='h6'>
                      Settlement Frequency
                    </Typography>
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
                    <Button
                      sx={{ width: '100%' }}
                      variant='contained'
                      color='primary'
                      onClick={handleOpenConfirmDialog}
                    >
                      Change Frequency
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </TabPanel>

          <TabPanel sx={{ mt: 5, padding: 0 }} value='2'>
            <FinanceSettlementHistoryTable />
          </TabPanel>
          <TabPanel sx={{ mt: 5, padding: 0 }} value='3'>
            <FinanceSettlementConfigurationTab />
          </TabPanel>
        </TabContext>
      </Grid>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby='confirm-dialog-title'
        aria-describedby='confirm-dialog-description'
      >
        <DialogTitle id='confirm-dialog-title'>Confirm Save</DialogTitle>
        <DialogContent>
          <DialogContentText id='confirm-dialog-description'>
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
