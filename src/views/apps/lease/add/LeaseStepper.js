import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material'
import Icon from 'src/@core/components/icon'

import { Controller, useForm, useWatch } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'
import Alert from '@mui/material/Alert'

import toast from 'react-hot-toast'

// Sample data for properties, units, tenants (Replace with actual data)

const paymentFrequencies = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'bi-yearly', label: 'Bi-Yearly' }
]

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

// Validation schema
const schema = yup.object().shape({
  title: yup.string().max(100),
  tenant_id: yup.string().required('Tenant is required'),
  property_id: yup.string().required('Property is required'),
  unit_id: yup.string().required('Unit is required'),
  lease_start_date: yup.date().required('Start date is required'),
  lease_end_date: yup
    .date()
    .min(yup.ref('lease_start_date'), 'End date cannot be before start date')
    .required('End date is required'),
  rent_amount: yup
    .number()
    .typeError('Rent amount must be a number')
    .positive('Rent amount must be positive')
    .required('Rent amount is required'),
  security_deposit: yup
    .number()
    .typeError('Security deposit must be a number')
    .positive('Security deposit must be positive'),
  late_fee: yup.number().typeError('Late fee must be a number').positive('Late fee must be positive'),
  grace_period: yup.number().integer().positive('Grace period must be a positive number'),
  renewal_terms: yup.string().oneOf(['auto_renewal', 'manual_renewal']).required('Renewal terms are required'),
  termination_clause: yup.string().required(),
  notice_period: yup.number().integer().positive().required(),
  early_termination_fee: yup.number().positive(),
  rent_increase_rate: yup.number().positive(),
  guarantor_name: yup.string().max(100),
  payment_frequency: yup
    .string()
    .oneOf(['bi_yearly', 'yearly', 'quarterly', 'monthly'])
    .required('Payment frequency is required'),
  maintenance_responsibility: yup
    .string()
    .oneOf(['tenant', 'property', 'shared'])
    .required('Maintenance responsibility is required'),
  payment_method: yup
    .string()
    .oneOf(['bank_transfer', 'cash', 'credit_card', 'mobile_money'])
    .required('Payment method is required'),
  is_furnished: yup.boolean(),
  move_in_condition: yup.string(),
  move_out_condition: yup.string(),
  insurance_policy: yup.string().max(255),
  pet_policy: yup.string().oneOf(['allowed', 'not_allowed']),
  occupants_count: yup.number().integer(),
  utilities_included: yup.boolean(),
  utility_details: yup.string(),
  sublet_permission: yup.string().oneOf(['allowed', 'not_allowed', 'with_permission'])
})

// Default values
const defaultValues = {
  title: '',
  property_id: '',
  unit_id: '',
  tenant_id: '',
  lease_start_date: null,
  lease_end_date: null,
  rent_amount: '',
  security_deposit: '',
  payment_frequency: '',
  lease_terms: '',
  late_fee: '',
  grace_period: '',
  rent_increase_rate: ''
}

// Updated steps
const steps = [
  'Select Property, Unit, and Tenant',
  'Lease Details',
  'Payment Details',
  'Policies and Responsibilities',
  'Optional Terms',
  'Review and Submit'
]

