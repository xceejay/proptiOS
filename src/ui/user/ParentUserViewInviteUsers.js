// ** React Imports
import { useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { useForm, Controller } from 'react-hook-form'
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import Spinner from 'src/@core/components/spinner'

import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'
import toast from 'react-hot-toast'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useOnboarding } from 'src/hooks/useOnboarding'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Card, CardContent, CardHeader, CircularProgress, FormHelperText, Grid, Input, Tooltip } from '@mui/material'
import { MuiFileInput } from 'mui-file-input'

import RegisterFileUploader from 'src/ui/auth/RegisterFileUploader'
import { useAuth } from 'src/hooks/useAuth'
import { HelpOutlineRounded } from '@mui/icons-material'
import { useUsers } from 'src/hooks/useUsers'
import { LoaderIcon } from 'react-hot-toast'

const defaultValues = {
  role: 'property_manager'
  // id_card: undefined

  // country: countries.[]
}

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))
const schema = yup.object().shape({
  email: yup.string().email().required(),
  // password: yup.string().min(5).required(),
  full_name: yup.string().min(2).required(),
  role: yup.string().min(2).required()

  // site_id: yup.string().min(2).required(),
  // site_name: yup.string(),
  // id_card: yup
  //   .mixed()
  //   .required('ID card is required')
  //   .test('fileSize', 'File size is too large, File should be less or equal to 20MB', value => {
  //     return value && value.size <= FILE_SIZE
  //   })
  //   .test('fileFormat', 'Unsupported file format', value => {
  //     return value && SUPPORTED_FORMATS.includes(value.type)
  //   })
})

const ParentUserViewInviteUsers = ({ userData }) => {
  const [loading, setLoading] = useState(false)
  const users = useUsers()
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = formData => {
    // If formData should be an array, keep it as is
    // let requestData = [formData]
    let requestData = formData

    setLoading(true)
    users.Invite(
      requestData,
      responseData => {
        let { data } = responseData

        setLoading(false)

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

        toast.success('Invite sent to ' + formData.email, {
          duration: 5000
        })
      },
      error => {
        setLoading(false)

        toast.error(error?.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
      }
    )
  }

  // ** States
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Grid>
      <Card>
        <CardHeader
          action={
            <Tooltip title='Learn more roles and access'>
              <IconButton disabled>
                <HelpOutlineRounded></HelpOutlineRounded>
              </IconButton>
            </Tooltip>
          }
          title='Invite new users'
        ></CardHeader>
        <CardContent>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
            {' '}
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='api_error'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    {errors.api_error && (
                      <FormHelperText sx={{ fontSize: '15px', color: 'error.main' }} id=''>
                        {errors.api_error.message}
                      </FormHelperText>
                    )}
                  </>
                )}
              />
            </FormControl>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='full_name'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    required
                    autoFocus
                    label='Full name'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.full_name)}
                    placeholder='Joel Amoako'
                  />
                )}
              />
              {errors.full_name && (
                <FormHelperText sx={{ color: 'error.main' }} id=''>
                  {errors.full_name.message}
                </FormHelperText>
              )}
            </FormControl>
            {/* <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='Currency'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <TextField
                      select
                      id='custom-select-native'
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      name='currency'
                      required
                      fullWidth
                      label='Default Currency'
                    >
                      {currencies.map(currency => (
                        <MenuItem sx={{ fontSize: '15px' }} key={currency.code} value={currency.code}>
                          {currency.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </>
                )}
              />
            </FormControl> */}
            {/* <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='site_name'
                control={control}
                rules={{ required: false }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    name='site_name'
                    value={value}
                    onChange={onChange}
                    error={Boolean(errors.name)}
                    onBlur={onBlur}
                    fullWidth
                    label='Affiliated Company'
                    placeholder='manages.homes Property Management LTD'
                  />
                )}
              />
            </FormControl> */}
            {/* <FormControl sx={{ mb: 4, width: '30ch' }} variant='outlined'>
              <FormHelperText>Custom site domain</FormHelperText>
              <Controller
                name='site_id'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <>
                    <OutlinedInput
                      id='outlined-adornment-weight'
                      value={value?.toLowerCase()}
                      name='site_id'
                      autoFocus
                      onChange={onChange}
                      onBlur={onBlur}
                      error={Boolean(errors.site_id)}
                      required
                      endAdornment={<InputAdornment position='end'>.manages.homes</InputAdornment>}
                      aria-describedby='outlined-weight-helper-text'
                      placeholder='mypmcompany'
                      inputProps={{
                        'aria-label': 'cool'
                      }}
                    />
                  </>
                )}
              />
            </FormControl> */}
            <TextField
              select
              id='custom-select-native'
              defaultValue={'property_manager'}
              name='role'
              required
              autoFocus
              // disabled
              fullWidth
              sx={{ mb: 4 }}
              label='Role'
            >
              <MenuItem value='property_owner'>
                <em>Property Owner</em>
              </MenuItem>
              <MenuItem value='property_manager'>
                <em>Property Manager</em>
              </MenuItem>
              <MenuItem value='property_coordinator'>
                <em>Property Coordinator</em>
              </MenuItem>
              <MenuItem value='maintenance_worker'>
                <em>Maintenance Worker</em>
              </MenuItem>
              <MenuItem value='accounting_staff'>
                <em>Accounting Staff</em>
              </MenuItem>
              <MenuItem value='vendor'>
                <em>Vendor</em>
              </MenuItem>
              <MenuItem value='inspector'>
                <em>Inspector</em>
              </MenuItem>
            </TextField>
            <FormControl fullWidth sx={{ mb: 4 }}>
              <Controller
                name='email'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextField
                    required
                    autoFocus
                    label='Email'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={Boolean(errors.email)}
                    placeholder='pm@manages.homes'
                  />
                )}
              />
            </FormControl>
            {/* <FormControl fullWidth sx={{ mb: 1.5 }}>
              <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                Password
              </InputLabel>
              <Controller
                name='password'
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, onBlur } }) => (
                  <OutlinedInput
                    value={value}
                    onBlur={onBlur}
                    label='Password'
                    onChange={onChange}
                    id='auth-login-v2-password'
                    error={Boolean(errors.password)}
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} fontSize={20} />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                )}
              />
              {errors.password && (
                <FormHelperText sx={{ color: 'error.main' }} id=''>
                  {errors.password.message}
                </FormHelperText>
              )}
            </FormControl> */}
            {!loading ? (
              <>
                <Box sx={{ display: 'flex' }}>
                  <Button
                    onClick={console.log('form errors', errors)}
                    size='medium'
                    type='submit'
                    variant='contained'
                    sx={{ mt: 2 }}
                  >
                    Invite User
                  </Button>
                </Box>
              </>
            ) : (
              <>
                {' '}
                <Box sx={{ display: 'flex' }}>
                  <Typography mr={1} variant='subtitle2'>
                    Sending invite...
                  </Typography>
                  <CircularProgress size='20px'></CircularProgress>
                </Box>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </Grid>
  )
}

export default ParentUserViewInviteUsers
