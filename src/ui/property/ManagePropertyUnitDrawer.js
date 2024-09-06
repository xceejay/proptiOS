import { useState, useEffect } from 'react'
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'

import { addUser } from 'src/store/apps/user'
import { useProperties } from 'src/hooks/useProperties'
import toast from 'react-hot-toast'
import Autocomplete from '@mui/material/Autocomplete'
import CustomChip from 'src/@core/components/mui/chip'

import { useTenants } from 'src/hooks/useTenants'
import { useRouter } from 'next/router'
import { InputAdornment, OutlinedInput } from '@mui/material'

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

const ManagePropertyUnitDrawer = props => {
  const { unitData, setUnitsData, propertyData, setPropertyData, open, toggle, setLoading } = props
  const properties = useProperties()
  const router = useRouter()
  const { id } = router.query

  // Updated validation schema to include unit-specific fields
  const schema = yup.object().shape({
    name: yup
      .string()
      .min(3, obj => showErrors('name', obj.value.length, obj.min))
      .required(),
    rent_amount: yup.number().min(1, 'Rent amount must be at least 1'),
    rent_amount_currency: yup.string().required('Currency is required'),
    floor_no: yup
      .number()
      .min(1, 'Floor number must be at least 1')
      .nullable(true)
      .transform((_, val) => (val === Number(val) ? val : null)),
    bedrooms: yup
      .number()
      .min(1, 'Bedrooms must be at least 1')
      .nullable(true)
      .transform((_, val) => (val === Number(val) ? val : null)),
    bathroom: yup
      .number()
      .min(1, 'Bathroom count must be at least 1')
      .nullable(true)
      .transform((_, val) => (val === Number(val) ? val : null)),
    furnished: yup
      .number()
      .min(0)
      .max(1, 'Furnished should be either 0 or 1')
      .nullable(true)
      .transform((_, val) => (val === Number(val) ? val : null)),
    common_area: yup
      .number()
      .min(0)
      .max(1, 'Common Area should be either 0 or 1')
      .nullable(true)
      .transform((_, val) => (val === Number(val) ? val : null)),
    address: yup
      .string()
      .nullable(true)
      .transform((_, val) => (val === Number(val) ? val : null)),
    tenancy_start_date: yup
      .date()
      .nullable(true)
      .transform((_, val) => (val === Number(val) ? val : null)),
    tenancy_end_date: yup
      .date()
      .nullable(true)
      .transform((_, val) => (val === Number(val) ? val : null)),
    unit_image_url: yup
      .string()
      .url('Invalid image URL')
      .nullable(true)
      .transform((_, val) => (val === Number(val) ? val : null)),
    description: yup
      .string()
      .max(1000, 'Description can not exceed 1000 characters')
      .nullable(true)
      .transform((_, val) => (val === Number(val) ? val : null)),
    lease_id: yup
      .number()
      .nullable(true)
      .transform((_, val) => (val === Number(val) ? val : null))
  })

  const blockedUnit = () => {
    let unit_id = propertyData.units.find(unit => unit.unit_unit_id == unitData.id)?.id || ''

    console.log('found unit', unit_id)

    return unit_id
  }

  const defaultValues = {
    name: unitData?.name,
    rent_amount: unitData?.rent_amount || 1,
    rent_amount_currency: unitData?.rent_amount_currency || 'USD',
    floor_no: unitData?.floor_no,
    bedrooms: unitData?.bedrooms,
    bathroom: unitData?.bathroom,
    furnished: unitData?.furnished,
    common_area: unitData?.common_area,
    address: unitData?.address,
    tenancy_start_date: unitData?.tenancy_start_date,
    tenancy_end_date: unitData?.tenancy_end_date,
    unit_image_url: unitData?.unit_image_url,
    description: unitData?.description,
    tenant_id: unitData?.tenant_id,

    lease_id: unitData?.lease_id
  }

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (unitData) {
      console.log('resenting default values')

      reset({
        name: unitData?.name,
        rent_amount: unitData?.rent_amount || 1,
        rent_amount_currency: unitData?.rent_amount_currency || 'USD',
        floor_no: unitData?.floor_no,
        bedrooms: unitData?.bedrooms,
        bathroom: unitData?.bathroom,
        furnished: unitData?.furnished,
        common_area: unitData?.common_area,
        address: unitData?.address,
        tenancy_start_date: unitData?.tenancy_start_date,
        tenancy_end_date: unitData?.tenancy_end_date,
        unit_image_url: unitData?.unit_image_url,
        description: unitData?.description,
        tenant_id: unitData?.tenant_id,
        lease_id: unitData?.lease_id
      })
    }
  }, [unitData, propertyData, reset])

  const refreshPropertyData = () => {
    if (id) {
      // Ensure id is defined before making the API call
      properties.getProperty(
        id,
        responseData => {
          console.log('refreshed data')
          let { data } = responseData
          setPropertyData(data)
          console.log('FROM Edit unit PAGE: refreshing property Data', responseData)

          if (responseData?.status === 'FAILED') {
            alert(responseData.message || 'Failed to fetch properties')
          }

          setUnitsData([...propertyData?.units])
          setLoading(false)
        },
        error => {
          console.log(id)
          console.error('FROM refresh btn PAGE:', error)
        }
      )
    }
  }

  useEffect(() => {
    refreshPropertyData()
  }, [open])

  const onSubmit = formData => {
    console.log('triggered')
    setLoading(true)
    formData.property_id = propertyData.id
    formData.id = unitData.id

    let requestData = [formData]

    console.log('unitData', unitData)

    console.log('reqdata', requestData)

    properties.editUnits(
      requestData,
      responseData => {
        let { data } = responseData

        if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to add unit')
          setError('email', {
            type: 'manual',
            message: data.description || 'Unknown error occurred'
          })

          return
        }

        const updatedRequestData = requestData.map(unit => {
          const matchingUnit = data.find(response => response.uuid === unit.uuid)

          if (matchingUnit) {
            return {
              ...unit,
              id: matchingUnit.id
            }
          }

          return unit
        })

        toast.success('Change applied', { duration: 3000 })

        handleClose()
      },
      error => {
        toast.error('Failed to edit unit', { duration: 3000 })
        setLoading(false)

        console.error('Error from Add Unit Drawer:', error)
      }
    )
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  const statusLabel = unitData?.status === 'active' ? 'Active' : 'Inactive'
  const statusColor = unitData?.status === 'active' ? 'success' : 'secondary'

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Edit Unit</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <FormControl fullWidth sx={{ mb: 4, mt: 4 }}>
            <Controller
              name='uuid'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  disabled
                  value={unitUUID} // Directly use the value from the field
                  label='Unit Unique Id'
                  onChange={onChange}
                  placeholder='Greenwood Apartments'
                  error={Boolean(errors.unit_uuid)}
                />
              )}
            />
            {errors.unit_uuid && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.unit_uuid.message}</FormHelperText>
            )}
          </FormControl> */}
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='name'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  value={value}
                  label='Unit Name'
                  onChange={onChange}
                  placeholder='Room 20A'
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='rent_amount_currency'
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <>
                  <TextField
                    select
                    id='custom-select-native'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    name='rent_amount_currency'
                    fullWidth
                    label='Currency'
                  >
                    {currencies.map(currency => (
                      <MenuItem sx={{ fontSize: '15px' }} key={currency.code} value={currency.code}>
                        {currency.symbol} : {currency.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
              )}
            />
            {errors.rent_amount_currency && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.rent_amount_currency.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }} variant='outlined'>
            <FormHelperText>Rent Amount</FormHelperText>
            <Controller
              name='rent_amount'
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <>
                  <OutlinedInput
                    value={value}
                    name='rent_amount'
                    onChange={onChange}
                    onBlur={onBlur}
                    error={Boolean(errors.rent_amount)}
                    type='number'
                    placeholder='2000.00'
                  />
                </>
              )}
            />
            {errors.rent_amount && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.rent_amount.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='lease_id'
              control={control}
              defaultValue='' // Ensure this matches your form's initial value
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Autocomplete
                  options={propertyData.leases}
                  getOptionLabel={lease => lease.name + ' (' + lease.id + ')'}
                  getOptionDisabled={lease => !!lease?.tenant_id}
                  onChange={(event, newValue) => {
                    // Pass the new value's id or an empty string to handle the form state
                    onChange(newValue ? newValue.id : '')
                  }}
                  value={propertyData.leases.find(lease => lease.id === value) || null} // Set the selected value
                  renderInput={params => <TextField {...params} label='Lease Attached' />}
                  isOptionEqualToValue={(option, value) => option.id === value} // Ensure proper comparison
                />
              )}
            />

            {errors.lease_id && <FormHelperText sx={{ color: 'error.main' }}>{errors.lease_id.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='tenant_id'
              control={control}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Autocomplete
                  options={propertyData.tenants}
                  getOptionLabel={tenant => tenant.name + ' (' + tenant.email + ')'}
                  getOptionDisabled={tenant => !!tenant?.unit_id}
                  onChange={(event, newValue) => {
                    // Pass the new value's id or an empty string to handle the form state
                    onChange(newValue ? newValue.id : '')
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value} // Ensure proper comparison
                  value={propertyData.tenants.find(tenant => tenant.id === value) || null} // Set the selected value
                  renderInput={params => <TextField {...params} label='Tenant Occupied' />}
                />
              )}
            />

            {errors.tenant_id && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.tenant_id.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='floor_no'
              control={control}
              render={({ field: { value = 1, onChange } }) => (
                <TextField
                  value={value}
                  label='Floor Number'
                  onChange={onChange}
                  placeholder='2'
                  error={Boolean(errors.floor_no)}
                />
              )}
            />
            {errors.floor_no && <FormHelperText sx={{ color: 'error.main' }}>{errors.floor_no.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='bedrooms'
              control={control}
              render={({ field: { value = 1, onChange } }) => (
                <TextField
                  value={value}
                  label='Number of Bedrooms'
                  onChange={onChange}
                  placeholder='1'
                  error={Boolean(errors.bedrooms)}
                />
              )}
            />
            {errors.bedrooms && <FormHelperText sx={{ color: 'error.main' }}>{errors.bedrooms.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='bathroom'
              control={control}
              render={({ field: { value = 1, onChange } }) => (
                <TextField
                  value={value}
                  label='Number of Bathrooms'
                  onChange={onChange}
                  placeholder='1'
                  error={Boolean(errors.bathroom)}
                />
              )}
            />
            {errors.bathroom && <FormHelperText sx={{ color: 'error.main' }}>{errors.bathroom.message}</FormHelperText>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='furnished'
              control={control}
              render={({ field: { value = 0, onChange } }) => (
                <TextField
                  select
                  value={value}
                  label='Furnished'
                  onChange={onChange}
                  placeholder='0'
                  error={Boolean(errors.furnished)}
                >
                  <MenuItem value={0}>No</MenuItem>
                  <MenuItem value={1}>Yes</MenuItem>
                </TextField>
              )}
            />
            {errors.furnished && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.furnished.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='common_area'
              control={control}
              render={({ field: { value = 1, onChange } }) => (
                <TextField
                  select
                  value={value}
                  label='Common Area'
                  onChange={onChange}
                  placeholder='1'
                  error={Boolean(errors.common_area)}
                >
                  <MenuItem value={0}>No</MenuItem>
                  <MenuItem value={1}>Yes</MenuItem>
                </TextField>
              )}
            />
            {errors.common_area && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.common_area.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='address'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  value={value}
                  label='Address'
                  onChange={onChange}
                  placeholder='456 Oak St'
                  error={Boolean(errors.address)}
                />
              )}
            />
            {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='tenancy_start_date'
              control={control}
              render={({ field: { value, onChange } }) => (
                <DatePickerWrapper
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    '& .react-datepicker': { boxShadow: 'none !important', border: 'none !important' }
                  }}
                >
                  <DatePicker
                    selected={value}
                    onChange={([selected]) => {
                      if (selected.target.value) return selected.target.value

                      return undefined
                    }}
                    dateFormat='yyyy-MM-dd'
                    placeholderText='Select Tenancy Start Date'
                    customInput={<TextField label='Tenancy Start Date' error={Boolean(errors.tenancy_start_date)} />}
                  />
                </DatePickerWrapper>
              )}
            />
            {errors.tenancy_start_date && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.tenancy_start_date.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='tenancy_end_date'
              control={control}
              render={({ field: { value, onChange } }) => (
                <DatePickerWrapper
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    '& .react-datepicker': { boxShadow: 'none !important', border: 'none !important' }
                  }}
                >
                  <DatePicker
                    selected={value}
                    onChange={([selected]) => {
                      if (selected.target.value) return selected.target.value

                      return undefined
                    }}
                    dateFormat='yyyy-MM-dd'
                    placeholderText='Select Tenancy End Date'
                    customInput={
                      <TextField
                        label='Tenancy End Date'
                        error={Boolean(errors.tenancy_end_date)}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    }
                  />
                </DatePickerWrapper>
              )}
            />
            {errors.tenancy_end_date && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.tenancy_end_date.message}</FormHelperText>
            )}
          </FormControl>
          {/* <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='unit_image_url'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  value={value}
                  label='Unit Image URL'
                  onChange={onChange}
                  placeholder='http://example.com/image.jpg'
                  error={Boolean(errors.unit_image_url)}
                />
              )}
            />
            {errors.unit_image_url && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.unit_image_url.message}</FormHelperText>
            )}
          </FormControl> */}
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='description'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  value={value}
                  label='Description'
                  onChange={onChange}
                  placeholder='Description of the unit'
                  multiline
                  rows={4}
                  error={Boolean(errors.description)}
                />
              )}
            />
            {errors.description && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
            )}
          </FormControl>

          {/* <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='lease_id'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <Autocomplete
                  options={propertyData.leases}
                  getOptionLabel={lease => lease.id.toString()}
                  onChange={(event, newValue) => onChange(newValue?.id)}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Lease ID'
                      placeholder='Select lease ID'
                      error={Boolean(errors.lease_id)}
                    />
                  )}
                />
              )}
            />
            {errors.lease_id && <FormHelperText sx={{ color: 'error.main' }}>{errors.lease_id.message}</FormHelperText>}
          </FormControl> */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type='submit' variant='contained' color='warning'>
              Edit Unit
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default ManagePropertyUnitDrawer

// Styled Header
const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  borderBottom: `1px solid ${theme.palette.divider}`
}))
