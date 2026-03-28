import { useState, useEffect } from 'react'
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
import { v4 } from 'uuid'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { useProperties } from 'src/hooks/useProperties'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'

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

const propertyTypes = [
  { name: 'Single-Family Home', value: 'single_family_home' },
  { name: 'Multi-Family Home', value: 'multi_family_home' },
  { name: 'Apartment', value: 'apartment' },
  { name: 'Single-Unit Office', value: 'single_unit_office' },
  { name: 'Multi-Unit Office', value: 'multi_unit_office' },
  { name: 'Condo', value: 'condo' },
  { name: 'Townhouse', value: 'townhouse' },
  { name: 'Retail Space', value: 'retail_space' }
]

const SidebarAddProperty = props => {
  const [property_uuid, setPropertyUUID] = useState(v4())

  const defaultValues = {
    uuid: property_uuid,
    property_name: '',
    property_email: '',
    property_address: '',
    country: 'GHA',
    property_tel_number: '',
    property_type: '',
    units: 1,
    rent_amount: ''
  }

  const { setPropertiesData, propertiesData, open, toggle } = props
  useEffect(() => {
    setPropertyUUID(v4())
  }, [toggle, open])

  const properties = useProperties()
  const auth = useAuth()

  const totalUnits = propertiesData.reduce((total, property) => total + property.units, 0)

  // Updated validation schema to include property-specific fields
  const schema = yup.object().shape({
    property_name: yup.string().min(3).required('Property Name field is required'),
    property_email: yup.string().email().required('Owner Email field is required'),
    property_address: yup.string().required('Property Address field is required'),
    country: yup.string().required('Country field is required'),
    property_tel_number: yup.string().required('Phone number is required'),
    property_type: yup.string().required('Property type is required'),
    units: yup
      .number()
      .required('Unit count is required')
      .min(1, 'A property must have at least 1 allocated unit')
      .integer()
      .test('units', 'You have exceeded the maximum number of units allowed for your subscription type', value => {
        const subscriptionType = auth.user.site_subscription_id
        const maxUnits = getMaxUnitsAllowed(subscriptionType)
        const remainingUnits = maxUnits - totalUnits
        return value <= remainingUnits
      }),
    rent_amount: yup
      .number()
      .transform((value, originalValue) => (originalValue === '' || originalValue === null ? null : value))
      .nullable()
      .min(0, 'Default unit rent amount cannot be negative')
  })

  const getMaxUnitsAllowed = subscriptionType => {
    switch (subscriptionType) {
      case 'standard':
        return 5
      case 'premium':
        return 50
      case 'enterprise':
        return Infinity // unlimited units
      default:
        return 0 // default to 0 units if subscription type is unknown
    }
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

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
          toast.error(data.description || 'Failed to add property', { duration: 5000 })
          setError('property_email', {
            type: 'manual',
            message: data.description || 'Unknown error occurred'
          })

          return
        }

        const updatedRequestData = requestData.map(property => {
          const matchingProperty = data.find(response => response.uuid === property.uuid)

          if (matchingProperty) {
            return {
              ...property,
              id: matchingProperty.id,
              status: matchingProperty.status || 'active'
            }
          }

          return property
        })

        toast.success('Property added successfully', { duration: 5000 })

        setPropertiesData(prevData => [...prevData, ...updatedRequestData])

        handleClose()
      },
      error => {
        toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
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
        <Typography variant='h6'>Add Property</Typography>
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
          <FormControl fullWidth sx={{ mb: 4, mt: 4 }}>
            <Controller
              name='uuid'
              control={control}
              render={({ field: { value = { property_uuid }, onChange } }) => (
                <TextField
                  disabled
                  value={property_uuid}
                  label='Unique Id'
                  onChange={onChange}
                  placeholder='Greenwood Apartments'
                  error={Boolean(errors.property_name)}
                />
              )}
            />
            {errors.property_name && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.property_name.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='property_name'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  value={value}
                  label='Property Name'
                  onChange={onChange}
                  placeholder='Greenwood Apartments'
                  error={Boolean(errors.property_name)}
                />
              )}
            />
            {errors.property_name && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.property_name.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='property_email'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  type='email'
                  value={value}
                  label='Owner Email'
                  onChange={onChange}
                  placeholder='owner@example.com'
                  error={Boolean(errors.property_email)}
                />
              )}
            />
            {errors.property_email && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.property_email.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='property_address'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  value={value}
                  label='Property Address'
                  onChange={onChange}
                  placeholder='123 Main St'
                  error={Boolean(errors.property_address)}
                />
              )}
            />
            {errors.property_address && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.property_address.message}</FormHelperText>
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
              name='property_tel_number'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  type='tel'
                  value={value}
                  label='Owner Phone Number'
                  onChange={onChange}
                  placeholder='123-456-7890'
                  error={Boolean(errors.property_tel_number)}
                />
              )}
            />
            {errors.property_tel_number && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.property_tel_number.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='property_type'
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <TextField
                  select
                  id='custom-select-property-type'
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  fullWidth
                  label='Property Type'
                >
                  {propertyTypes.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            {errors.property_type && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.property_type.message}</FormHelperText>
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
            {!errors.units && (
              <FormHelperText>
                Every new property automatically gets a first default unit so the property never starts empty.
              </FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='rent_amount'
              control={control}
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  type='number'
                  value={value}
                  label='Default Unit Rent Amount'
                  onChange={onChange}
                  placeholder='1500'
                  error={Boolean(errors.rent_amount)}
                />
              )}
            />
            {errors.rent_amount && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.rent_amount.message}</FormHelperText>
            )}
            {!errors.rent_amount && (
              <FormHelperText>
                Optional. If set, the first auto-created unit starts with this rent amount.
              </FormHelperText>
            )}
          </FormControl>

          <Button type='submit' variant='contained' color='primary'>
            Add Property
          </Button>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddProperty

// Styled Header
const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  borderBottom: `1px solid ${theme.palette.divider}`
}))
