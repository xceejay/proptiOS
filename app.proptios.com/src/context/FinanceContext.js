// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'src/pages/middleware/axios'
import { getStoredAccessToken } from 'src/utils/authStorage'

// ** Config

// ** Defaults
const defaultProvider = {
  finance: null,
  loading: true,
  accessToken: null,
  setAccessToken: () => {},
  setFinance: () => null,
  setLoading: () => Boolean,
  getAllFinance: () => Promise.resolve(),
  getAllRentTransactions: () => Promise.resolve(),
  getAllReports: () => Promise.resolve(),
  getTransaction: () => Promise.resolve(),
  getAllTransactions: () => Promise.resolve(),
  getAllSettlementAccounts: () => Promise.resolve(),
  getAllSettlementDetails: () => Promise.resolve()
}
const FinanceContext = createContext(defaultProvider)

const FinanceProvider = ({ children }) => {
  // ** States
  const [finance, setFinance] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [accessToken, setAccessToken] = useState(defaultProvider.accessToken)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const storedToken = getStoredAccessToken()
    if (storedToken) {
      setAccessToken(storedToken)
    }
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
  // }, [])

  //function for registering an account.
  const getAllFinance = (params, successCallback, errorCallback) => {
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + '/dashboard', {
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
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + '/transactions/type/rent', {
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

  const getTransaction = (id, successCallback, errorCallback) => {
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + `/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const getAllTransactions = (params, successCallback, errorCallback) => {
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + `/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const getAllReports = (successCallback, errorCallback) => {
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + `/transactions/reports`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const getAllSettlementAccounts = (id, successCallback, errorCallback) => {
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + `/settlements/accounts`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const getAllSettlementDetails = (successCallback, errorCallback) => {
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + `/settlements/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const values = {
    finance,
    loading,
    accessToken,
    setAccessToken,
    setFinance,
    setLoading,
    getAllFinance: getAllFinance,
    getAllRentTransactions: getAllRentTransactions,
    getAllReports: getAllReports,
    getTransaction: getTransaction,
    getAllTransactions: getAllTransactions,
    getAllSettlementAccounts: getAllSettlementAccounts,
    getAllSettlementDetails: getAllSettlementDetails
  }

  return <FinanceContext.Provider value={values}>{children}</FinanceContext.Provider>
}

export { FinanceContext, FinanceProvider }
