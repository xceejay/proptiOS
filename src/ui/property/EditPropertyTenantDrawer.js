import { useState } from 'react'
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

const EditPropertyTenantDrawer = props => {
  const { tenantData, open, toggle } = props
  const properties = useProperties()

  // Updated validation schema to include tenant-specific fields
  const schema = yup.object().shape({
    tenant_name: yup.string().min(3).required('Tenant Name field is required'),
    tenant_email: yup.string().email().required('Owner Email field is required'),
    tenant_address: yup.string().required('Tenant Address field is required'),
    country: yup.string().required('Country field is required'),
    tenant_tel_number: yup.string().required('Phone number is required'),
    tenant_type: yup.string().required('Tenant type is required'),
    units: yup.number().required('Unit count is required').positive().integer()
  })

  const defaultValues = {
    uuid: tenantData?.uuid,
    tenant_name: tenantData.name,
    tenant_email: tenantData.email,
    tenant_address: '',
    country: 'GHA',
    tenant_tel_number: '',
    tenant_type: '',
    units: ''
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

  const onSubmit = formData => {
    let requestData = [formData]

    properties.addProperties(
      requestData,
      responseData => {
        let { data } = responseData

        if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to add tenant')
          setError('tenant_email', {
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

        toast.success('Tenant added successfully', { duration: 5000 })
        console.log('datada:', data)
        console.log('upreqdata:', updatedRequestData)

        setPropertiesData(prevData => [...prevData, ...updatedRequestData])

        console.log('newprop', properties.properties)
        handleClose()
      },
      error => {
        console.error('Error from Add Tenant Drawer:', error)
      }
    )
  }

  const handleClose = () => {
    toggle()
    reset()
  }

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
                  error={Boolean(errors.tenant_name)}
                />
              )}
            />
            {errors.tenant_name && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.tenant_name.message}</FormHelperText>
            )}
          </FormControl> */}

          <FormControl fullWidth sx={{ mb: 4, mt: 4 }}>
            <Controller
              name='tenant_name'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  value={value}
                  label='Tenant Name'
                  onChange={onChange}
                  placeholder='Greenwood Apartments'
                  error={Boolean(errors.tenant_name)}
                />
              )}
            />
            {errors.tenant_name && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.tenant_name.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='tenant_email'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  type='email'
                  value={value}
                  label='Tenant Email'
                  onChange={onChange}
                  placeholder='owner@example.com'
                  error={Boolean(errors.tenant_email)}
                />
              )}
            />
            {errors.tenant_email && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.tenant_email.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='tenant_address'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  value={value}
                  label='Tenant Address'
                  onChange={onChange}
                  placeholder='123 Main St'
                  error={Boolean(errors.tenant_address)}
                />
              )}
            />
            {errors.tenant_address && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.tenant_address.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='country'
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  select
                  id='custom-select-country'
                  value={value || 'GHA'} // Ensure default value is applied
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
              name='tenant_tel_number'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  type='tel'
                  value={value}
                  label='Owner Phone Number'
                  onChange={onChange}
                  placeholder='123-456-7890'
                  error={Boolean(errors.tenant_tel_number)}
                />
              )}
            />
            {errors.tenant_tel_number && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.tenant_tel_number.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='tenant_type'
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
            {errors.tenant_type && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.tenant_type.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='units'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  type='number'
                  value={value}
                  label='Number of Units'
                  onChange={onChange}
                  placeholder='10'
                  error={Boolean(errors.units)}
                />
              )}
            />
            {errors.units && <FormHelperText sx={{ color: 'error.main' }}>{errors.units.message}</FormHelperText>}
          </FormControl>

          <Button type='submit' variant='contained' color='warning'>
            Edit Tenant
          </Button>
        </form>
      </Box>
    </Drawer>
  )
}

export default EditPropertyTenantDrawer

// Styled Header
const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  borderBottom: `1px solid ${theme.palette.divider}`
}))
