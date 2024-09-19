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
  financial: null,
  loading: true,
  setFinancial: () => null,
  setLoading: () => Boolean,
  getAllFinancial: () => Promise.resolve()
}
const FinancialContext = createContext(defaultProvider)

const FinancialProvider = ({ children }) => {
  // ** States
  const [financial, setFinancial] = useState(defaultProvider.user)
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
  const getAllFinancial = (params, successCallback, errorCallback) => {
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get('https://api.pm.manages.homes/financial', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
          setFinancial(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const values = {
    financial,
    loading,
    setFinancial,
    setLoading,
    getAllFinancial: getAllFinancial
  }

  return <FinancialContext.Provider value={values}>{children}</FinancialContext.Provider>
}

export { FinancialContext, FinancialProvider }
