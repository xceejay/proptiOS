import { useEffect, useState } from 'react'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { useTenants } from 'src/hooks/useTenants'
import { useProperties } from 'src/hooks/useProperties'
import toast from 'react-hot-toast'
import Autocomplete from '@mui/material/Autocomplete'
import { useRouter } from 'next/router'

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const schema = yup.object().shape({
  tenant: yup.object().nullable().required('Select a tenant')
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

const defaultValues = {
  tenant: null
}

const PropertyAddExistingTenantDrawer = props => {
  const { setPropertyData, propertyData, open, toggle } = props

  const [role, setRole] = useState('tenant')

  const tenants = useTenants()
  const properties = useProperties()
  const router = useRouter()
  const { id } = router.query

  const [allTenantsData, setAllTenantsData] = useState({})

  useEffect(() => {
    tenants.getTenants(
      {},
      responseData => {
        const { data } = responseData

        // setLoading(false)

        if (data?.status === 'NO_RES') { /* no action needed */ } else if (data?.status === 'FAILED') {
          alert(data.message || 'Failed to fetch tenants')

          return
        }
        setAllTenantsData(data)
      },
      error => {
        // setLoading(false)

        toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })


        setSubmitting(false)
      }
    )
  }, [open, toggle])

  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const refreshPropertyData = () => {
    if (!id) {
      return
    }

    properties.getProperty(
      id,
      responseData => {
        setPropertyData(responseData.data)
      },
      error => {
        toast.error(error.response?.data?.description || 'Failed to refresh property data', {
          duration: 5000
        })

        setSubmitting(false)
      }
    )
  }

  const [submitting, setSubmitting] = useState(false)

  const onSubmit = formData => {
    if (submitting) return
    setSubmitting(true)
    const selectedTenant = formData.tenant
    const requestData = [
      {
        ...selectedTenant,
        property_id: propertyData.id,
        user_type: selectedTenant.user_type || 'tenant'
      }
    ]

    tenants.editTenants(
      requestData,
      responseData => {
        let { data } = responseData

        if (data?.status === 'NO_RES') { /* no action needed */ } else if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to attach tenant')
          setError('tenant', {
            type: 'manual',
            message: data.description || 'Unknown error occurred'
          })

          setSubmitting(false)
          return
        }

        toast.success(selectedTenant.name + ' has been attached to ' + propertyData.name, {
          duration: 5000
        })

        // Close the drawer
        refreshPropertyData()
        setSubmitting(false)

        handleClose()
      },
      error => {
        toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })

        setSubmitting(false)
      }
    )
  }

  const handleClose = () => {
    setRole('tenant')

    // setValue('tel_number', '')
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
      sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: 420 } } }}
    >
      <Header>
        <Typography variant='h6'>Add Existing Tenant To {propertyData.name}</Typography>
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
              name='tenant'
              control={control}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={(allTenantsData.items || []).filter(tenant => tenant.property?.id !== propertyData?.id)}
                  value={value}
                  getOptionLabel={tenant => `${tenant.name} (${tenant.email})`}
                  getOptionDisabled={tenant => !!tenant.property?.id}
                  onChange={(_, newValue) => onChange(newValue)}
                  renderInput={params => <TextField {...params} label='Select Tenant' />}
                  isOptionEqualToValue={(option, selectedValue) => option.id === selectedValue?.id}
                />
              )}
            />
            {errors.tenant ? <Typography color='error.main'>{errors.tenant.message}</Typography> : null}
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='small' type='submit' variant='contained' sx={{ mr: 3 }} disabled={submitting}>
              {submitting ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
              Submit
            </Button>
            <Button size='small' variant='outlined' color='secondary' onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default PropertyAddExistingTenantDrawer
