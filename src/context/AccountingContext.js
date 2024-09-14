// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'src/pages/middleware/axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Defaults
const defaultProvider = {
  accounting: null,
  loading: true,
  setAccounting: () => null,
  setLoading: () => Boolean,
  getAllAccounting: () => Promise.resolve()
}
const AccountingContext = createContext(defaultProvider)

const AccountingProvider = ({ children }) => {
  // ** States
  const [accounting, setAccounting] = useState(defaultProvider.user)
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
  const getAllAccounting = (params, successCallback, errorCallback) => {
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get('https://api.pm.manages.homes/accounting', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
          setAccounting(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const values = {
    accounting,
    loading,
    setAccounting,
    setLoading,
    getAllAccounting: getAllAccounting
  }

  return <AccountingContext.Provider value={values}>{children}</AccountingContext.Provider>
}

export { AccountingContext, AccountingProvider }
