// ** React Imports
import { useState, forwardRef, useEffect, useRef } from 'react'

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
import LeaseStepper from './LeaseStepper'
import { useLeases } from 'src/hooks/useLeases'
import toast from 'react-hot-toast'

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
<div>
 <div style="margin-top: 60px;">
  <div>
    <div style="margin-bottom: 30px;">
      <h2 style="font-weight: 600; line-height: 28px; font-size: 1.375rem;">{{site_id}}</h2>
    </div>
    <div style="margin-bottom: 20px;">
      <p style="margin-bottom: 15px; color: #6c757d;">Office 149, 450 South Brand Brooklyn</p>
      <p style="margin-bottom: 15px; color: #6c757d;">San Diego County, CA 91905, USA</p>
      <p style="color: #6c757d;">+1 (123) 456 7891, +44 (876) 543 2198</p>
    </div>
  </div>
</div>

<div style="margin-top: 50px; margin-bottom: 30px;">
  <div style="display: flex; align-items: left;">
  </div>
</div>

<h1 style="text-align: center; text-decoration: underline; margin-bottom: 20px;">{{title}}</h1>
  <p>This agreement is made on this ………… day of ………… between {{tenant_name}} (Tenant) and {{landlord_name}} (Landlord). The landlord agrees to rent the {{unit_name}} located at {{property_name}} for a period of ………… years/months at a rental rate of {{currency}} {{rent_amount}} per {{payment_frequency}}, starting from {{lease_start_date}} and expiring on {{lease_end_date}}.</p>

  <p><strong>Responsibilities of the Tenant:</strong></p>
  <ul>
    <li>Pay rent on time as stated in this agreement.</li>
    <li>Be responsible for the payment of all utility bills, including water, electricity, gas, and waste collection, unless otherwise agreed in writing.</li>
    <li>Maintain the property in good condition and repair any damage caused, except for normal wear and tear.</li>
    <li>Use the premises solely for residential purposes and not sublet without prior written consent.</li>
    <li>Allow the landlord access for inspections or repairs with proper notice.</li>
  </ul>

  <p><strong>Responsibilities of the Landlord:</strong></p>
  <ul>
    <li>Ensure the property is in good condition and fit for habitation at the start of the tenancy.</li>
    <li>Perform structural repairs and maintenance.</li>
    <li>Provide the tenant with quiet enjoyment of the premises.</li>
    <li>Pay property taxes and applicable charges associated with ownership.</li>
  </ul>

  <p><strong>Termination of the Tenancy:</strong></p>
  <p>The tenancy may be terminated by either party with {{notice_period}} written notice. In the case of early termination, the tenant is liable for rent unless otherwise agreed. The early termination fee is {{currency}} {{early_termination_fee}}.</p>

  <p><strong>Renewal of the Tenancy:</strong></p>
  <p>The tenancy agreement may be renewed upon mutual agreement, with terms including a {{rent_increase_rate}}% rent increase rate.</p>

  <p><strong>Rent Payment Terms:</strong></p>
  <ul>
    <li>Rent must be paid {{payment_frequency}} in advance into the specified account by the {{payment_frequency}} day of each period.</li>
    <li>Late payments will incur a {{currency}} {{late_fee}} after a {{grace_period}} day grace period.</li>
  </ul>

  <p><strong>Use of Premises:</strong></p>
  <ul>
    <li>The tenant shall use the premises for residential purposes only and shall not engage in any illegal activities or any business on the premises without prior written consent from the landlord.</li>
    <li>Any activity that constitutes a nuisance or disturbance to neighbors or the landlord is prohibited.</li>
  </ul>

  <p><strong>Inspection and Access to Property:</strong></p>
  <p>The landlord has the right to inspect the property with at least 24 hours’ notice to the tenant, except in cases of emergency where immediate access is required.</p>

  <p><strong>Security Deposit:</strong></p>
  <p>A security deposit of {{currency}} {{security_deposit}} is required, which will be returned within ………… days after the lease end, minus any damages or unpaid bills.</p>

  <p><strong>Dispute Resolution:</strong></p>
  <p>Any disputes arising from this agreement will be resolved through mediation. If mediation fails, the matter may be referred to the appropriate court in ………… (jurisdiction).</p>

  <p><strong>Miscellaneous:</strong></p>
  <ul>
    <li>Pets: {{pet_policy}}</li>
    <li>Occupants: Maximum of {{occupants_count}} occupants.</li>
    <li>Utilities: {{utilities_included}}, specifically {{utility_details}}.</li>
    <li>Subletting: {{sublet_permission}}</li>
    <li>Move-in Condition: {{move_in_condition}}</li>
    <li>Move-out Condition: {{move_out_condition}}</li>
    <li>Insurance Policy: {{insurance_policy}}</li>
    <li>The tenant shall not keep pets on the premises without prior written permission from the landlord.</li>
    <li>The tenant shall ensure the property is adequately secured and that doors and windows are properly locked when leaving the premises.</li>
    <li>Any amendments to this agreement must be made in writing and signed by both parties.</li>
  </ul>

  <p>This tenancy agreement takes effect from the {{lease_start_date}}.</p>

  <h2 style="margin-top: 50px; margin-bottom: 20px;">IN WITNESS WHEREOF</h2>
