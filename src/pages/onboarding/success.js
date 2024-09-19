// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useOnboarding } from 'src/hooks/useOnboarding'

// Styled Components
const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
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
  display: 'flex',
  fontSize: '1rem',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main
}))

const OnboardingSuccess = () => {
  // ** Hooks

  const router = useRouter()

  const theme = useTheme()

  const onboarding = useOnboarding()

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

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
          <ForgotPasswordIllustration
            alt='forgot-password-illustration'
            src={`/images/pages/auth-v2-forgot-password-illustration-${theme.palette.mode}.png`}
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
                Welcome to MH🏠
              </Typography>

              <Typography sx={{ color: 'text.secondary' }}>
                A message with a verification code has been sent to{' '}
                <strong>
                  {onboarding.registrationDetails?.data.email
                    ? onboarding.registrationDetails.data.email
                    : 'your email'}
                </strong>
                . Please enter the <strong> 4 digit code</strong> to continue.
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}></Typography>
            </Box>

            <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
              <TextField autoFocus type='text' label='Code' sx={{ display: 'flex', mb: 4 }} />
              {/* For now lets just redirect to login*/}
              <LinkStyled href='/login'>
                <Button
                  fullWidth
                  variant='contained'
                  sx={{ mb: 4 }}
                  size='large'

                  // onClick={() => {
                  //   router.push('/')
                  // }}
                >
                  Verify Account
                </Button>
              </LinkStyled>

              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}>
                <LinkStyled href='http://manages.homes'>
                  <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                  <span>Back to home</span>
                </LinkStyled>
              </Typography>
            </form>
          </Box>
        </Box>
      </RightWrapper>
    </Box>
  )
}
OnboardingSuccess.getLayout = page => <BlankLayout>{page}</BlankLayout>
OnboardingSuccess.guestGuard = true

export default OnboardingSuccess
