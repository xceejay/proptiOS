import { useEffect, useState } from 'react'
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
import { useTenants } from 'src/hooks/useTenants'
import toast from 'react-hot-toast'
import Autocomplete from '@mui/material/Autocomplete'

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

// Update validation schema based on the tenant fields
const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, obj => showErrors('name', obj.value.length, obj.min))
    .required(),
  email: yup.string().email().required(),
  address: yup.string(),
  tel_number: yup.string(),
  user_type: yup.string()
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
  name: '',
  email: '',
  address: '',
  country: '',
  tel_number: '',
  property_name: '',
  user_type: 'tenant'
}

const onSubmit = formData => {
  // If formData should be an array, keep it as is
  let requestData = [formData]

  tenants.addTenants(
    requestData,
    responseData => {
      console.log('Add Tenant Drawer')
      let { data } = responseData

      if (data?.status === 'NO_RES') {
        console.log('NO results')
      } else if (data?.status === 'FAILED') {
        alert(data.description || 'Failed to add tenant')
        setError('email', {
          type: 'manual',
          message: data.description || 'Unknown error occurred'
        })

        return
      }

      const updatedRequestData = requestData.map(tenant => {
        const matchingTenant = data.find(response => response.email === tenant.email)

        if (matchingTenant) {
          return {
            ...tenant,
            id: matchingTenant.id
          }
        }

        return tenant
      })
      setTenantsData(prevData => ({
        ...prevData,
        items: [...prevData.items, ...updatedRequestData]
      }))

      // Close the drawer
      handleClose()
    },
    error => {
      toast.error(error.response.data?.description || 'An error occurred. Please try again or contact support.', {
        duration: 5000
      })
    }
  )
}

const PropertyAddExistingTenantDrawer = props => {
  const { setPropertyData, propertyData, open, toggle } = props

  const [role, setRole] = useState('tenant')

  const tenants = useTenants()

  const [allTenantsData, setAllTenantsData] = useState({})

  useEffect(() => {
    tenants.getTenants(
      {},
      responseData => {
        const { data } = responseData

        // setLoading(false)

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
          alert(data.message || 'Failed to fetch tenants')

          return
        }
        setAllTenantsData(data)
      },
      error => {
        // setLoading(false)

        toast.error(error.response.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
      }
    )
  }, [open, toggle])

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
    // If formData should be an array, keep it as is
    formData.property_id = propertyData.id

    //find a way to define selected guy
    let requestData = [formData]
    tenants.addTenants(
      requestData,
      responseData => {
        console.log('Add Tenant Drawer')
        let { data } = responseData

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to add tenant')
          setError('email', {
            type: 'manual',
            message: data.description || 'Unknown error occurred'
          })

          return
        }

        const updatedRequestData = requestData.map(tenant => {
          const matchingTenant = data.find(response => response.email === tenant.email)

          if (matchingTenant) {
            return {
              ...tenant,
              id: matchingTenant.id
            }
          }

          return tenant
        })

        toast.success('Invitation email has been sent to ' + updatedRequestData[0].email, {
          duration: 5000
        })

        setPropertyData(prevData => ({
          ...prevData,
          items: [...prevData.tenants, ...updatedRequestData]
        }))

        // Close the drawer
        handleClose()
      },
      error => {
        toast.error(error.response.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
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
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
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
              render={({ onChange, ...props }) => (
                <Autocomplete
                  options={allTenantsData.items || []}
                  getOptionLabel={tenant => tenant.name + '(' + tenant.email + ')'} // Display the tenant name
                  getOptionDisabled={tenant => !!tenant.property?.id}
                  renderInput={params => <TextField {...params} label='Select Tenant' />}
                />
              )}
              onChange={([, data]) => data}
              defaultValue={''}
              name={name}
              control={control}
            />
          </FormControl>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button size='small' type='submit' variant='contained' sx={{ mr: 3 }}>
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
