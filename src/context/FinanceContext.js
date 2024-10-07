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
  finance: null,
  loading: true,
  setFinance: () => null,
  setLoading: () => Boolean,
  getAllFinance: () => Promise.resolve(),
  getAllRentTransactions: () => Promise.resolve()
}
const FinanceContext = createContext(defaultProvider)

const FinanceProvider = ({ children }) => {
  // ** States
  const [finance, setFinance] = useState(defaultProvider.user)
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
  const getAllFinance = (params, successCallback, errorCallback) => {
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get('https://api.pm.manages.homes/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
          setFinance(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const getAllRentTransactions = (params, successCallback, errorCallback) => {
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get('https://api.pm.manages.homes/transactions/type/rent', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
          setFinance(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const values = {
    finance,
    loading,
    setFinance,
    setLoading,
    getAllFinance: getAllFinance,
    getAllRentTransactions: getAllRentTransactions
  }

  return <FinanceContext.Provider value={values}>{children}</FinanceContext.Provider>
}

export { FinanceContext, FinanceProvider }