const LeaseStepper = ({ onFormDataChange, onFormSubmit, tenants, units, properties }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [open, setOpen] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    trigger
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onBlur'
  })

  useEffect(() => {
    console.log('form errors: ', errors)
  }, [errors])
  const isLastStep = activeStep === steps.length - 1

  // Watch form data and call onFormDataChange when it changes
  const formData = useWatch({ control })

  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange(formData)
    }
  }, [formData, onFormDataChange])

  useEffect(() => {
    console.log('step' + activeStep)
  }, [activeStep])
  const handleNext = async () => {
    let fieldsToValidate = []

    if (activeStep === 0) {
      fieldsToValidate = ['property_id', 'unit_id', 'tenant_id']
    } else if (activeStep === 1) {
      fieldsToValidate = ['lease_start_date', 'lease_end_date', 'renewal_terms', 'lease_terms']
    } else if (activeStep === 2) {
      fieldsToValidate = [
        'currency',
        'rent_amount',
        'payment_frequency',
        'payment_method',
        'security_deposit',
        'late_fee',
        'grace_period',
        'rent_increase_rate'
      ]
    } else if (activeStep === 3) {
      fieldsToValidate = ['maintenance_responsibility', 'pet_policy', 'termination_clause', 'notice_period']
    }

    const valid = await trigger(fieldsToValidate)
    if (valid) {
      setActiveStep(prev => prev + 1)
    }
  }
  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  const onSubmit = data => {
    console.log(data)
    // console.log('Form data:', data)
    if (onFormDataChange) {
      // onFormDataChange(data)
      onFormSubmit(data)
      setOpen(true)
      toast.success('Lease has been created and saved successfully', { duration: 3000 })
    }
  }

  const renderStepContent = step => {
    switch (step) {
      case 0:
        return (
          <Step1Form
            control={control}
            errors={errors}
            watch={watch}
            tenants={tenants}
            units={units}
            properties={properties}
          />
        )
      case 1:
        return <Step2Form control={control} errors={errors} />
      case 2:
        return <Step3Form watch={watch} control={control} errors={errors} />
      case 3:
        return <Step4Form control={control} errors={errors} />
      case 4:
        return <Step5Form control={control} errors={errors} />
      case 5:
        return <ReviewForm data={formData} tenants={tenants} units={units} properties={properties} />
      default:
        return 'Unknown step'
    }
  }
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('sm')) // Add this

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant='h4' align='center' gutterBottom>
        Create Lease Agreement
      </Typography>
      <Stepper
        sx={{ mt: 4, mb: 4 }}
        activeStep={activeStep}
        alternativeLabel={!isMobile}
        orientation={isMobile ? 'vertical' : 'horizontal'}
      >
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderStepContent(activeStep)}
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button color='inherit' disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />

          {!isLastStep && (
            <Button onClick={handleNext} variant='contained'>
              Next
            </Button>
          )}
          {isLastStep && (
            <Button type='submit' variant='contained'>
              Save
            </Button>
          )}
        </Box>
      </form>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
        <Box sx={{ flex: '1 1 auto' }} />

        <Collapse in={open}>
          <Alert
            action={
              <IconButton
                aria-label='close'
                color='inherit'
                size='small'
                onClick={() => {
                  setOpen(false)
                }}
              >
                <Icon icon='tabler:x' fontSize='inherit' />
              </IconButton>
            }
            sx={{ mb: 2 }}
          >
            Your changes has been saved!
          </Alert>
        </Collapse>
      </Box>
    </Box>
  )
}

