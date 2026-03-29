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
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

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
import { FormHelperText } from '@mui/material'
import { MuiFileInput } from 'mui-file-input'
import toast from 'react-hot-toast'
import CircularProgress from '@mui/material/CircularProgress'
import { isValidSiteIdLabel, normalizeSiteIdLabel } from 'src/utils/siteId'


// ** Styled Components
const RegisterIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 600,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(1.75),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const FILE_SIZE = 20 * 1024 * 1024 // 20MB
const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'application/pdf']

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(5).required(),
  full_name: yup.string().min(2).required(),
  site_id: yup
    .string()
    .transform(value => normalizeSiteIdLabel(value))
    .min(2, 'Site ID must be at least 2 characters')
    .max(63, 'Site ID must be 63 characters or fewer')
    .test(
      'site-id-domain-label',
      'Use only lowercase letters, numbers, or hyphens. It cannot start or end with a hyphen.',
      value => isValidSiteIdLabel(value)
    )
    .required(),
  site_name: yup.string(),
  id_card: yup
    .mixed()
    .required('ID card is required')
    .test('fileSize', 'File size is too large, File should be less or equal to 20MB', value => {
      return value && value.size <= FILE_SIZE
    })
    .test('fileFormat', 'Unsupported file format', value => {
      return value && SUPPORTED_FORMATS.includes(value.type)
    })
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

