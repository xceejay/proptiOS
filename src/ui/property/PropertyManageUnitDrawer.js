import { useEffect } from 'react'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'

import { useProperties } from 'src/hooks/useProperties'
import toast from 'react-hot-toast'
import Autocomplete from '@mui/material/Autocomplete'

import { useRouter } from 'next/router'


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

    floor_no: yup.number().min(1, 'Floor number must be at least 1').nullable(true),

    bedrooms: yup.number().min(1, 'Bedrooms must be at least 1').nullable(true),
    bathrooms: yup.number().min(1, 'Bathroom count must be at least 1').nullable(true),
    furnished: yup.number().required(),
    common_area: yup.number().required(),
    address: yup.string().nullable(true),

    tenancy_start_date: yup.string().nullable(),
    tenancy_end_date: yup.string().nullable(),

    description: yup.string().max(1000, 'Description can not exceed 1000 characters').nullable(true)
  })

  // unit_image_url: yup
  // .string()
  // .url('Invalid image URL')
  // .nullable(true)
  // .transform((_, val) => (val === Number(val) ? val : null)),
  // lease_id: yup
  // .number()
  // .nullable(true)
  // .transform((_, val) => (val === Number(val) ? val : null))

  const defaultValues = {
    name: unitData?.name,
    floor_no: unitData?.floor_no,
    bedrooms: unitData?.bedrooms,
    bathrooms: unitData?.bathrooms,
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
        floor_no: unitData?.floor_no,
        bedrooms: unitData?.bedrooms,
        bathrooms: unitData?.bathrooms,
        furnished: unitData?.furnished || 0,
        common_area: unitData?.common_area || 0,
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

          // setUnitsData([...propertyData?.units])
          setLoading(false)
        },
        error => {
          console.log(id)

          toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
            duration: 5000
          })
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

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
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

        // toast.error(error.response?.data?.description || "An error occurred. Please try again or contact support.", {
        //   duration: 5000
        // })
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

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='lease_id'
              control={control}
              defaultValue='' // Ensure this matches your form's initial value
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Autocomplete
                  options={propertyData.leases}
                  getOptionLabel={lease => lease.title + ' (' + lease.id + ')'}
                  getOptionDisabled={lease => !!lease?.tenant_id}
                  onChange={(event, newValue) => {
                    // Pass the new value's id or an empty string to handle the form state
                    onChange(newValue ? newValue.id : '')
                  }}
                  value={propertyData.leases?.find(lease => lease.id === value) || null} // Set the selected value
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
                  getOptionLabel={tenant => `${tenant.name} (${tenant.email})`}
                  getOptionDisabled={tenant => !!tenant?.unit_id}
                  onChange={(event, newValue) => {
                    // Pass the new value's id or an empty string to handle the form state
                    onChange(newValue ? newValue.id : '')
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value?.id} // Corrected comparison
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
              name='bathrooms'
              control={control}
              render={({ field: { value = 1, onChange } }) => (
                <TextField
                  value={value}
                  label='Number of Bathrooms'
                  onChange={onChange}
                  placeholder='1'
                  error={Boolean(errors.bathrooms)}
                />
              )}
            />
            {errors.bathrooms && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.bathrooms.message}</FormHelperText>
            )}
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
                    selected={value ? new Date(value) : null} // Handle null or undefined values
                    onChange={date => onChange(date ? date.toISOString().split('T')[0] : null)} // Handle nullable dates
                    dateFormat='yyyy-MM-dd'
                    placeholderText='Select Tenancy Start Date'
                    isClearable // Optional: Allows clearing the date
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
                    selected={value ? new Date(value) : null} // Handle null or undefined values
                    onChange={date => onChange(date ? date.toISOString().split('T')[0] : null)} // Handle nullable dates
                    dateFormat='yyyy-MM-dd'
                    placeholderText='Select Tenancy Start Date'
                    isClearable // Optional: Allows clearing the date
                    customInput={<TextField label='Tenancy Start Date' error={Boolean(errors.tenancy_end_date)} />}
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
