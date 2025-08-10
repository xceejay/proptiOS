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
import { useForm, Controller } from 'react-hook-form'

import TableContainer from '@mui/material/TableContainer'
import FormControlLabel from '@mui/material/FormControlLabel'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import DialogContentText from '@mui/material/DialogContentText'

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
import { Accordion, AccordionDetails, AccordionSummary, Chip, duration, Modal } from '@mui/material'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

const countries = [
  { name: 'Algeria', code: 'DZA' },
  { name: 'Angola', code: 'AGO' },
  { name: 'Benin', code: 'BEN' },
  { name: 'Botswana', code: 'BWA' },
  { name: 'Burkina Faso', code: 'BFA' },
  { name: 'Burundi', code: 'BDI' },
  { name: 'Cabo Verde', code: 'CPV' },
  { name: 'Cameroon', code: 'CMR' },
  { name: 'Central African Republic', code: 'CAF' },
  { name: 'Chad', code: 'TCD' },
  { name: 'Comoros', code: 'COM' },
  { name: 'Democratic Republic of the Congo', code: 'COD' },
  { name: 'Republic of the Congo', code: 'COG' },
  { name: 'Djibouti', code: 'DJI' },
  { name: 'Egypt', code: 'EGY' },
  { name: 'Equatorial Guinea', code: 'GNQ' },
  { name: 'Eritrea', code: 'ERI' },
  { name: 'Eswatini', code: 'SWZ' },
  { name: 'Ethiopia', code: 'ETH' },
  { name: 'Gabon', code: 'GAB' },
  { name: 'Gambia', code: 'GMB' },
  { name: 'Ghana', code: 'GHA' },
  { name: 'Guinea', code: 'GIN' },
  { name: 'Guinea-Bissau', code: 'GNB' },
  { name: 'Ivory Coast', code: 'CIV' },
  { name: 'Kenya', code: 'KEN' },
  { name: 'Lesotho', code: 'LSO' },
  { name: 'Liberia', code: 'LBR' },
  { name: 'Libya', code: 'LBY' },
  { name: 'Madagascar', code: 'MDG' },
  { name: 'Malawi', code: 'MWI' },
  { name: 'Mali', code: 'MLI' },
  { name: 'Mauritania', code: 'MRT' },
  { name: 'Mauritius', code: 'MUS' },
  { name: 'Morocco', code: 'MAR' },
  { name: 'Mozambique', code: 'MOZ' },
  { name: 'Namibia', code: 'NAM' },
  { name: 'Niger', code: 'NER' },
  { name: 'Nigeria', code: 'NGA' },
  { name: 'Rwanda', code: 'RWA' },
  { name: 'Sao Tome and Principe', code: 'STP' },
  { name: 'Senegal', code: 'SEN' },
  { name: 'Seychelles', code: 'SYC' },
  { name: 'Sierra Leone', code: 'SLE' },
  { name: 'Somalia', code: 'SOM' },
  { name: 'South Africa', code: 'ZAF' },
  { name: 'South Sudan', code: 'SSD' },
  { name: 'Sudan', code: 'SDN' },
  { name: 'Tanzania', code: 'TZA' },
  { name: 'Togo', code: 'TGO' },
  { name: 'Tunisia', code: 'TUN' },
  { name: 'Uganda', code: 'UGA' },
  { name: 'Zambia', code: 'ZMB' },
  { name: 'Zimbabwe', code: 'ZWE' }
]

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}))

// ** Styled <sub> component
const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
})