// ISO 4217
const currencies = [
  { code: 'USD', name: 'United States Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound Sterling', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: '$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: '$' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: '$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: '$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
  { code: 'AED', name: 'United Arab Emirates Dirham', symbol: 'د.إ' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: '£' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.' }
]

const defaultValues = {
  role: 'property_manager',
  id_card: undefined

  // country: countries.[]
}

const Register = () => {
  const [loading, setLoading] = useState(false)
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

  const onboarding = useOnboarding()

  const handleFileChange = newFile => {
    console.log('new file', newFile)
    setFile(newFile)
  }

  const onSubmit = data => {
    setLoading(true)
    onboarding.setLoading(true)
    if (!isChecked) {
      setLoading(false)
      onboarding.setLoading(false)
      setError('agreement', {
        type: 'manual',
        message: 'You must agree to the privacy policy & terms.'
      })

      return
    }
    console.log('register::PAGE::')

    console.log('ONSUBMIT:::', data)

    // axios.get('http://google.com')
    onboarding.registerAccount(
      { data },
      responseData => {
        onboarding.setLoading(false)

        // Handle success
        if (responseData.data.status == 'FAILED') {
          setLoading(false)
          setError('api_error', {
            type: 'manual',
            message: responseData.data.description
          })

          return
        }
        console.log('Account created successfully:')
      },
      error => {
        onboarding.setLoading(false)
        setLoading(false)

        // Handle error
        console.log('error', error)
        toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 2000
        })
        setError('api_error', {
          type: 'manual',
          message: 'Unable to create account'
        })
      }
    )

    setLoading(false)
  }

  // ** States
  const [showPassword, setShowPassword] = useState(false)
  const [file, setFile] = useState(false)

  const [isChecked, setIsChecked] = useState(false) // Add state for checkbox

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings
  const imageSource = skin === 'bordered' ? 'auth-v2-register-illustration-bordered' : 'auth-v2-register-illustration'

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <RegisterIllustration
            alt='register-illustration'
            src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 400 }}>
            <svg height={56.375} viewBox='0 0 25 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
              <g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round'></g>
              <g id='SVGRepo_iconCarrier'>
                {' '}
                <path
                  d='M8 18H5.55556C3.59188 18 2 16.4081 2 14.4444V12C2 10.8954 2.89543 10 4 10C5.10457 10 6 10.8954 6 12V13.2C6 13.6418 6.35817 14 6.8 14H17.2C17.6418 14 18 13.6418 18 13.2V12C18 10.8954 18.8954 10 20 10C21.1046 10 22 10.8954 22 12V14.4444C22 16.4081 20.4081 18 18.4444 18H12'
                  stroke={theme.palette.primary.main}
                  strokeWidth='1.5'
                  strokeLinecap='round'
                ></path>{' '}
                <path
                  d='M20 10C20 9.07069 20 8.60603 19.9231 8.21964C19.6075 6.63288 18.3671 5.39249 16.7804 5.07686C16.394 5 15.9293 5 15 5H9C8.07069 5 7.60603 5 7.21964 5.07686C5.63288 5.39249 4.39249 6.63288 4.07686 8.21964C4 8.60603 4 9.07069 4 10'
                  stroke={theme.palette.primary.main}
                  fill={theme.palette.primary.main}
                  strokeWidth='1.5'
                ></path>{' '}
                <path
                  d='M12.75 11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11H12.75ZM11.25 7C11.25 7.41421 11.5858 7.75 12 7.75C12.4142 7.75 12.75 7.41421 12.75 7H11.25ZM11.25 11V14H12.75V11H11.25ZM11.25 5V7H12.75V5H11.25Z'
                  fill={theme.palette.primary.main}
                ></path>{' '}
                <path
                  d='M20 19V18M4 19V18'
                  stroke={theme.palette.primary.main}
                  strokeWidth='1.5'
                  strokeLinecap='round'
                ></path>{' '}
              </g>
            </svg>
            <Box sx={{ my: 6 }}>
              <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}>
                Create your account now
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Make your property management easy and fun!</Typography>
            </Box>
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
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='id_card'
                  control={control}
                  render={({ field, fieldState }) => (
                    <MuiFileInput
                      label={'ID card'}
                      InputProps={{
                        inputProps: {
                          accept: 'application/pdf, image/*'
                        },
                        startAdornment: <FileUploadOutlinedIcon />
                      }}
                      placeholder='Upload your ID card'
                      {...field}
                      helperText={fieldState.invalid ? errors.id_card.message : ''}
                      error={Boolean(errors.id_card)}
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='country'
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
                        name='country'
                        required
                        fullWidth
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
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
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
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
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
                      placeholder='proptios.com Property Management LTD'
                    />
                  )}
                />
              </FormControl>
              <FormControl sx={{ mb: 4, width: '30ch' }} variant='outlined'>
                <FormHelperText>Custom site domain & Site ID</FormHelperText>
                <Controller
                  name='site_id'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <>
                      <OutlinedInput
                        id='outlined-adornment-weight'
                        value={value || ''}
                        name='site_id'
                        autoFocus
                        onChange={event => onChange(normalizeSiteIdLabel(event.target.value))}
                        onBlur={onBlur}
                        error={Boolean(errors.site_id)}
                        required
                        endAdornment={<InputAdornment position='end'>.proptios.com</InputAdornment>}
                        aria-describedby='outlined-weight-helper-text'
                        placeholder='mypmcompany'
                        inputProps={{
                          'aria-label': 'cool'
                        }}
                      />
                    </>
                  )}
                />
                {errors.site_id && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.site_id.message}</FormHelperText>
                )}
              </FormControl>
              <TextField
                select
                id='custom-select-native'
                defaultValue={'Property manager or owner'}
                name='role'
                required
                autoFocus
                disabled
                fullWidth
                sx={{ mb: 4 }}
                label='Role'
              >
                <MenuItem value='Property manager or owner'>
                  <em>Property manager or owner</em>
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
                      placeholder='admin@proptios.com'
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 1.5 }}>
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
              </FormControl>
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isChecked}
                      onChange={e => setIsChecked(e.target.checked)} // Update state when checkbox is toggled
                    />
                  }
                  name='private_check_box'
                  sx={{ mb: 4, mt: 1.5, '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                  label={
                    <>
                      <Typography variant='body2' component='span'>
                        I agree to{' '}
                      </Typography>
                      <LinkStyled href='/' onClick={e => e.preventDefault()}>
                        privacy policy & terms
                      </LinkStyled>
                    </>
                  }
                />
                {errors.agreement && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.agreement.message}</FormHelperText>
                )}
              </FormControl>
              {!loading ? (
                <>
                  <Button size='small' fullWidth type='submit' variant='contained' sx={{ mb: 4 }}>
                    Create an account
                  </Button>
                </>
              ) : (
                <>
                  <Box sx={{ display: 'flex', mb: 4, flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress size={20}></CircularProgress>
                  </Box>
                </>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ color: 'text.secondary', mr: 2 }}>Already have an account?</Typography>
                <Typography variant='body2'>
                  <LinkStyled href='/login' sx={{ fontSize: '1rem' }}>
                    Sign in instead
                  </LinkStyled>
                </Typography>
              </Box>
              <Divider
                sx={{
                  fontSize: '0.875rem',
                  color: 'text.disabled',
                  '& .MuiDivider-wrapper': { px: 6 },
                  my: theme => `${theme.spacing(6)} !important`
                }}
              >
                or
              </Divider>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* <IconButton href='/' component={Link} sx={{ color: '#497ce2' }} onClick={e => e.preventDefault()}>
                  <Icon icon='mdi:facebook' />
                </IconButton>
                <IconButton href='/' component={Link} sx={{ color: '#1da1f2' }} onClick={e => e.preventDefault()}>
                  <Icon icon='mdi:twitter' />
                </IconButton>
                <IconButton
                  href='/'
                  component={Link}
                  onClick={e => e.preventDefault()}
                  sx={{ color: theme => (theme.palette.mode === 'light' ? '#272727' : 'grey.300') }}
                >
                  <Icon icon='mdi:github' />
                </IconButton> */}
                <IconButton href='/' component={Link} sx={{ color: 'green' }} onClick={e => e.preventDefault()}>
                  <Icon icon='mdi:google' />
                </IconButton>
              </Box>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}
Register.getLayout = page => <BlankLayout>{page}</BlankLayout>
Register.guestGuard = true

export default Register
