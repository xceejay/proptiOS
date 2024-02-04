// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormHelperText from '@mui/material/FormHelperText'
import useMediaQuery from '@mui/material/useMediaQuery'

import InputAdornment from '@mui/material/InputAdornment'
import * as source from 'src/ui/FileUploaderSourceCode'
import useClipboard from 'src/@core/hooks/useClipboard'

// ** Third Party Imports
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import FileUploaderSingle from 'src/ui/FileUploaderSingle'

const defaultValues = {
  email: '',
  lastName: '',
  password: '',
  firstName: ''
}

const CardSnippet = props => {
  // ** Props
  const { id, sx, code, title, children, className } = props

  // ** States
  const [showCode, setShowCode] = useState(false)
  const [tabValue, setTabValue] = useState(code.tsx !== null ? 'tsx' : 'jsx')

  // ** Hooks
  const clipboard = useClipboard()
  const hidden = useMediaQuery(theme => theme.breakpoints.down('md'))

  // ** Highlight code on mount
  useEffect(() => {
    Prism.highlightAll()
  }, [showCode, tabValue])

  const codeToCopy = () => {
    if (code.tsx !== null && tabValue === 'tsx') {
      return code.tsx.props.children.props.children
    } else if (code.jsx !== null && tabValue === 'jsx') {
      return code.jsx.props.children.props.children
    } else {
      return ''
    }
  }
}

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  email: yup.string().email().required(),
  lastName: yup
    .string()
    .min(3, obj => showErrors('lastName', obj.value.length, obj.min))
    .required(),
  password: yup
    .string()
    .min(8, obj => showErrors('password', obj.value.length, obj.min))
    .required(),
  firstName: yup
    .string()
    .min(3, obj => showErrors('firstName', obj.value.length, obj.min))
    .required()
})

const TenantsQuickSetupForm = () => {
  // ** States
  const [state, setState] = useState({
    password: '',
    showPassword: false
  })

  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword })
  }
  const onSubmit = () => toast.success('Form Submitted')

  return (
    <Card>
      <CardHeader title='Validation Schema With OnChange' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='firstName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='First Name'
                      onChange={onChange}
                      placeholder='Leonard'
                      error={Boolean(errors.firstName)}
                      aria-describedby='validation-schema-first-name'
                    />
                  )}
                />
                {errors.firstName && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-first-name'>
                    {errors.firstName.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='lastName'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value}
                      label='Last Name'
                      onChange={onChange}
                      placeholder='Carter'
                      error={Boolean(errors.lastName)}
                      aria-describedby='validation-schema-last-name'
                    />
                  )}
                />
                {errors.lastName && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-last-name'>
                    {errors.lastName.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='email'
                      value={value}
                      label='Email'
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder='carterleonard@gmail.com'
                      aria-describedby='validation-schema-email'
                    />
                  )}
                />
                {errors.email && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-email'>
                    {errors.email.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel htmlFor='validation-schema-password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <OutlinedInput
                      value={value}
                      label='Password'
                      onChange={onChange}
                      id='validation-schema-password'
                      error={Boolean(errors.password)}
                      type={state.showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                            aria-label='toggle password visibility'
                          >
                            <Icon icon={state.showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-schema-password'>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <CardSnippet
                title='Upload Single Files'
                code={{
                  tsx: null,
                  jsx: source.FileUploaderSingleJSXCode
                }}
              >
                <FileUploaderSingle />
              </CardSnippet>
            </Grid>
            <Grid item xs={12}>
              <Button size='large' type='submit' variant='contained'>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default TenantsQuickSetupForm