<p style="margin-bottom: 30px;">The parties hereto have executed this Agreement as of the day and year first above written.</p>
<p></p>
<p></p>
<div style="margin-top: 40px; margin-bottom: 30px;">
  <p><strong>SIGNED BY THE LANDLORD:</strong></p>
    <p></p>
    <p></p>

  <p>_________________________________</p>
  <p>Name: <span style="border-bottom: 1px solid #000;"><b>{{landlord_name}}</b></span></p>
      <p></p>
    <p></p>
  <p>Date: _________________________________</p>
</div>
<p></p>
<p></p>
<div style="margin-top: 6px; margin-bottom: 30px;">
  <p><strong>SIGNED BY THE TENANT:</strong></p>
      <p></p>
    <p></p>
  <p>_________________________________</p>
  <p>Name: <span style="border-bottom: 1px solid #000;"><b>{{tenant_name}}</b></span></p>
      <p></p>
    <p></p>
  <p>Date: _________________________________</p>
</div>
`

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
  const {
    setPropertiesData,
    propertiesData,
    clients,
    invoiceNumber,
    selectedClient,
    setSelectedClient,
    toggleAddCustomerDrawer,
    submittedContent,
    setSubmittedContent
  } = props

  const allTenantsData = [{ name: 'Tenant 1', email: 'joel@gmail.com', id: 1 }]
  // ** States

  const [tenant, setTenant] = useState(null)

  const [FormProperties, setFormProperties] = useState([])
  const [FormTenants, setFormTenants] = useState([])
  const [FormUnits, setFormUnits] = useState([])

  const rteRef = useRef(null)

  const [originalContent, setOriginalContent] = useState('')

  const handleReplaceVars = htmlContent => {
    setOriginalContent(htmlContent)

    if (!rteRef.current?.editor || !htmlContent) {
      return
    }

    // Check if any variable placeholders exist
    const hasVariable = htmlContent.match(/{{\w+}}/g)

    if (!hasVariable) {
      // Trigger a toast error if no variable placeholders are found
      toast.error('We couldn’t find any "{{variable}}" in the document. Please undo your last changes and try again.', {
        autoClose: 6000 // Duration for the toast
      })
      return
    }

    // Define a map for replacement variables
    const variableMap = {
      site_id: siteId || '{{site_id}}',
      tenant_name: formData.tenant?.name || '{{tenant_name}}',
      landlord_name: formData.landlord?.name || siteUser?.name || '{{landlord_name}}',
      unit_name: formData.unit?.name || '{{unit_name}}',
      property_name: formData.property?.name || '{{property_name}}',
      currency: formData.currency || '{{currency}}',
      rent_amount: formData.rent_amount || '{{rent_amount}}',
      payment_frequency: formData.payment_frequency || '{{payment_frequency}}',
      lease_start_date: formData.lease_start_date || '{{lease_start_date}}',
      lease_end_date: formData.lease_end_date || '{{lease_end_date}}',
      lease_created_date: formData.lease_created_date || '{{lease_created_date}}',
      title: formData.title || '{{title}}',
      late_fee: formData.late_fee || '{{late_fee}}',
      security_deposit: formData.security_deposit || '{{security_deposit}}',
      grace_period: formData.grace_period || '{{grace_period}}',
      renewal_terms: formData.renewal_terms || '{{renewal_terms}}',
      termination_clause: formData.termination_clause || '{{termination_clause}}',
      notice_period: formData.notice_period || '{{notice_period}}',
      early_termination_fee: formData.early_termination_fee || '{{early_termination_fee}}',
      rent_increase_rate: formData.rent_increase_rate || '{{rent_increase_rate}}',
      guarantor_name: formData.guarantor_name || '{{guarantor_name}}',
      maintenance_responsibility: formData.maintenance_responsibility || '{{maintenance_responsibility}}',
      payment_method: formData.payment_method || '{{payment_method}}',
      tenant_signature: formData.tenant_signature || '{{tenant_signature}}',
      landlord_signature: formData.landlord_signature || '{{landlord_signature}}',
      insurance_policy: formData.insurance_policy || '{{insurance_policy}}',
      pet_policy: formData.pet_policy || '{{pet_policy}}',
      occupants_count: formData.occupants_count || '{{occupants_count}}',
      utilities_included: formData.utilities_included || '{{utilities_included}}',
      utility_details: formData.utility_details || '{{utility_details}}',
      sublet_permission: formData.sublet_permission || '{{sublet_permission}}',
      move_in_condition: formData.move_in_condition || '{{move_in_condition}}',
      move_out_condition: formData.move_out_condition || '{{move_out_condition}}'
    }

    // Replace each variable using the variableMap
    const updatedContent = htmlContent.replace(/{{(\w+)}}/g, (match, variableName) => {
      return variableMap[variableName] || match // Replace or leave unchanged if not found in the map
    })

    // Set the updated content in the editor
    rteRef.current.editor.commands.setContent(updatedContent)
  }

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
  const [siteUser, setSiteUser] = useState({})
  const handlePaymentFrequencyValue = event => {
    setStatusValue(event.target.value)
  }

  // ** Hook
  const theme = useTheme()
  const auth = useAuth()
  const leases = useLeases()

  useEffect(() => {
    setSiteId(auth.user.site_name)
    setSiteUser(auth.user)
  }, [auth])

  // useEffect(() => {
  //   console.log('Select Changed!')
  //   console.log(formVariables)

  //   setFormVariables({
  //     landlord: landlord || '',
  //     tenant: tenant || '',
  //     currency: currency || '',
  //     rent_amount: rentAmount || '',
  //     payment_frequency: paymentFrequency || '',
  //     lease_start_date: leaseStartDate || '',
  //     lease_end_date: leaseEndDate || '',
  //     title: leaseTitle || '',
  //     unit_name: '',
  //     property_name: ''
  //   })
  // }, [currency, rentAmount, paymentFrequency, tenant, landlord, leaseTitle, leaseStartDate, leaseEndDate])
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
  const [formData, setFormData] = useState({})

  const handleFormDataChange = data => {
    setFormData(data)

    console.log('Form data from child:', data)

    // You can use this data to update state, make API calls, etc.
  }

  const handleFormSubmit = data => {
    console.log('Form data from child has been submitted:', data)
    handleReplaceVars(rteRef.current?.editor?.getHTML())
    setSubmittedContent(rteRef.current?.editor?.getHTML() ?? '')

    // API CALLS
    data.lease_html = rteRef.current?.editor?.getHTML() ?? ''
    data.lease_text = rteRef.current?.editor?.getText() ?? ''

    let requestData = [data]

    leases.addLeases(
      requestData,
      responseData => {
        console.log('Add Lease Card Page')
        let { data } = responseData

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to add lease')

          // yup form set error
          // setError('tenant_id', {
          //   type: 'manual',
          //   message: data.description || 'Unknown error occurred'

          // })

          toast.success(data.description, {
            duration: 5000
          })

          return
        }

        const updatedRequestData = requestData.map(lease => {
          const matchingLease = data.items?.find(response => response.id === lease.id)

          if (matchingLease) {
            return {
              ...lease,
              id: matchingLease.id
            }
          }

          return lease
        })

        toast.success('Lease successfully added for tenant ID ' + updatedRequestData[0].tenant_id, {
          duration: 5000
        })

        // setLeasesData(prevData => ({
        //   ...prevData,
        //   items: [...prevData.items, ...updatedRequestData]
        // }))

        // Close the drawer
        handleClose()
      },
      error => {
        toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
        console.log(error)
        //
      }
    )
  }
  useEffect(() => {
    if (formData !== null && propertiesData) {
      console.log('setting form vars')

      // const tenants = [
      //   { id: 'tenant1', name: 'Tenant 1' },
      //   { id: 'tenant2', name: 'Tenant 2' }
      //   // ...other tenants
      // ]

      // const properties = [
      //   { id: 'property1', name: 'Property 1' },
      //   { id: 'property2', name: 'Property 2' }
      // ]

      // const units = [
      //   { id: 'unit1', name: 'Unit 1 - 2 Bedrooms', property_id: 'property1' },
      //   { id: 'unit2', name: 'Unit 2 - 3 Bedrooms', property_id: 'property1' }
      // ]

      const extractUnique = (array, key) => {
        const seen = new Set()
        return array.filter(item => {
          if (seen.has(item[key])) {
            return false
          } else {
            seen.add(item[key])
            return true
          }
        })
      }

      const units = extractUnique(
        propertiesData.flatMap(property =>
          property.units.map(unit => ({
            id: unit.id,
            name: unit.name,
            property_id: property.id,
            tenant_id: unit.tenant_id
          }))
        ),
        'id'
      )

      const tenants = extractUnique(
        propertiesData.flatMap(property =>
          property.tenants.map(tenant => ({
            id: tenant.id,
            name: tenant.name,
            property_id: property.id,
            units: units.filter(unit => unit.tenant_id === tenant.id)
          }))
        ),
        'id'
      )

      setFormProperties(propertiesData)
      setFormTenants(tenants)
      setFormUnits(units)

      formData.tenant = tenants.find(tenant => formData.tenant_id === tenant.id)
      formData.unit = units.find(unit => formData.unit_id === unit.id)
      formData.property = propertiesData.find(property => formData.property_id === property.id)

      setTenant(formData.tenant)
      console.log('new Form data', formData)
      setFormVariables(formData)
    }
  }, [formData])

  return (
    <Card>
      <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
        <Grid container>
          <Grid xl={12} size={12}>
            <LeaseStepper
              handleReplaceVars={handleReplaceVars}
              rteRef={rteRef}
              properties={FormProperties}
              units={FormUnits}
              tenants={FormTenants}
              onFormDataChange={handleFormDataChange}
              onFormSubmit={handleFormSubmit}
            />
          </Grid>
          {/* <Grid xl={6} size={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xl: 'flex-end', xs: 'flex-start' } }}>
              <Box sx={{ mt: 3, mb: 3, display: 'flex', alignItems: 'center' }}>
                <Typography variant='h6' sx={{ mr: 2, width: '105px' }}>
                  Lease title
                </Typography>
                <TextField
                  size='small'
                  value={invoiceNumber}
                  sx={{ width: { sm: '250px', xs: '170px' } }}
                  InputProps={{
                    disabled: true,
                    startAdornment: <InputAdornment position='start'>#</InputAdornment>
                  }}
                />

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
          </Grid> */}
        </Grid>
        {/*
        <Grid sx={{ display: 'flex', justifyContent: 'center' }} container>
          <Grid
            item
            xl={3}
            size={6}
            sx={{
              mt: 10,
              mb: { xl: 0, xs: 4 }
            }}
          >
            <FormControl fullWidth>
              <Controller
                render={({ onChange, ...props }) => (
                  <Autocomplete
                    value={tenant}
                    onChange={(event, newValue) => {
                      setTenant(newValue)
                    }}
                    options={allTenantsData ? allTenantsData : []}
                    getOptionLabel={tenant => tenant.name + ','} // Display the tenant name
                    getOptionDisabled={tenant => !!tenant.property?.id}
                    renderInput={params => <TextField full {...params} label='Choose Lease Template' />}
                  />
                )}
                onChange={([, data]) => data}
                defaultValue={''}
                name={name}
                control={control}
              />
            </FormControl>
          </Grid>
        </Grid> */}

        {/* <Divider sx={{ mt: 10 }}></Divider> */}

        {/* <Grid sx={{ mt: 10 }} container>
          <Grid container>
            <Grid xl={6} size={12} sx={{ mb: { xl: 0, xs: 4 } }}>
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
            <Grid xl={6} size={12}></Grid>
          </Grid>
          <Grid xl={6} size={12} sx={{ mt: 10, mb: { xl: 0, xs: 4 } }}>
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
          <Grid xl={6} size={12}></Grid>
        </Grid> */}
      </CardContent>

      {/* <Divider /> */}
      {true ? (
        <>
          <CardContent sx={{}}>
            <CustomLeaseEditor
              originalContent={originalContent}
              setOriginalContent={setOriginalContent}
              handleReplaceVars={handleReplaceVars}
              rteRef={rteRef}
              submittedContent={submittedContent}
              setSubmittedContent={setSubmittedContent}
              defaultLeaseText={tenancyAgreementContent}
              formVariables={formVariables}
            ></CustomLeaseEditor>
          </CardContent>
          {/* <Divider /> */}

          {/* <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
            <Grid
              container
              sx={{
                justifyContent: 'space-between'
              }}
              r
            >
              <Grid size={12} sm={6} lg={6} sx={{ order: { sm: 1, xs: 2 } }}>
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                  <Typography variant='body2' sx={{ mr: 2, fontWeight: 600 }}>
                    Landlord:
                  </Typography>
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
                          getOptionLabel={landlord => landlord.name}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='Select Landlord'
                              sx={{ minWidth: 200 }}
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

                </Box>
                <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                  <Typography variant='body2' sx={{ mr: 2, fontWeight: 600 }}>
                    Tenant:
                  </Typography>


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

                </Box>
              </Grid>
              <Grid size={12} sm={5} lg={4} sx={{ mb: { sm: 0, xs: 4 }, order: { sm: 2, xs: 1 } }}>
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
          </CardContent> */}

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
              defaultValue='Please sign the document. Thank You!'
            />
          </CardContent>
        </>
      ) : (
        <></>
      )}
    </Card>
  )
}

export default AddCard
