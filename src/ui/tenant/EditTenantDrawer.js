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
import { addUser } from 'src/store/apps/user'
import { useProperties } from 'src/hooks/useProperties'
import toast from 'react-hot-toast'
import Autocomplete from '@mui/material/Autocomplete'
import CustomChip from 'src/@core/components/mui/chip'

import { useTenants } from 'src/hooks/useTenants'
import { useRouter } from 'next/router'

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

const tenantTypes = [
  { name: 'Single-Family Home', value: 'single_family_home' },
  { name: 'Multi-Family Home', value: 'multi_family_home' },
  { name: 'Apartment', value: 'apartment' },
  { name: 'Single-Unit Office', value: 'single_unit_office' },
  { name: 'Multi-Unit Office', value: 'multi_unit_office' },
  { name: 'Condo', value: 'condo' },
  { name: 'Townhouse', value: 'townhouse' },
  { name: 'Retail Space', value: 'retail_space' }
]

const EditTenantDrawer = props => {
  const { tenantData, setTenantsData, tenantsData, open, toggle, setLoading } = props
  const tenant = useTenants()
  const properties = useProperties()
  const router = useRouter()
  const { id } = router.query

  // Updated validation schema to include tenant-specific fields
  const schema = yup.object().shape({
    name: yup.string().min(3).required('Tenant Name field is required'),
    email: yup.string().email().required('Owner Email field is required'),
    address: yup.string().nullable(),
    country: yup.string().nullable(),
    tel_number: yup.string().nullable(),
    property_id: yup.string().nullable()
  })

  const defaultValues = {
    uuid: tenantData?.uuid,
    name: tenantData?.name,
    email: tenantData?.email,
    address: tenantData?.address,
    country: tenantData?.country,
    status: tenantData?.status,
    tel_number: tenantData?.tel_number,
    property_id: tenantData?.property_id
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
    if (tenantData) {
      console.log('resenting default values')

      reset({
        uuid: tenantData?.uuid,
        name: tenantData?.name,
        email: tenantData?.email,
        address: tenantData?.address,
        country: tenantData?.country,
        status: tenantData?.status,
        tel_number: tenantData?.tel_number,
        property_id: tenantData?.property_id
      })
    }
  }, [tenantData, tenantData, reset])

  // const refreshPropertyData = () => {
  //   if (id) {
  //     // Ensure id is defined before making the API call
  //     properties.getProperty(
  //       id,
  //       responseData => {
  //         console.log('refreshed data')
  //         let { data } = responseData
  //         setPropertyData(data)
  //         console.log('FROM Edit tenant PAGE: refreshing property Data', responseData)

  //         if (responseData?.status === 'FAILED') {
  //           alert(responseData.message || 'Failed to fetch properties')
  //         }

  //         setTenantsData([...propertyData?.tenants])
  //         setLoading(false)
  //       },
  //       error => {
  //         console.log(id)
  //         console.error('FROM refresh btn PAGE:', error)
  //       }
  //     )
  //   }
  // }

  // useEffect(() => {
  //   refreshPropertyData()
  // }, [open])

  const onSubmit = formData => {
    setLoading(true)
    console.log
    formData.unit_id = tenantData.unit.id
    formData.property_id = tenantData.property.id
    formData.id = tenantData.id

    let requestData = [formData]

    tenant.editTenants(
      requestData,
      responseData => {
        let { data } = responseData

        if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to add tenant')
          setError('email', {
            type: 'manual',
            message: data.description || 'Unknown error occurred'
          })

          return
        }

        const updatedRequestData = requestData.map(tenant => {
          const matchingTenant = data.find(response => response.uuid === tenant.uuid)

          if (matchingTenant) {
            return {
              ...tenant,
              id: matchingTenant.id
            }
          }

          return tenant
        })

        toast.success('Change applied', { duration: 3000 })
        setLoading(false)

        handleClose()
      },
      error => {
        toast.error('Failed to edit tenant', { duration: 3000 })

        setLoading(false)

        console.error('Error from Add Tenant Drawer:', error)
      }
    )
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  const statusLabel = tenantData?.status === 'active' ? 'Active' : 'Inactive'
  const statusColor = tenantData?.status === 'active' ? 'success' : 'secondary'

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
        <Typography variant='h6'>Edit Tenant</Typography>
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
                  value={value}
                  label='Unique Id'
                  onChange={onChange}
                  placeholder='Greenwood Apartments'
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>
            )}
          </FormControl> */}

          <CustomChip
            rounded
            skin='light'
            size='small'
            label={statusLabel}
            color={statusColor}
            sx={{ textTransform: 'capitalize', mt: 4, mb: 4 }}
          />

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='name'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  value={value}
                  label='Tenant Name'
                  onChange={onChange}
                  placeholder='Greenwood Apartments'
                  error={Boolean(errors.name)}
                />
              )}
            />
            {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='email'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  type='email'
                  value={value}
                  label='Tenant Email'
                  onChange={onChange}
                  placeholder='owner@example.com'
                  error={Boolean(errors.email)}
                />
              )}
            />
            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='address'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  value={value}
                  label='Tenant Address'
                  onChange={onChange}
                  placeholder='123 Main St'
                  error={Boolean(errors.address)}
                />
              )}
            />
            {errors.address && <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='country'
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  select
                  id='custom-select-country'
                  value={value} // Ensure default value is applied
                  onChange={onChange}
                  onBlur={onBlur}
                  fullWidth
                  label='Country'
                >
                  {countries.map(country => (
                    <MenuItem key={country.code} value={country.code}>
                      {country.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {errors.country && <FormHelperText sx={{ color: 'error.main' }}>{errors.country.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='tel_number'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  type='tel'
                  value={value}
                  label='Phone Number'
                  onChange={onChange}
                  placeholder='123-456-7890'
                  error={Boolean(errors.tel_number)}
                />
              )}
            />
            {errors.tel_number && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.tel_number.message}</FormHelperText>
            )}
          </FormControl>

          {/*
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='type'
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  select
                  id='custom-select-tenant-type'
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  fullWidth
                  label='Tenant Type'
                >
                  {tenantTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {errors.type && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.type.message}</FormHelperText>
            )}
          </FormControl> */}
          {/*







ADD PROPERTY OPTIONS LATER




*/}
          {/* <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='property_id'
              control={control}
              defaultValue='' // Ensure this matches your form's initial value
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Autocomplete
                  options={tenantData.property_id}
                  getOptionLabel={unit => unit.name}
                  getOptionDisabled={unit => !!unit.unit_tenant_id}
                  onChange={(event, newValue) => {
                    // Pass the new value's id or an empty string to handle the form state
                    onChange(newValue ? newValue.id : '')
                  }}
                  value={tenantData.property_id || null} // Set the selected value
                  renderInput={params => <TextField {...params} label='Associated property' />}
                  isOptionEqualToValue={(option, value) => option.id === value} // Ensure proper comparison
                />
              )}
            />
            {errors.property_id && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.property_id.message}</FormHelperText>
            )}
          </FormControl> */}

          <Button type='submit' variant='contained' color='warning'>
            Edit Tenant
          </Button>
        </form>
      </Box>
    </Drawer>
  )
}

export default EditTenantDrawer

// Styled Header
const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  borderBottom: `1px solid ${theme.palette.divider}`
}))
