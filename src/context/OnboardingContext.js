// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: false,
  setUser: () => null,
  registrationDetails: null,
  setRegistrationDetails: () => null,
  setLoading: () => Boolean,
  registerAccount: () => Promise.resolve()
}
const OnboardingContext = createContext(defaultProvider)

const OnboardingProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [registrationDetails, setRegistrationDetails] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    console.log('test')
  }, [])

  // useEffect(() => {
  //   const initRegister = async () => {
  //     const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
  //     if (storedToken) {
  //       let userData = window.localStorage.getItem('userData')
  //       console.log('Register::site_id', userData.site_id)
  //     } else {
  //       setLoading(false)
  //     }
  //   }
  //   initRegister()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  //function for registering an account.
  const registerAccount = (params, errorCallback) => {
    // Create a FormData object
    const formData = new FormData()
    formData.append('role', params.data.role)
    formData.append('site_name', params.data.site_name)
    formData.append('site_domain', params.data.site_domain.toLowerCase() + '.manages.homes')
    formData.append('country', params.data.country)
    formData.append('full_name', params.data.full_name)
    formData.append('email', params.data.email)
    formData.append('password', params.data.password)
    formData.append('id_card', params.data.id_card)

    axios
      .post('https://api.pm.manages.homes/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(async response => {
        // Optionally, handle response data if needed
        if (response.data.token) {
          window.localStorage.setItem('authToken', response.data.token)
        }

        if (response.data.user) {
          window.localStorage.setItem('userData', JSON.stringify(response.data.user))
        }

        setRegistrationDetails(params)

        const redirectURL = '/onboarding/success'
        router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    console.log('logged out')
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    registrationDetails,
    setRegistrationDetails,
    setUser,
    setLoading,
    registerAccount: registerAccount
  }

  return <OnboardingContext.Provider value={values}>{children}</OnboardingContext.Provider>
}

export { OnboardingContext, OnboardingProvider }
