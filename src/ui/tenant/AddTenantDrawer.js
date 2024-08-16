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
    .min(3, obj => showErrors('Name', obj.value.length, obj.min))
    .required(),
  email: yup.string().email().required(),
  address: yup.string().required(),
  country: yup.string().required(),
  tel_number: yup
    .string()
    .min(10, obj => showErrors('Phone Number', obj.value.length, obj.min))
    .required(),
  user_type: yup.string().required()
})

const defaultValues = {
  name: '',
  email: '',
  address: '',
  country: '',
  tel_number: '',
  user_type: 'tenant'
}

const SidebarAddTenant = props => {
  const { open, toggle } = props

  const [plan, setPlan] = useState('basic')
  const [role, setRole] = useState('tenant')

  const dispatch = useDispatch()
  const store = useSelector(state => state.user)

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

  const onSubmit = data => {
    if (store?.allData?.some(u => u.email === data.email)) {
      store.allData.forEach(u => {
        if (u.email === data.email) {
          setError('email', {
            message: 'Email already exists!'
          })
        }
      })
    } else {
      dispatch(addUser({ ...data, role, currentPlan: plan }))
      toggle()
      reset()
    }
  }

  const handleClose = () => {
    setPlan('basic')
    setRole('tenant')
    setValue('tel_number', '')
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
        <Typography variant='h6'>Add Tenant</Typography>
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
                  label='Full Name'
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
              render={({ field: { value = '', onChange } }) => (
                <TextField
                  value={value}
                  label='Country'
                  onChange={onChange}
                  placeholder='GA'
                  error={Boolean(errors.country)}
                />
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
              onChange={e => setRole(e.target.value)}
              inputProps={{ placeholder: 'Select Role' }}
            >
              <MenuItem value='tenant'>Tenant</MenuItem>
              <MenuItem value='admin'>Admin</MenuItem>
              <MenuItem value='owner'>Owner</MenuItem>
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

export default SidebarAddTenant