const Step1Form = ({ control, errors, watch, properties, units, tenants }) => (
  <Box sx={{ mt: 2 }}>
    <FormControl fullWidth sx={{ mb: 4 }}>
      <Controller
        name='title'
        control={control}
        render={({ field }) => (
          <TextField label='Lease Title' {...field} error={Boolean(errors.title)} helperText={errors.title?.message} />
        )}
      />
    </FormControl>

    <FormControl fullWidth sx={{ mb: 4 }}>
      <Controller
        name='property_id'
        control={control}
        render={({ field }) => (
          <TextField
            select
            label='Select Property'
            {...field}
            error={Boolean(errors.property_id)}
            helperText={errors.property_id?.message}
          >
            {properties.map(property => (
              <MenuItem key={property.id} value={property.id}>
                {property.name}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </FormControl>

    <FormControl fullWidth sx={{ mb: 4 }}>
      <Controller
        name='unit_id'
        control={control}
        render={({ field }) => (
          <TextField
            select
            label='Select Unit'
            {...field}
            error={Boolean(errors.unit_id)}
            helperText={errors.unit_id?.message}
          >
            {units
              .filter(unit => unit.property_id === watch('property_id'))
              .map(unit => (
                <MenuItem key={unit.id} value={unit.id}>
                  {unit.name}
                </MenuItem>
              ))}
          </TextField>
        )}
      />
    </FormControl>

    <FormControl fullWidth sx={{ mb: 4 }}>
      <Controller
        name='tenant_id'
        control={control}
        render={({ field }) => (
          <TextField
            select
            label='Select Tenant'
            {...field}
            error={Boolean(errors.tenant_id)}
            helperText={errors.tenant_id?.message}
          >
            {tenants
              .filter(tenant => tenant.property_id === watch('property_id'))
              .filter(tenant => tenant.units.some(unit => unit.id === watch('unit_id')))
              .map(tenant => (
                <MenuItem key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </MenuItem>
              ))}
          </TextField>
        )}
      />
    </FormControl>
  </Box>
)

const Step2Form = ({ control, errors }) => (
  <Box sx={{ mt: 2 }}>
    <FormControl fullWidth sx={{ mb: 4 }}>
      <Controller
        name='lease_start_date'
        control={control}
        render={({ field }) => (
          <DatePickerWrapper>
            <DatePicker
              selected={field.value}
              onChange={date => field.onChange(date)}
              dateFormat='yyyy-MM-dd'
              placeholderText='Select Lease Start Date'
              customInput={
                <TextField
                  label='Lease Start Date'
                  error={Boolean(errors.lease_start_date)}
                  helperText={errors.lease_start_date?.message}
                  fullWidth
                />
              }
            />
          </DatePickerWrapper>
        )}
      />
    </FormControl>

    <FormControl fullWidth sx={{ mb: 4 }}>
      <Controller
        name='lease_end_date'
        control={control}
        render={({ field }) => (
          <DatePickerWrapper>
            <DatePicker
              selected={field.value}
              onChange={date => field.onChange(date)}
              dateFormat='yyyy-MM-dd'
              placeholderText='Select Lease End Date'
              customInput={
                <TextField
                  label='Lease End Date'
                  error={Boolean(errors.lease_end_date)}
                  helperText={errors.lease_end_date?.message}
                  fullWidth
                />
              }
            />
          </DatePickerWrapper>
        )}
      />
    </FormControl>

    {/* Renewal Terms */}
    <FormControl fullWidth sx={{ mb: 4 }}>
      <Controller
        name='renewal_terms'
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            select
            label='Renewal Terms'
            {...field}
            error={Boolean(errors.renewal_terms)}
            helperText={errors.renewal_terms?.message}
          >
            {[
              { label: 'Auto Renewal', value: 'auto_renewal' },
              { label: 'Manual Renewal', value: 'manual_renewal' }
            ].map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </FormControl>
    <FormControl fullWidth sx={{ mb: 4 }}>
      <Controller
        name='lease_terms'
        control={control}
        render={({ field }) => (
          <TextField
            label='Lease Terms'
            multiline
            rows={4}
            {...field}
            error={Boolean(errors.lease_terms)}
            helperText={errors.lease_terms?.message}
          />
        )}
      />
    </FormControl>
  </Box>
)

const Step3Form = ({ watch, control, errors }) => {
  const selectedCurrency =
    currencies.find(currency => {
      const watchedCurrency = watch('currency')
      return watchedCurrency === currency.code
    })?.symbol || ''
  return (
    <Box sx={{ mt: 2 }}>
      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='currency'
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange, onBlur } }) => (
            <>
              <TextField
                select
                id='custom-select-native'
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                name='currency'
                required
                fullWidth
                label='Payment Currency'
              >
                {currencies.map(currency => (
                  <MenuItem sx={{ fontSize: '15px' }} key={currency.code} value={currency.code}>
                    {currency.name}
                  </MenuItem>
                ))}
              </TextField>
            </>
          )}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='rent_amount'
          control={control}
          render={({ field }) => (
            <TextField
              label='Rent Amount'
              InputProps={{ startAdornment: <InputAdornment position='start'> {selectedCurrency} </InputAdornment> }}
              type='number'
              {...field}
              error={Boolean(errors.rent_amount)}
              helperText={errors.rent_amount?.message}
            />
          )}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='payment_frequency'
          control={control}
          render={({ field }) => (
            <TextField
              select
              label='Rent Payment Frequency'
              {...field}
              error={Boolean(errors.payment_frequency)}
              helperText={errors.payment_frequency?.message}
            >
              {paymentFrequencies.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='security_deposit'
          control={control}
          render={({ field }) => (
            <TextField
              label='Security Deposit'
              type='number'
              InputProps={{ startAdornment: <InputAdornment position='start'> {selectedCurrency} </InputAdornment> }}
              {...field}
              error={Boolean(errors.security_deposit)}
              helperText={errors.security_deposit?.message}
            />
          )}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='late_fee'
          control={control}
          render={({ field }) => (
            <TextField
              label='Late Fee'
              type='number'
              InputProps={{ startAdornment: <InputAdornment position='start'> {selectedCurrency} </InputAdornment> }}
              {...field}
              error={Boolean(errors.late_fee)}
              helperText={errors.late_fee?.message}
            />
          )}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='grace_period'
          control={control}
          render={({ field }) => (
            <TextField
              label='Grace Period (days)'
              type='number'
              {...field}
              error={Boolean(errors.grace_period)}
              helperText={errors.grace_period?.message}
            />
          )}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='rent_increase_rate'
          control={control}
          render={({ field }) => (
            <TextField
              label='Rent Increase Rate (%)'
              type='number'
              {...field}
              error={Boolean(errors.rent_increase_rate)}
              helperText={errors.rent_increase_rate?.message}
            />
          )}
        />
      </FormControl>

      {/* Payment Method */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='payment_method'
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              select
              label='Payment Method'
              {...field}
              error={Boolean(errors.payment_method)}
              helperText={errors.payment_method?.message}
            >
              {[
                { label: 'Bank Transfer', value: 'bank_transfer' },
                { label: 'Cash', value: 'cash' },
                { label: 'Credit Card', value: 'credit_card' },
                { label: 'Mobile Money', value: 'mobile_money' }
              ].map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </FormControl>
    </Box>
  )
}
const Step4Form = ({ control, errors }) => (
  <Box sx={{ mt: 2 }}>
    {/* Maintenance Responsibility - Select (Enum) */}
    <FormControl fullWidth sx={{ mb: 4 }}>
      <Controller
        name='maintenance_responsibility'
        control={control}
        rules={{ required: 'Maintenance responsibility is required' }}
        render={({ field }) => (
          <TextField
            select
            label='Maintenance Responsibility'
            {...field}
            error={Boolean(errors.maintenance_responsibility)}
            helperText={errors.maintenance_responsibility?.message}
          >
            <MenuItem value='tenant'>Tenant</MenuItem>
            <MenuItem value='property'>Property</MenuItem>
            <MenuItem value='shared'>Shared</MenuItem>
          </TextField>
        )}
      />
    </FormControl>

    {/* Pet Policy - Select (Enum) */}
    <FormControl fullWidth sx={{ mb: 4 }}>
      <Controller
        name='pet_policy'
        control={control}
        rules={{ required: 'Pet policy is required' }}
        render={({ field }) => (
          <TextField
            select
            label='Pet Policy'
            {...field}
            error={Boolean(errors.pet_policy)}
            helperText={errors.pet_policy?.message}
          >
            <MenuItem value='allowed'>Allowed</MenuItem>
            <MenuItem value='not_allowed'>Not Allowed</MenuItem>
          </TextField>
        )}
      />
    </FormControl>

    {/* Termination Clause - Text Field */}
    <FormControl fullWidth sx={{ mb: 4 }}>
      <Controller
        name='termination_clause'
        control={control}
        rules={{ required: 'Termination clause is required' }}
        render={({ field }) => (
          <TextField
            label='Termination Clause'
            {...field}
            error={Boolean(errors.termination_clause)}
            helperText={errors.termination_clause?.message}
          />
        )}
      />
    </FormControl>

    {/* Notice Period - Number Field */}
    <FormControl fullWidth sx={{ mb: 4 }}>
      <Controller
        name='notice_period'
        control={control}
        rules={{ required: 'Notice period is required' }}
        render={({ field }) => (
          <TextField
            label='Notice Period'
            type='number'
            {...field}
            error={Boolean(errors.notice_period)}
            helperText={errors.notice_period?.message}
          />
        )}
      />
    </FormControl>
  </Box>
)

const Step5Form = ({ control, errors }) => {
  return (
    <Box sx={{ mt: 2 }}>
      {/* Guarantor Name */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='guarantor_name'
          control={control}
          render={({ field }) => (
            <TextField
              label='Guarantor Name'
              type='text'
              {...field}
              error={Boolean(errors.guarantor_name)}
              helperText={errors.guarantor_name?.message}
            />
          )}
        />
      </FormControl>

      {/* Insurance Policy */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='insurance_policy'
          control={control}
          render={({ field }) => (
            <TextField
              label='Insurance Policy'
              type='text'
              {...field}
              error={Boolean(errors.insurance_policy)}
              helperText={errors.insurance_policy?.message}
            />
          )}
        />
      </FormControl>

      {/* Occupants Count */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='occupants_count'
          control={control}
          render={({ field }) => (
            <TextField
              label='Occupants Count'
              type='number'
              {...field}
              error={Boolean(errors.occupants_count)}
              helperText={errors.occupants_count?.message}
            />
          )}
        />
      </FormControl>

      {/* Utilities Included */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='utilities_included'
          control={control}
          render={({ field }) => (
            <TextField
              select
              label='Utilities Included'
              {...field}
              error={Boolean(errors.utilities_included)}
              helperText={errors.utilities_included?.message}
            >
              <MenuItem value={true}>Yes</MenuItem>
              <MenuItem value={false}>No</MenuItem>
            </TextField>
          )}
        />
      </FormControl>

      {/* Utility Details */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='utility_details'
          control={control}
          render={({ field }) => (
            <TextField
              label='Utility Details'
              type='text'
              {...field}
              error={Boolean(errors.utility_details)}
              helperText={errors.utility_details?.message}
            />
          )}
        />
      </FormControl>

      {/* Sublet Permission */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='sublet_permission'
          control={control}
          render={({ field }) => (
            <TextField
              select
              label='Sublet Permission'
              {...field}
              error={Boolean(errors.sublet_permission)}
              helperText={errors.sublet_permission?.message}
            >
              <MenuItem value='allowed'>Allowed</MenuItem>
              <MenuItem value='not_allowed'>Not Allowed</MenuItem>
              <MenuItem value='with_permission'>With Permission</MenuItem>
            </TextField>
          )}
        />
      </FormControl>

      {/* Move-In Condition */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='move_in_condition'
          control={control}
          render={({ field }) => (
            <TextField
              label='Move-In Condition'
              type='text'
              {...field}
              error={Boolean(errors.move_in_condition)}
              helperText={errors.move_in_condition?.message}
            />
          )}
        />
      </FormControl>

      {/* Move-Out Condition */}
      <FormControl fullWidth sx={{ mb: 4 }}>
        <Controller
          name='move_out_condition'
          control={control}
          render={({ field }) => (
            <TextField
              label='Move-Out Condition'
              type='text'
              {...field}
              error={Boolean(errors.move_out_condition)}
              helperText={errors.move_out_condition?.message}
            />
          )}
        />
      </FormControl>
    </Box>
  )
}

const ReviewForm = ({ data, properties, units, tenants }) => {
  const getPropertyName = id => {
    const property = properties.find(p => p.id === id)
    return property ? property.name : ''
  }

  const getUnitName = id => {
    const unit = units.find(u => u.id === id)
    return unit ? unit.name : ''
  }

  const getTenantName = id => {
    const tenant = tenants.find(t => t.id === id)
    return tenant ? tenant.name : ''
  }

  return (
    <Box sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
      <Box>
        <Typography variant='h6' gutterBottom>
          Review Lease Agreement Details
        </Typography>
      </Box>

      <Box sx={{ mt: 2, width: '100%' }}>
        <Grid container spacing={3}>
          <Grid sx={{ display: 'flex', flexDirection: 'column' }} item xs={12} sm={6}>
            <Typography variant='small'>
              <strong>Title:</strong> {data.title}
            </Typography>
            <Typography variant='small'>
              <strong>Property:</strong> {getPropertyName(data.property_id)}
            </Typography>
            <Typography variant='small'>
              <strong>Unit:</strong> {getUnitName(data.unit_id)}
            </Typography>
            <Typography variant='small'>
              <strong>Tenant:</strong> {getTenantName(data.tenant_id)}
            </Typography>
            <Typography variant='small'>
              <strong>Lease Start Date:</strong>{' '}
              {data.lease_start_date ? data.lease_start_date.toLocaleDateString() : ''}
            </Typography>
            <Typography variant='small'>
              <strong>Lease End Date:</strong> {data.lease_end_date ? data.lease_end_date.toLocaleDateString() : ''}
            </Typography>
            <Typography variant='small'>
              <strong>Rent Amount:</strong> {data.rent_amount} {data.currency}
            </Typography>
            <Typography variant='small'>
              <strong>Rent Payment Frequency:</strong> {data.payment_frequency}
            </Typography>
            <Typography variant='small'>
              <strong>Security Deposit:</strong> {data.security_deposit} {data.currency}
            </Typography>
            <Typography variant='small'>
              <strong>Late Fee:</strong> {data.late_fee} {data.currency}
            </Typography>
            <Typography variant='small'>
              <strong>Grace Period:</strong> {data.grace_period} days
            </Typography>
            <Typography variant='small'>
              <strong>Rent Increase Rate:</strong> {data.rent_increase_rate}%
            </Typography>
            <Typography variant='small'>
              <strong>Renewal Terms:</strong> {data.renewal_terms}
            </Typography>
            <Typography variant='small'>
              <strong>Termination Clause:</strong> {data.termination_clause}
            </Typography>
          </Grid>

          <Grid sx={{ display: 'flex', flexDirection: 'column' }} item xs={12} sm={6}>
            <Typography variant='small'>
              <strong>Notice Period:</strong> {data.notice_period} days
            </Typography>
            <Typography variant='small'>
              <strong>Early Termination Fee:</strong> {data.early_termination_fee ? data.early_termination_fee : 'N/A'}
            </Typography>
            <Typography variant='small'>
              <strong>Guarantor Name:</strong> {data.guarantor_name || 'None'}
            </Typography>
            <Typography variant='small'>
              <strong>Maintenance Responsibility:</strong> {data.maintenance_responsibility}
            </Typography>
            <Typography variant='small'>
              <strong>Payment Method:</strong> {data.payment_method}
            </Typography>
            <Typography variant='small'>
              <strong>Is Furnished:</strong> {data.is_furnished ? 'Yes' : 'No'}
            </Typography>
            <Typography variant='small'>
              <strong>Move-in Condition:</strong> {data.move_in_condition || 'N/A'}
            </Typography>
            <Typography variant='small'>
              <strong>Move-out Condition:</strong> {data.move_out_condition || 'N/A'}
            </Typography>
            <Typography variant='small'>
              <strong>Insurance Policy:</strong> {data.insurance_policy || 'None'}
            </Typography>
            <Typography variant='small'>
              <strong>Pet Policy:</strong> {data.pet_policy}
            </Typography>
            <Typography variant='small'>
              <strong>Occupants Count:</strong> {data.occupants_count || 'N/A'}
            </Typography>
            <Typography variant='small'>
              <strong>Utilities Included:</strong> {data.utilities_included ? 'Yes' : 'No'}
            </Typography>
            <Typography variant='small'>
              <strong>Utility Details:</strong> {data.utility_details || 'N/A'}
            </Typography>
            <Typography variant='small'>
              <strong>Sublet Permission:</strong> {data.sublet_permission}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default LeaseStepper
