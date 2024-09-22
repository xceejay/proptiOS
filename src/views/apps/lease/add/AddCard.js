// ** React Imports
import { useState, forwardRef, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import TableRow from '@mui/material/TableRow'
import Collapse from '@mui/material/Collapse'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'
import { styled, alpha, useTheme } from '@mui/material/styles'
import Select from '@mui/material/Select'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import MenuItem from '@mui/material/MenuItem'
import TableCell from '@mui/material/TableCell'
import CardContent from '@mui/material/CardContent'
import { useForm, Controller } from 'react-hook-form'
import Autocomplete from '@mui/material/Autocomplete'
// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Custom Component Imports
import Repeater from 'src/@core/components/repeater'
import Editor from 'src/views/editor/Editor'
import CustomLeaseEditor from 'src/views/editor/CustomLeaseEditor'
import { FormControl } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import { fontWeight } from '@mui/system'
import SignatureCanvas from './SignatureCanvas'

const currencies = [
  { code: 'USD', name: 'United States Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound Sterling', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: '$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: '$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'AED', name: 'United Arab Emirates Dirham', symbol: 'د.إ' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.' }
]

const CustomInput = forwardRef(({ ...props }, ref) => {
  return <TextField size='small' inputRef={ref} sx={{ width: { sm: '250px', xs: '170px' } }} {...props} />
})

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  '&:not(:last-child)': {
    paddingRight: `${theme.spacing(2)} !important`
  }
}))

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const CalcWrapperNew = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))
const RepeatingContent = styled(Grid)(({ theme }) => ({
  paddingRight: 0,
  display: 'flex',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  '& .col-title': {
    top: '-2.25rem',
    position: 'absolute'
  },
  [theme.breakpoints.down('md')]: {
    '& .col-title': {
      top: '0',
      position: 'relative'
    }
  }
}))

const CustomAutocomplete = styled(Autocomplete)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'transparent' // Hide the border when not focused
    },
    '&:hover fieldset': {
      borderColor: 'transparent' // Keep border hidden on hover
    },
    '&.Mui-focused fieldset': {
      borderColor: 'blue' // Show the border when focused
    }
  },
  '& .MuiInputLabel-root': {
    display: 'none' // Hide the label by default
  },
  '&:hover .MuiInputLabel-root': {
    display: 'block', // Show the label on hover
    color: '#000' // Optional: Add a color for the label when hovered
  },
  '& .Mui-focused .MuiInputLabel-root': {
    display: 'block', // Show the label when focused
    color: '#000' // Optional: Add a color for the label when focused
  },
  '& .MuiInputBase-input': {
    opacity: 1, // Always show the input text\
    // fontStyle: 'italic'
    fontWeight: 'bold'
  },
  '& .MuiAutocomplete-endAdornment': {
    display: 'none' // Hide the dropdown icon when not focused
  },
  '& .Mui-focused .MuiAutocomplete-endAdornment': {
    display: 'flex' // Show the dropdown icon when focused
  }
})

const RepeaterWrapper = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(16, 10, 10),
  '& .repeater-wrapper + .repeater-wrapper': {
    marginTop: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    paddingTop: theme.spacing(10)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(6)
  }
}))

const InvoiceAction = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  padding: theme.spacing(2, 1),
  borderLeft: `1px solid ${theme.palette.divider}`
}))

const CustomSelectItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.success.main,
  backgroundColor: 'transparent !important',
  '&:hover': {
    color: `${theme.palette.success.main} !important`,
    backgroundColor: `${alpha(theme.palette.success.main, 0.1)} !important`
  },
  '&.Mui-focusVisible': {
    backgroundColor: `${alpha(theme.palette.success.main, 0.2)} !important`
  },
  '&.Mui-selected': {
    color: `${theme.palette.success.contrastText} !important`,
    backgroundColor: `${theme.palette.success.main} !important`,
    '&.Mui-focusVisible': {
      backgroundColor: `${theme.palette.success.dark} !important`
    }
  }
}))
const now = new Date()
const tomorrowDate = now.setDate(now.getDate() + 7)

