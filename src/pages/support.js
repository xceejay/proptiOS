// ** React Imports
import { useState } from 'react'
import BlankLayout from 'src/@core/layouts/BlankLayout'

const SupportPage = () => {
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const bgColors = useBgColor()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

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

  const onSubmit = data => {
    // auth.setLoading(true)
    const { email, password } = data

    // axios.get('http://google.com')
    auth.login({ email, password, rememberMe }, () => {
      // auth.setLoading(false)
      setError('email', {
        type: 'manual',
        message: 'Email or Password is invalid'
      })
    })
  }
  const imageSource = skin === 'bordered' ? 'auth-v2-login-illustration-bordered' : 'auth-v2-login-illustration'

  return <></>
}
SupportPage.getLayout = page => <BlankLayout>{page}</BlankLayout>
SupportPage.guestGuard = true

export default SupportPage
