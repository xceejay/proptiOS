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
import { useUsers } from 'src/hooks/useUsers'
import toast from 'react-hot-toast'

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

// Update validation schema based on the user fields
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
  user_type: 'user'
}

const onSubmit = formData => {
  // If formData should be an array, keep it as is
  let requestData = [formData]

  users.addUsers(
    requestData,
    responseData => {
      console.log('Add User Drawer')
      let { data } = responseData

      if (data?.status === 'NO_RES') {
        console.log('NO results')
      } else if (data?.status === 'FAILED') {
        alert(data.description || 'Failed to add user')
        setError('email', {
          type: 'manual',
          message: data.description || 'Unknown error occurred'
        })

        return
      }

      const updatedRequestData = requestData.map(user => {
        const matchingUser = data.find(response => response.email === user.email)

        if (matchingUser) {
          return {
            ...user,
            id: matchingUser.id
          }
        }

        return user
      })
      setUsersData(prevData => ({
        ...prevData,
        items: [...prevData.items, ...updatedRequestData]
      }))

      // Close the drawer
      handleClose()
    },
    error => {
      toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
        duration: 5000
      })
    }
  )
}

const SidebarAddUser = props => {
  const { setUsersData, usersData, open, toggle } = props

  const [role, setRole] = useState('user')

  const users = useUsers()

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
    let requestData = [formData]

    users.addUsers(
      requestData,
      responseData => {
        console.log('Add User Drawer')
        let { data } = responseData

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to add user')
          setError('email', {
            type: 'manual',
            message: data.description || 'Unknown error occurred'
          })

          return
        }

        const updatedRequestData = requestData.map(user => {
          const matchingUser = data.find(response => response.email === user.email)

          if (matchingUser) {
            return {
              ...user,
              id: matchingUser.id
            }
          }

          return user
        })

        toast.success('Invitation email has been sent to ' + updatedRequestData[0].email, {
          duration: 5000
        })

        setUsersData(prevData => ({
          ...prevData,
          items: [...prevData.items, ...updatedRequestData]
        }))

        // Close the drawer
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
    setRole('user')

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
        <Typography variant='h6'>Add User</Typography>
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
                  label='Full name'
                  onChange={onChange}
                  placeholder='Mary Johnson'
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
                  label='Email'
                  onChange={onChange}
                  placeholder='mary.johnson@example.com'
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
              name='country'
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <>
                  <TextField
                    select
                    id='custom-select-native'
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    name='country'
                    fullWidth
                    sx={{ mb: 4 }}
                    label='Country'
                  >
                    {countries.map(country => (
                      <MenuItem sx={{ fontSize: '15px' }} key={country.code} value={country.code}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </>
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
                  placeholder='9876543210'
                  error={Boolean(errors.tel_number)}
                />
              )}
            />
            {errors.tel_number && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.tel_number.message}</FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel id='role-select'>User Type</InputLabel>
            <Select
              fullWidth
              value={role}
              id='select-role'
              label='User Type'
              labelId='role-select'
              disabled
              onChange={e => setRole(e.target.value)}
              inputProps={{ placeholder: 'Select Role' }}
            >
              <MenuItem value='user'>User</MenuItem>
            </Select>
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

export default SidebarAddUser
