import { useState, useEffect } from 'react'
import { Box, Button, FormControl, MenuItem, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material'
import { Controller, useForm, useWatch } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// Sample data for properties, units, tenants (Replace with actual data)
const properties = [
  { id: 'property1', name: 'Property 1' },
  { id: 'property2', name: 'Property 2' }
]

const units = [
  { id: 'unit1', name: 'Unit 1 - 2 Bedrooms', property_id: 'property1' },
  { id: 'unit2', name: 'Unit 2 - 3 Bedrooms', property_id: 'property1' }
]

const tenants = [
  { id: 'tenant1', name: 'Tenant 1' },
  { id: 'tenant2', name: 'Tenant 2' }
]

const paymentFrequencies = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
  { value: 'bi-yearly', label: 'Bi-Yearly' }
]

// Validation schema
const schema = yup.object().shape({
  title: yup.string().required('A Lease title is required'),
  property_id: yup.string().required('Property is required'),
  unit_id: yup.string().required('Unit is required'),
  tenant_id: yup.string().required('Tenant is required'),
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
    .positive('Security deposit must be positive')
    .required('Security deposit is required'),
  payment_frequency: yup.string().required('Payment frequency is required'),
  lease_terms: yup.string().required('Lease terms are required'),
  late_fee: yup.number().typeError('Late fee must be a number').positive('Late fee must be positive'),
  grace_period: yup.number().typeError('Grace period must be a number').positive('Grace period must be positive'),
  rent_increase_rate: yup.number().typeError('Rent increase rate must be a number').positive('Must be positive')
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
  'Review and Submit'
]

const LeaseStepper = ({ onFormDataChange }) => {
  const [activeStep, setActiveStep] = useState(0)

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

  const isLastStep = activeStep === steps.length - 1

  // Watch form data and call onFormDataChange when it changes
  const formData = useWatch({ control })

  useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange(formData)
    }
  }, [formData, onFormDataChange])

  const handleNext = async () => {
    let fieldsToValidate = []
    if (activeStep === 0) {
      fieldsToValidate = ['property_id', 'unit_id', 'tenant_id']
    } else if (activeStep === 1) {
      fieldsToValidate = ['lease_start_date', 'lease_end_date', 'rent_amount', 'security_deposit', 'lease_terms']
    } else if (activeStep === 2) {
      fieldsToValidate = ['payment_frequency', 'late_fee', 'grace_period']
    } else if (activeStep === 3) {
      fieldsToValidate = ['maintenance_responsibility', 'pet_policy', 'insurance_policy']
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
    console.log('Form data:', data)
    if (onFormDataChange) {
      onFormDataChange(data)
    }
  }

  const renderStepContent = step => {
    switch (step) {
      case 0:
        return <Step1Form control={control} errors={errors} watch={watch} />
      case 1:
        return <Step2Form control={control} errors={errors} />
      case 2:
        return <Step3Form control={control} errors={errors} />
      case 3:
        return <Step4Form control={control} errors={errors} />
      case 4:
        return <ReviewForm data={formData} />
      default:
        return 'Unknown step'
    }
  }

  return (
    <Box sx={{ width: '100%', mt: 4 }}>
      <Typography variant='h4' align='center' gutterBottom>
        Create Lease Agreement
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
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
              Submit
            </Button>
          )}
        </Box>
      </form>
    </Box>
  )
}

const Step1Form = ({ control, errors, watch }) => (
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
            {tenants.map(tenant => (
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

    <FormControl fullWidth sx={{ mb: 4 }}>
      <Controller
        name='rent_amount'
        control={control}
        render={({ field }) => (
          <TextField
            label='Rent Amount'
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
        name='security_deposit'
        control={control}
        render={({ field }) => (
          <TextField
            label='Security Deposit'
            type='number'
            {...field}
            error={Boolean(errors.security_deposit)}
            helperText={errors.security_deposit?.message}
          />
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

const Step3Form = ({ control, errors }) => (
  <Box sx={{ mt: 2 }}>
    <FormControl fullWidth sx={{ mb: 4 }}>
      <Controller
        name='payment_frequency'
        control={control}
        render={({ field }) => (
          <TextField
            select
            label='Payment Frequency'
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
        name='late_fee'
        control={control}
        render={({ field }) => (
          <TextField
            label='Late Fee'
            type='number'
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
  </Box>
)

const Step4Form = ({ control, errors }) => (
  <Box sx={{ mt: 2 }}>
    <FormControl fullWidth sx={{ mb: 4 }}>
      <Controller
        name='maintenance_responsibility'
        control={control}
        render={({ field }) => (
          <TextField
            label='Maintenance Responsibility'
            {...field}
            error={Boolean(errors.maintenance_responsibility)}
            helperText={errors.maintenance_responsibility?.message}
          />
        )}
      />
    </FormControl>

    <FormControl fullWidth sx={{ mb: 4 }}>
      <Controller
        name='pet_policy'
        control={control}
        render={({ field }) => (
          <TextField
            label='Pet Policy'
            {...field}
            error={Boolean(errors.pet_policy)}
            helperText={errors.pet_policy?.message}
          />
        )}
      />
    </FormControl>

    <FormControl fullWidth sx={{ mb: 4 }}>
      <Controller
        name='insurance_policy'
        control={control}
        render={({ field }) => (
          <TextField
            label='Insurance Policy'
            {...field}
            error={Boolean(errors.insurance_policy)}
            helperText={errors.insurance_policy?.message}
          />
        )}
      />
    </FormControl>
  </Box>
)

const ReviewForm = ({ data }) => {
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
    <Box sx={{ mt: 2 }}>
      <Typography variant='h6' gutterBottom>
        Review Lease Agreement Details
      </Typography>
      <Typography variant='subtitle1'>
        <strong>Title:</strong> {data.title}
      </Typography>
      <Typography variant='subtitle1'>
        <strong>Property:</strong> {getPropertyName(data.property_id)}
      </Typography>
      <Typography variant='subtitle1'>
        <strong>Unit:</strong> {getUnitName(data.unit_id)}
      </Typography>
      <Typography variant='subtitle1'>
        <strong>Tenant:</strong> {getTenantName(data.tenant_id)}
      </Typography>
      <Typography variant='subtitle1'>
        <strong>Lease Start Date:</strong> {data.lease_start_date ? data.lease_start_date.toLocaleDateString() : ''}
      </Typography>
      <Typography variant='subtitle1'>
        <strong>Lease End Date:</strong> {data.lease_end_date ? data.lease_end_date.toLocaleDateString() : ''}
      </Typography>
      <Typography variant='subtitle1'>
        <strong>Rent Amount:</strong> {data.rent_amount}
      </Typography>
      <Typography variant='subtitle1'>
        <strong>Security Deposit:</strong> {data.security_deposit}
      </Typography>
      <Typography variant='subtitle1'>
        <strong>Payment Frequency:</strong> {data.payment_frequency}
      </Typography>
      <Typography variant='subtitle1'>
        <strong>Lease Terms:</strong> {data.lease_terms}
      </Typography>
      <Typography variant='subtitle1'>
        <strong>Late Fee:</strong> {data.late_fee}
      </Typography>
      <Typography variant='subtitle1'>
        <strong>Grace Period:</strong> {data.grace_period} days
      </Typography>
      <Typography variant='subtitle1'>
        <strong>Rent Increase Rate:</strong> {data.rent_increase_rate}%
      </Typography>
    </Box>
  )
}

export default LeaseStepper
