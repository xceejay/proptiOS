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
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  registerAccount: () => Promise.resolve()
}
const OnboardingContext = createContext(defaultProvider)

const OnboardingProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
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
    console.log('Creating account')

    console.log('param', params)
    axios
      .post('http://localhost:2024/auth/register', {
        role: params.data.role,
        site_name: params.data.site_name,
        site_domain: params.data.site_domain.toLowerCase() + '.manages.homes',
        country: params.data.country,
        full_name: params.data.full_name,
        email: params.data.email,
        password: params.data.password
      })
      .then(async response => {
        console.log('REGISTER:::response', response.data)

        // Optionally, handle response data if needed
        // e.g., storing token, user data, or redirecting

        // Example: Store token if available
        if (response.data.token) {
          window.localStorage.setItem('authToken', response.data.token)
        }

        // Example: Store user data if needed
        if (response.data.user) {
          window.localStorage.setItem('userData', JSON.stringify(response.data.user))
        }

        // Redirect user if needed
        const redirectURL = '/'
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
    setUser,
    setLoading,
    registerAccount: registerAccount
  }

  return <OnboardingContext.Provider value={values}>{children}</OnboardingContext.Provider>
}

export { OnboardingContext, OnboardingProvider }