const tenancyAgreementContent = `
<h1 style="text-align: center; text-decoration: underline;">{{title}}</h1>
<p style="text-align: center;">(the “Agreement”)</p>
<p style="text-align: center;">Made and entered into this [DATE]</p>

<p><strong>BETWEEN</strong> <span style="border-bottom: 1px solid #000;"><b>{{landlord_name}}</b></span> (hereinafter called the “Landlord”)</p>
<p><strong>AND</strong> <span style="border-bottom: 1px solid #000;"><b>{{tenant_name}}</b></span> (hereinafter called the “Tenant”) of the other part.</p>

<h2>WHEREAS:</h2>
<ul>
  <li>The Landlord is the legal and beneficial owner of the furnished/unfurnished property known as <span style="border-bottom: 1px solid #000;"><b>{{property_name}}</b></span>, located at <span style="border-bottom: 1px solid #000;"><b>{{unit_name}}</b></span> (hereinafter called the “Property”).</li>
  <li>The Tenant requires suitable accommodation and has requested the Landlord to let the Property along with standard appliances and amenities therein (together called the “Premises”).</li>
  <li>The Landlord has agreed to let the Premises to the Tenant on the terms set out in this Agreement.</li>
</ul>

<h2>NOW IT IS HEREBY AGREED AS FOLLOWS:</h2>
<ul>
  <li>This Agreement shall commence on <span style="border-bottom: 1px solid #000;"><b>{{lease_start_date}}</b></span> and shall expire on <span style="border-bottom: 1px solid #000;"><b>{{lease_end_date}}</b></span> (the "Term").</li>

  <li>The Tenant agrees to pay in advance a total rent of <span style="border-bottom: 1px solid #000;"><b>{{currency}} {{rent_amount}}</b></span>, payable {{payment_frequency}}.</li>

  <li>A refundable security deposit of <span style="border-bottom: 1px solid #000;"><b>{{currency}} [SECURITY_DEPOSIT]</b></span> shall be paid upon signing this Agreement. This deposit will be returned within <span style="border-bottom: 1px solid #000;"><b>[REFUND_DAYS]</b></span> days after the Tenant vacates the Premises, subject to any deductions for damage or unpaid rent.</li>

  <li>All rents are to be paid in the local currency equivalent ({{currency}}) based on the prevailing interbank rate at the time of payment, unless otherwise agreed upon in writing.</li>

  <li>Rent does/does not include services such as DSTV, internet subscriptions, cleaning, and utilities, unless otherwise agreed in writing.</li>

  <li>Should the Tenant remain in the Premises after the expiration of the Term without a formal extension, the Tenant will be charged a daily rate of <span style="border-bottom: 1px solid #000;"><b>{{currency}} [DAILY_RATE]</b></span>.</li>

  <li>The security deposit may be used to cover any damages or repairs to the Property, beyond ordinary wear and tear, caused by the Tenant or guests during their stay.</li>

  <li>The Landlord shall refund the security deposit, less any deductions, via cheque, bank transfer, or other agreed methods within <span style="border-bottom: 1px solid #000;"><b>[REFUND_DAYS]</b></span> days of the Tenant vacating the Property.</li>

  <li>This Agreement may be renewed for a further term, subject to mutual agreement in writing, with a prior notice period of no less than 14 days before the end of the current Term.</li>

  <li>The Landlord may terminate this Agreement if the Tenant breaches any term of this Agreement, violates house rules, or engages in activities that jeopardize the security or privacy of other occupants.</li>

  <li>The Tenant agrees to comply with the attached House Rules, which form part of this Agreement.</li>
</ul>

<h2>MISCELLANEOUS:</h2>
<ul>
  <li>All notices under this Agreement shall be in writing and delivered to the respective addresses of the parties, or sent via email to addresses confirmed by both parties.</li>

  <li>The Landlord agrees to maintain the Property in good condition and to make necessary repairs as required by law.</li>

  <li>The Tenant shall not sublet or assign the Property without the prior written consent of the Landlord.</li>

  <li>If any provision of this Agreement is found to be invalid or unenforceable by a court of law, the remaining provisions shall continue to be fully effective.</li>

  <li>This Agreement shall be governed by the laws of [Jurisdiction], and any disputes shall be resolved in the courts of that jurisdiction.</li>
</ul>

<h2>IN WITNESS WHEREOF</h2>
<p>The parties hereto have executed this Agreement on the day and year first above written.</p>

<div>
  <p>READ, ACCEPTED, AND SIGNED BY THE LANDLORD AND TENANT:</p>
</div>`
const AddCard = props => {
  const defaultValues = {
    // country: countries.[]
  }

  const schema = yup.object().shape({
    // email: yup.string().email().required()
  })

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // ** Props
  const { clients, invoiceNumber, selectedClient, setSelectedClient, toggleAddCustomerDrawer } = props

  const allTenantsData = [{ name: 'Tenant 1', email: 'joel@gmail.com', id: 1 }]
  // ** States
  const [count, setCount] = useState(1)
  const [selected, setSelected] = useState('')
  const [issueDate, setIssueDate] = useState(new Date())
  const [tenant, setTenant] = useState(null)
  const [landlord, setLandlord] = useState(null)
  const [leaseTitle, setLeaseTitle] = useState('Lease Agreement')

  const [currency, setCurrency] = useState('USD') // Default to USD
  const [rentAmount, setRentAmount] = useState(1000) // Default to 1000
  const [paymentFrequency, setPaymentFrequency] = useState('monthly') // Default to monthly
  const [dueDate, setDueDate] = useState(new Date(tomorrowDate))
  const [leaseStartDate, setLeaseStartDate] = useState(null)
  const [leaseEndDate, setLeaseEndDate] = useState(null)

  const [formVariables, setFormVariables] = useState({
    landlord: {},
    tenant: {},
    currency: '',
    rent_amount: '',
    payment_frequency: '',
    lease_start_date: '',
    lease_end_date: '',
    title: '',
    unit_name: '',
    property_name: ''
  })

  const [landlordSignature, setLandlordSignature] = useState('')
  const [tenantSignature, setTenantSignature] = useState('')

  const handleLandlordSignature = signature => {
    setLandlordSignature(signature)
  }

  const handleTenantSignature = signature => {
    setTenantSignature(signature)
  }

  const [paymentFrequencyValue, setStatusValue] = useState('monthly')
  const [paymentFrequencies, setPaymentFrequencies] = useState([
    { text: 'Bi-Yearly', value: 'bi-yearly' },
    { text: 'Yearly', value: 'yearly' },
    { text: 'Quarterly', value: 'quarterly' },
    { text: 'Monthly', value: 'monthly' }
  ])

  const [siteId, setSiteId] = useState(null)
  const [siteUser, setSiteUser] = useState([])
  const handlePaymentFrequencyValue = event => {
    setStatusValue(event.target.value)
  }

  // ** Hook
  const theme = useTheme()
  const auth = useAuth()

  useEffect(() => {
    setSiteId(auth.user.site_id)
    setSiteUser([auth.user])
  }, [auth])

  useEffect(() => {
    console.log('Select Changed!')
    console.log(formVariables)

    setFormVariables({
      landlord: landlord || '',
      tenant: tenant || '',
      currency: currency || '',
      rent_amount: rentAmount || '',
      payment_frequency: paymentFrequency || '',
      lease_start_date: leaseStartDate || '',
      lease_end_date: leaseEndDate || '',
      title: leaseTitle || '',
      unit_name: '',
      property_name: ''
    })
  }, [currency, rentAmount, paymentFrequency, tenant, landlord, leaseTitle, leaseStartDate, leaseEndDate])
  // ** Deletes form
  const deleteForm = e => {
    e.preventDefault()

    // @ts-ignore
    e.target.closest('.repeater-wrapper').remove()
  }

  // ** Handle Invoice To Change
  const handleInvoiceChange = event => {
    setSelected(event.target.value)
    if (clients !== undefined) {
      setSelectedClient(clients.filter(i => i.name === event.target.value)[0])
    }
  }

  const handleAddNewCustomer = () => {
    toggleAddCustomerDrawer()
  }

  return (
    <Card>
      <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
        <Grid container>
          <Grid item xl={6} xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xl: 'flex-start', xs: 'flex-start' } }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Typography variant='h6' sx={{ mr: 2, width: '105px' }}>
                  Lease title
                </Typography>
                {/* <TextField
                  size='small'
                  value={invoiceNumber}
                  sx={{ width: { sm: '250px', xs: '170px' } }}
                  InputProps={{
                    disabled: true,
                    startAdornment: <InputAdornment position='start'>#</InputAdornment>
                  }}
                /> */}

                <TextField
                  size='small'
                  sx={{ width: { sm: '250px', xs: '170px' } }}
                  defaultValue='Embassy Heights 1 Bedroom Lease Agreement'
                  value={leaseTitle}
                  onChange={event => setLeaseTitle(event.target.value)}
                />
              </Box>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 3, width: '100px', color: 'text.secondary' }}>Date Issued:</Typography>
                <DatePicker
                  id='issue-date'
                  selected={issueDate}
                  customInput={<CustomInput />}
                  onChange={date => setIssueDate(date)}
                />
              </Box>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 3, width: '100px', color: 'text.secondary' }}>Date Due:</Typography>
                <DatePicker
                  id='due-date'
                  selected={dueDate}
                  customInput={<CustomInput />}
                  onChange={date => setDueDate(date)}
                />
              </Box>

              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 3, width: '100px', color: 'text.secondary' }}>Property:</Typography>
                <FormControl>
                  <Controller
                    render={({ onChange, ...props }) => (
                      <Autocomplete
                        size='small'
                        value={tenant}
                        onChange={(event, newValue) => {
                          setTenant(newValue)
                        }}
                        options={allTenantsData ? allTenantsData : []}
                        getOptionLabel={tenant => tenant.name + ','} // Display the tenant name
                        // getOptionDisabled={tenant => !!tenant.property?.id}
                        sx={{ minWidth: 150 }}
                        renderInput={params => (
                          <TextField sx={{ width: { sm: '250px', xs: '170px' } }} {...params} label='Select Property' />
                        )}
                      />
                    )}
                    onChange={([, data]) => data}
                    defaultValue={''}
                    name={name}
                    control={control}
                  />
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 3, width: '100px', color: 'text.secondary' }}>Unit:</Typography>
                <FormControl>
                  <Controller
                    render={({ onChange, ...props }) => (
                      <Autocomplete
                        size='small'
                        value={tenant}
                        onChange={(event, newValue) => {
                          setTenant(newValue)
                        }}
                        options={allTenantsData ? allTenantsData : []}
                        getOptionLabel={tenant => tenant.name + ','} // Display the tenant name
                        // getOptionDisabled={tenant => !!tenant.property?.id}
                        sx={{ minWidth: 150 }}
                        renderInput={params => (
                          <TextField sx={{ width: { sm: '250px', xs: '170px' } }} {...params} label='Select Unit' />
                        )}
                      />
                    )}
                    onChange={([, data]) => data}
                    defaultValue={''}
                    name={name}
                    control={control}
                  />
                </FormControl>
              </Box>
            </Box>
          </Grid>
          <Grid item xl={6} xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xl: 'flex-end', xs: 'flex-start' } }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Typography variant='h6' sx={{ mr: 2, width: '105px' }}>
                  Lease title
                </Typography>
                {/* <TextField
                  size='small'
                  value={invoiceNumber}
                  sx={{ width: { sm: '250px', xs: '170px' } }}
                  InputProps={{
                    disabled: true,
                    startAdornment: <InputAdornment position='start'>#</InputAdornment>
                  }}
                /> */}

                <TextField
                  size='small'
                  sx={{ width: { sm: '250px', xs: '170px' } }}
                  defaultValue='Embassy Heights 1 Bedroom Lease Agreement'
                  value={leaseTitle}
                  onChange={event => setLeaseTitle(event.target.value)}
                />
              </Box>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 3, width: '100px', color: 'text.secondary' }}>Date Issued:</Typography>
                <DatePicker
                  id='issue-date'
                  selected={issueDate}
                  customInput={<CustomInput />}
                  onChange={date => setIssueDate(date)}
                />
              </Box>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 3, width: '100px', color: 'text.secondary' }}>Date Due:</Typography>
                <DatePicker
                  id='due-date'
                  selected={dueDate}
                  customInput={<CustomInput />}
                  onChange={date => setDueDate(date)}
                />
              </Box>

              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 3, width: '100px', color: 'text.secondary' }}>Property:</Typography>
                <FormControl>
                  <Controller
                    render={({ onChange, ...props }) => (
                      <Autocomplete
                        size='small'
                        value={tenant}
                        onChange={(event, newValue) => {
                          setTenant(newValue)
                        }}
                        options={allTenantsData ? allTenantsData : []}
                        getOptionLabel={tenant => tenant.name + ','} // Display the tenant name
                        // getOptionDisabled={tenant => !!tenant.property?.id}
                        sx={{ minWidth: 150 }}
                        renderInput={params => (
                          <TextField sx={{ width: { sm: '250px', xs: '170px' } }} {...params} label='Select Property' />
                        )}
                      />
                    )}
                    onChange={([, data]) => data}
                    defaultValue={''}
                    name={name}
                    control={control}
                  />
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ mr: 3, width: '100px', color: 'text.secondary' }}>Unit:</Typography>
                <FormControl>
                  <Controller
                    render={({ onChange, ...props }) => (
                      <Autocomplete
                        size='small'
                        value={tenant}
                        onChange={(event, newValue) => {
                          setTenant(newValue)
                        }}
                        options={allTenantsData ? allTenantsData : []}
                        getOptionLabel={tenant => tenant.name + ','} // Display the tenant name
                        // getOptionDisabled={tenant => !!tenant.property?.id}
                        sx={{ minWidth: 150 }}
                        renderInput={params => (
                          <TextField sx={{ width: { sm: '250px', xs: '170px' } }} {...params} label='Select Unit' />
                        )}
                      />
                    )}
                    onChange={([, data]) => data}
                    defaultValue={''}
                    name={name}
                    control={control}
                  />
                </FormControl>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 10 }}></Divider>

        <Grid sx={{ mt: 10 }} container>
          <Grid container>
            <Grid item xl={6} xs={12} sx={{ mb: { xl: 0, xs: 4 } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                  <svg width={34} height={23.375} viewBox='0 0 32 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      fill={theme.palette.primary.main}
                      d='M0.00172773 0V6.85398C0.00172773 6.85398 -0.133178 9.01207 1.98092 10.8388L13.6912 21.9964L19.7809 21.9181L18.8042 9.88248L16.4951 7.17289L9.23799 0H0.00172773Z'
                    />
                    <path
                      fill='#161616'
                      opacity={0.06}
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M7.69824 16.4364L12.5199 3.23696L16.5541 7.25596L7.69824 16.4364Z'
                    />
                    <path
                      fill='#161616'
                      opacity={0.06}
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M8.07751 15.9175L13.9419 4.63989L16.5849 7.28475L8.07751 15.9175Z'
                    />
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      fill={theme.palette.primary.main}
                      d='M7.77295 16.3566L23.6563 0H32V6.88383C32 6.88383 31.8262 9.17836 30.6591 10.4057L19.7824 22H13.6938L7.77295 16.3566Z'
                    />
                  </svg>
                  <Typography
                    variant='h6'
                    sx={{
                      ml: 2.5,
                      fontWeight: 600,
                      lineHeight: '24px',
                      fontSize: '1.375rem !important'
                    }}
                  >
                    {siteId}
                  </Typography>
                </Box>
                <div>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>Office 149, 450 South Brand Brooklyn</Typography>
                  <Typography sx={{ mb: 2, color: 'text.secondary' }}>San Diego County, CA 91905, USA</Typography>
                  <Typography sx={{ color: 'text.secondary' }}>+1 (123) 456 7891, +44 (876) 543 2198</Typography>
                </div>
              </Box>
            </Grid>
            <Grid item xl={6} xs={12}></Grid>
          </Grid>
          <Grid item xl={6} xs={12} sx={{ mt: 10, mb: { xl: 0, xs: 4 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'left', justifyContent: 'flex-start' }}>
              <CalcWrapper flex={0.5}>
                <Typography>Dear </Typography>
                <FormControl fullWidth>
                  <Controller
                    render={({ onChange, ...props }) => (
                      <CustomAutocomplete
                        size='small'
                        value={tenant}
                        onChange={(event, newValue) => {
                          setTenant(newValue)
                        }}
                        options={allTenantsData ? allTenantsData : []}
                        getOptionLabel={tenant => tenant.name + ','} // Display the tenant name
                        // getOptionDisabled={tenant => !!tenant.property?.id}
                        sx={{ minWidth: 150 }}
                        renderInput={params => <TextField {...params} label='Select Tenant' />}
                      />
                    )}
                    onChange={([, data]) => data}
                    defaultValue={''}
                    name={name}
                    control={control}
                  />
                </FormControl>
              </CalcWrapper>
            </Box>
          </Grid>
          <Grid item xl={6} xs={12}></Grid>
        </Grid>
      </CardContent>

      {/* <Divider /> */}

      <CardContent sx={{}}>
        <CustomLeaseEditor defaultLeaseText={tenancyAgreementContent} formVariables={formVariables}></CustomLeaseEditor>
      </CardContent>
      {/* <Divider /> */}

      <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
        <Grid
          container
          sx={{
            justifyContent: 'space-between'
          }}
          r
        >
          <Grid item xs={12} sm={6} lg={6} sx={{ order: { sm: 1, xs: 2 } }}>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Typography variant='body2' sx={{ mr: 2, fontWeight: 600 }}>
                Landlord:
              </Typography>
              {/* <TextField size='small' defaultValue='Tommy Shelby' /> */}
              <FormControl>
                <Controller
                  render={({ onChange, ...props }) => (
                    <CustomAutocomplete
                      value={landlord}
                      size='small'
                      onChange={(event, newValue) => {
                        console.log('new lanlord val', newValue)
                        setLandlord(newValue)
                      }}
                      options={siteUser ? siteUser : []}
                      getOptionLabel={landlord => landlord.name} // Display the tenant name
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Select Landlord'
                          sx={{ minWidth: 200 }} // Set a flexible minimum width
                        />
                      )}
                    />
                  )}
                  onChange={([, data]) => data}
                  defaultValue={''}
                  name={name}
                  control={control}
                />
              </FormControl>
            </Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Typography variant='body2' sx={{ mr: 2, fontWeight: 600 }}>
                Signature:
              </Typography>
              {/* <SignatureCanvas onSave={handleLandlordSignature} /> */}
              {/* <TextField size='small' defaultValue='' /> */}
            </Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Typography variant='body2' sx={{ mr: 2, fontWeight: 600 }}>
                Tenant:
              </Typography>
              {/* <TextField size='small' defaultValue='Tommy Shelby' /> */}

              <FormControl>
                <Controller
                  render={({ onChange, ...props }) => (
                    <CustomAutocomplete
                      value={tenant}
                      size='small'
                      onChange={(event, newValue) => {
                        setTenant(newValue)
                      }}
                      options={allTenantsData ? allTenantsData : []}
                      getOptionLabel={tenant => tenant.name} // Display the tenant name
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Select Tenant'
                          sx={{ minWidth: 200 }} // Set a flexible minimum width
                        />
                      )}
                    />
                  )}
                  onChange={([, data]) => data}
                  defaultValue={''}
                  name={name}
                  control={control}
                />
              </FormControl>
            </Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Typography variant='body2' sx={{ mr: 2, fontWeight: 600 }}>
                Signature:
              </Typography>
              {/* <TextField size='small' defaultValue='' /> */}
              {/* <SignatureCanvas onSave={handleTenantSignature} /> */}
            </Box>
          </Grid>
          <Grid item xs={12} sm={5} lg={4} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
            <CalcWrapperNew>
              <Typography sx={{ color: 'text.secondary' }}>Currency:</Typography>

              <FormControl sx={{}}>
                <Controller
                  name='Currency'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <>
                      <TextField
                        select
                        id='custom-select-native'
                        onChange={event => setCurrency(event.target.value)}
                        value={currency}
                        onBlur={onBlur}
                        name='currency'
                        required
                        size='small'
                        fullWidth
                      >
                        {currencies.map(currency => (
                          <MenuItem key={currency.code} value={currency.code}>
                            {currency.name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </>
                  )}
                />
              </FormControl>
            </CalcWrapperNew>

            <CalcWrapperNew>
              <Typography sx={{ color: 'text.secondary' }}>Rent Amount:</Typography>
              {/* <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>$2000</Typography> */}
              <FormControl>
                <TextField
                  onChange={event => setRentAmount(event.target.value)}
                  value={rentAmount}
                  sx={{ width: '142px' }}
                  size='small'
                  defaultValue='1'
                />
              </FormControl>
            </CalcWrapperNew>

            <CalcWrapperNew>
              <Typography sx={{ color: 'text.secondary' }}>Rent Payment Frequency:</Typography>
              <FormControl>
                <Select
                  onSelect={() => setPaymentFrequency(paymentFrequency)}
                  value={paymentFrequencyValue}
                  size='small'
                  onChange={handlePaymentFrequencyValue}
                >
                  {paymentFrequencies?.map((payment_frequency, index) => {
                    return <MenuItem value={payment_frequency?.value}>{payment_frequency?.text}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </CalcWrapperNew>

            <CalcWrapperNew>
              <Typography sx={{ color: 'text.secondary' }}>Additional Fees:</Typography>
              <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>$0</Typography>
            </CalcWrapperNew>
            <CalcWrapperNew sx={{ mb: '0 !important' }}>
              <Typography sx={{ color: 'text.secondary' }}>Tax:</Typography>
              <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>1%</Typography>
            </CalcWrapperNew>
            <Divider sx={{ my: `${theme.spacing(2)} !important` }} />
            <CalcWrapperNew>
              <Typography sx={{ color: 'text.secondary' }}>Total:</Typography>
              <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>$1800</Typography>
            </CalcWrapperNew>
          </Grid>
        </Grid>
      </CardContent>

      <Divider />

      <CardContent sx={{ px: [6, 10] }}>
        <InputLabel htmlFor='invoice-note' sx={{ mb: 2, fontWeight: 500, fontSize: '0.875rem' }}>
          Note:
        </InputLabel>
        <TextField
          rows={2}
          fullWidth
          multiline
          id='invoice-note'
          defaultValue='It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!'
        />
      </CardContent>
    </Card>
  )
}

export default AddCard
