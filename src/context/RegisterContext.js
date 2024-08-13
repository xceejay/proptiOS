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
  account: () => Promise.resolve()
}
const RegisterContext = createContext(defaultProvider)

const RegisterProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initRegister = async () => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        let userData = window.localStorage.getItem('userData')
        console.log('Register::site_id', userData.site_id)
      } else {
        setLoading(false)
      }
    }
    initRegister()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //function for registering an account.
  const createAccount = (params, errorCallback) => {
    console.log('logging in')

    axios
      .post('http://api.pm.manages.homes/auth/login', params)

      .then(async response => {
        console.log(response.data)
        params.rememberMe ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.data.token) : null
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.data.user })
        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.data.user)) : null
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
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
    account: createAccount
  }

  return <RegisterContext.Provider value={values}>{children}</RegisterContext.Provider>
}

export { RegisterContext, RegisterProvider }