const FinanceSettlementConfigurationTab = ({ settlementPreferencesData }) => {
  const [mobileMoneyAccount, setMobileMoneyAccount] = useState(null)
  const [bankAccount, setBankAccount] = useState(null)

  useEffect(() => {
    if (settlementPreferencesData) {
      settlementPreferencesData.map((account, key) => {
        console.log(account)
        if (account.type === 'bank_account') {
          setBankAccount(account)
        } else if (account.type === 'mobile_money') {
          setMobileMoneyAccount(account)
        }
      })
    }
  }, [])

  // Validation Schemas
  const mobileMoneySchema = yup.object().shape({
    msisdn: yup.string().required('Mobile Money Number is required').min(10, 'Enter a valid number'),
    provider: yup.string().required('Provider is required')
  })

  const bankAccountSchema = yup.object().shape({
    bankName: yup.string().required('Bank Name is required'),
    accountNumber: yup.string().required('Account Number is required'),
    branchCode: yup.string().required('Branch Code is required')
  })

  const [openMobileMoneyDialog, setOpenMobileMoneyDialog] = useState(false)
  const [openBankAccountDialog, setOpenBankAccountDialog] = useState(false)

  const [primaryAccount, setPrimaryAccount] = useState('bank_account')

  const handleToggleDefaultAccountMobileMoney = event => {
    if (event.target.checked) {
      setPrimaryAccount('mobile_money')
    } else {
      setPrimaryAccount('')
    }
  }
  const handleToggleDefaultAccountBankAccount = event => {
    if (event.target.checked) {
      setPrimaryAccount('bank_account')
    } else {
      setPrimaryAccount('')
    }
  }
  // Mobile Money Form
  const {
    control: mobileMoneyControl,
    handleSubmit: handleMobileMoneySubmit,
    formState: { errors: mobileMoneyErrors }
  } = useForm({
    resolver: yupResolver(mobileMoneySchema),
    mode: 'onBlur'
  })

  // Bank Account Form
  const {
    control: bankAccountControl,
    handleSubmit: handleBankAccountSubmit,
    formState: { errors: bankAccountErrors }
  } = useForm({
    resolver: yupResolver(bankAccountSchema),
    mode: 'onBlur'
  })

  const handleMobileMoneyDialogOpen = () => {
    setOpenMobileMoneyDialog(true)
  }

  const handleMobileMoneyDialogClose = () => {
    setOpenMobileMoneyDialog(false)
  }

  const handleBankAccountDialogOpen = () => {
    setOpenBankAccountDialog(true)
  }

  const handleBankAccountDialogClose = () => {
    setOpenBankAccountDialog(false)
  }

  const handleMobileMoneyFormSubmit = data => {
    console.log('Mobile Money Account Submitted:', data)
    setOpenMobileMoneyDialog(false)
  }

  const handleBankAccountFormSubmit = data => {
    console.log('Bank Account Submitted:', data)
    setOpenBankAccountDialog(false)
  }

  const handleDelete = () => {
    setPrimaryAccount('')

    return (
      <>
        <Dialog open={true}>
          {' '}
          <DialogContent> Nice one</DialogContent>
        </Dialog>
      </>
    )
    console.log('delete')
  }

  const row = { status: 'active' }
  const statusLabel = row.status === 'active' ? 'Active' : 'Inactive'
  const statusColor = row.status === 'active' ? 'success' : 'secondary'
  const primary_account = true
  const primaryAccountLabel = primary_account ? 'primary' : ''
  const primaryAccountColor = primary_account ? 'primary' : 'secondary'
  const handleChangeDefault = () => {
    setPrimaryAccount(primaryAccount === 'mobile_money' ? 'bank_account' : 'mobile_money')

    toast.success('Primary Settlement Account has been changed!')
  }
  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', ml: 5, mr: 5 }}>
          <Box>
            <Typography variant='h5'>Settlement Accounts</Typography>
          </Box>
          <Box>
            {bankAccount && mobileMoneyAccount && (
              <Button onClick={handleChangeDefault} variant='outlined' size='small'>
                Switch Default
              </Button>
            )}
          </Box>
        </Box>
        <Card
          sx={{
            boxShadow: 'none !important',
            background: 'none',
            mt: 5
          }}
        >
          {/* <CardHeader
            title='Settlement Accounts'
            action={
              <Button size='small' variant='contained' onClick={handleAddCardClickOpen} sx={{ '& svg': { mr: 1 } }}>
                <Icon icon='tabler:plus' fontSize='1rem' />
                Add Account
              </Button>
            }
          /> */}

          {/* <CardHeader title='Settlement Accounts' /> */}
          <CardContent sx={{ display: 'flex', flexDirection: 'column', padding: '0', gap: 2 }}>
            <Box>
              <Card>
                <CardHeader
                  title='Mobile Money Wallet'
                  action={
                    <Button
                      size='small'
                      variant='contained'
                      onClick={handleMobileMoneyDialogOpen}
                      sx={{ '& svg': { mr: 1 } }}
                    >
                      <Icon icon='tabler:wallet' fontSize='1rem' />
                      Manage
                    </Button>
                  }
                />

                {mobileMoneyAccount ? (
                  <>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                      <Box display={'flex'} flexDirection={'column'} gap={1}>
                        <Box display={'flex'} flexDirection={'row'}>
                          <Typography variant='button' color={'primary'}>
                            {mobileMoneyAccount.msisdn}
                          </Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'row'}>
                          {/* {alert(JSON.stringify(mobileMoneyAccount))} */}
                          <Typography textTransform={'uppercase'}>
                            {mobileMoneyAccount.mobile_money_provider}
                          </Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'row'}>
                          <Typography textTransform={'uppercase'} color={'secondary'}>
                            {countries.map((country, key) => {
                              if (country.code === mobileMoneyAccount.country) {
                                return country.name
                              }
                            })}
                          </Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'row'}>
                          <CustomChip
                            label={mobileMoneyAccount.status}
                            color={statusColor}
                            rounded
                            size='small'
                            skin='light'
                            // deleteIcon={<Icon icon' />}
                            sx={{ textTransform: 'uppercase' }}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        {primaryAccount == 'mobile_money' ? (
                          <>
                            <CustomChip
                              label={mobileMoneyAccount.status}
                              color={primaryAccountColor}
                              rounded
                              size='small'
                              skin='light'
                              onDelete={handleDelete}
                              // deleteIcon={<Icon icon='tabler:trash' />}
                              sx={{ textTransform: 'uppercase', ml: 2 }}
                            />
                          </>
                        ) : (
                          <></>
                        )}
                      </Box>
                    </CardContent>
                  </>
                ) : (
                  <>
                    <CardContent>
                      <Typography>No Account has been configured</Typography>
                    </CardContent>
                  </>
                )}
              </Card>
            </Box>
            <Box>
              <Card>
                <CardHeader
                  title={'Bank Account'}
                  action={
                    <Button
                      size='small'
                      variant='contained'
                      onClick={handleBankAccountDialogOpen}
                      sx={{ '& svg': { mr: 1 } }}
                    >
                      <Icon icon='tabler:wallet' fontSize='1rem' />
                      Manage
                    </Button>
                  }
                />
                {bankAccount ? (
                  <>
                    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                      <Box display={'flex'} flexDirection={'column'} gap={1}>
                        <Box display={'flex'} flexDirection={'row'}>
                          <Typography variant='button' color={'primary'}>
                            {/* {alert(JSON.stringify(bankAccount))} */}
                            {bankAccount.bank_account_number}
                          </Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'row'}>
                          <Typography textTransform={'uppercase'}>{bankAccount.bank_name}</Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'row'}>
                          <Typography textTransform={'uppercase'} color={'secondary'}>
                            {bankAccount.holder_name}
                          </Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'row'}>
                          <Typography textTransform={'uppercase'} color={'secondary'}>
                            {bankAccount.bank_account_swift_code}
                          </Typography>
                        </Box>
                        <Box display={'flex'} flexDirection={'row'}>
                          <Typography textTransform={'uppercase'} color={'secondary'}>
                            {countries.map((country, key) => {
                              if (country.code === mobileMoneyAccount.country) {
                                return country.name
                              }
                            })}
                          </Typography>
                        </Box>
                        {/* <Box display={'flex'} flexDirection={'row'}>
                          <Typography textTransform={'uppercase'} color={'secondary'}>
                            {bankAccount.uuid}
                          </Typography>
                        </Box> */}
                        <Box display={'flex'} flexDirection={'row'}>
                          <CustomChip
                            label={statusLabel}
                            color={statusColor}
                            rounded
                            size='small'
                            skin='light'
                            // deleteIcon={<Icon icon' />}
                            sx={{ textTransform: 'uppercase' }}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        {primaryAccount == 'bank_account' ? (
                          <>
                            <CustomChip
                              label={primaryAccountLabel}
                              color={primaryAccountColor}
                              rounded
                              size='small'
                              skin='light'
                              onDelete={handleDelete}
                              // deleteIcon={<Icon icon='tabler:trash' />}
                              sx={{ textTransform: 'uppercase', ml: 2 }}
                            />
                          </>
                        ) : (
                          <></>
                        )}
                      </Box>
                    </CardContent>
                  </>
                ) : (
                  <>
                    <CardContent>
                      <Typography>No Account has been configured</Typography>
                    </CardContent>
                  </>
                )}
              </Card>
            </Box>
          </CardContent>
          {/* Mobile Money Dialog */}
          <Dialog open={openMobileMoneyDialog} onClose={handleMobileMoneyDialogClose}>
            <DialogTitle>Add Mobile Money Account</DialogTitle>
            <DialogContent>
              <form onSubmit={handleMobileMoneySubmit(handleMobileMoneyFormSubmit)} noValidate>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='msisdn'
                    control={mobileMoneyControl}
                    render={({ field }) => (
                      <TextField
                        required
                        label='Mobile Money Number'
                        {...field}
                        error={Boolean(mobileMoneyErrors.msisdn)}
                        helperText={mobileMoneyErrors.msisdn?.message}
                      />
                    )}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='provider'
                    control={mobileMoneyControl}
                    render={({ field }) => (
                      <TextField
                        required
                        label='Provider'
                        {...field}
                        error={Boolean(mobileMoneyErrors.provider)}
                        helperText={mobileMoneyErrors.provider?.message}
                      />
                    )}
                  />
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={primaryAccount == 'mobile_money'}
                      onChange={handleToggleDefaultAccountMobileMoney}
                    />
                  }
                  label='Set as Primary Account'
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleMobileMoneyDialogClose}>Cancel</Button>
              <Button onClick={handleMobileMoneySubmit(handleMobileMoneyFormSubmit)} variant='contained'>
                Submit
              </Button>
            </DialogActions>
          </Dialog>

          {/* Bank Account Dialog */}
          <Dialog open={openBankAccountDialog} onClose={handleBankAccountDialogClose}>
            <DialogTitle>Add Bank Account</DialogTitle>
            <DialogContent>
              <form onSubmit={handleBankAccountSubmit(handleBankAccountFormSubmit)} noValidate>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='bankName'
                    control={bankAccountControl}
                    render={({ field }) => (
                      <TextField
                        required
                        label='Bank Name'
                        {...field}
                        error={Boolean(bankAccountErrors.bankName)}
                        helperText={bankAccountErrors.bankName?.message}
                      />
                    )}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='accountNumber'
                    control={bankAccountControl}
                    render={({ field }) => (
                      <TextField
                        required
                        label='Account Number'
                        {...field}
                        error={Boolean(bankAccountErrors.accountNumber)}
                        helperText={bankAccountErrors.accountNumber?.message}
                      />
                    )}
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='branchCode'
                    control={bankAccountControl}
                    render={({ field }) => (
                      <TextField
                        required
                        label='Branch Code'
                        {...field}
                        error={Boolean(bankAccountErrors.branchCode)}
                        helperText={bankAccountErrors.branchCode?.message}
                      />
                    )}
                  />
                </FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={primaryAccount == 'bank_account'}
                      onChange={handleToggleDefaultAccountBankAccount}
                    />
                  }
                  label='Set as Primary Account'
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleBankAccountDialogClose}>Cancel</Button>
              <Button onClick={handleBankAccountSubmit(handleBankAccountFormSubmit)} variant='contained'>
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Grid>
    </Grid>
  )
}

export default FinanceSettlementConfigurationTab
