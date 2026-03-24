import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-hot-toast'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  TextField
} from '@mui/material'
import { useProperties } from 'src/hooks/useProperties'

const schema = yup.object().shape({
  property_name: yup.string().min(3).required('Property Name field is required'),
  property_email: yup.string().email().required('Owner Email field is required'),
  property_address: yup.string().required('Property Address field is required'),
  country: yup.string().required('Country field is required'),
  property_tel_number: yup.string().nullable('Phone number is required'),
  property_type: yup.string().required('Property type is required'),
  units: yup.number().required('Unit count is required').positive().integer()
})

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
const PropertyViewSettings = props => {
  const { propertyData, setPropertyData } = props
  const [defaultValues, setDefaultValues] = useState({
    uuid: propertyData?.uuid || '',
    property_name: propertyData?.name || '',
    property_email: propertyData?.property_manager?.email || '',
    property_address: propertyData?.address || '',
    country: propertyData?.country || 'GHA',
    property_tel_number: propertyData?.property_manager?.tel_number || '',
    property_type: propertyData?.type || '',
    units: propertyData?.allocated_units || ''
  })

  const properties = useProperties()

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = formData => {
    const uuid = propertyData?.uuid || ''
    let requestData = [{ ...formData, uuid }]
    properties.editProperties(
      requestData,
      responseData => {
        let { data } = responseData

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to edit property')
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
              ...propertyData,
              property_manager: {
                ...propertyData.property_manager,
                email: matchingProperty.property_manager?.email || propertyData.property_manager?.email,
                tel_number: matchingProperty.property_manager?.tel_number || propertyData.property_manager?.tel_number
              },
              address: matchingProperty.address || propertyData.address,
              country: matchingProperty.country || propertyData.country,
              type: matchingProperty.type || propertyData.type,
              allocated_units: matchingProperty.allocated_units || propertyData.allocated_units
            }
          }

          return property
        })

        toast.success('Property updated successfully', { duration: 5000 })
        console.log('datada:', data)
        console.log('upreqdata:', updatedRequestData)

        setPropertyData(updatedRequestData[0])
        // alert(JSON.stringify(updatedRequestData[0]))
      },
      error => {
        toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
      }
    )
  }

  return (
    <Grid container spacing={6}>
      {/* Connected Accounts Cards */}
      <Grid size={12}>
        <Card>
          <CardHeader title='Settings' sx={{ pb: 1.5 }} />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name='property_name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Property Name'
                    error={!!errors.property_name}
                    helperText={errors.property_name?.message}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Controller
                name='property_email'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Owner Email'
                    error={!!errors.property_email}
                    helperText={errors.property_email?.message}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Controller
                name='property_address'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Property Address'
                    error={!!errors.property_address}
                    helperText={errors.property_address?.message}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Controller
                name='country'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.country} sx={{ mb: 2 }}>
                    <TextField {...field} select label='Country'>
                      {countries.map(country => (
                        <MenuItem key={country.code} value={country.code}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    {errors.country && <FormHelperText>{errors.country.message}</FormHelperText>}
                  </FormControl>
                )}
              />
              <Controller
                name='property_tel_number'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Phone Number'
                    error={!!errors.property_tel_number}
                    helperText={errors.property_tel_number?.message}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Controller
                name='property_type'
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.property_type} sx={{ mb: 2 }}>
                    <TextField {...field} select label='Property Type'>
                      {propertyTypes.map(type => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    {errors.property_type && <FormHelperText>{errors.property_type.message}</FormHelperText>}
                  </FormControl>
                )}
              />
              <Controller
                name='units'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Number of Allocated Units'
                    error={!!errors.units}
                    helperText={errors.units?.message}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Button
                type='submit'
                variant='contained'
                color='primary'
                sx={{ mt: 2, width: '100%' }}
                disabled={!isDirty}
              >
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
export default PropertyViewSettings
