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
  loading: true,
  accessToken: null,
  setAccessToken: () => {},
  setUser: () => {},
  setLoading: () => {},
  getAllLeases: () => Promise.resolve(),
  getLease: () => Promise.resolve(),
  addLeases: () => Promise.resolve(),
  editLeases: () => Promise.resolve(),
  deleteLeases: () => Promise.resolve(),
  lease: null,
  setLeases: () => {},
  setLease: () => {},
  leases: null
}

const LeasesContext = createContext(defaultProvider)

const LeasesProvider = ({ children }) => {
  // ** States
  const [leases, setLeases] = useState(defaultProvider.leases)
  const [lease, setLease] = useState(defaultProvider.lease)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [accessToken, setAccessToken] = useState(null)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const storedToken = getStoredAccessToken()
    if (storedToken) {
      setAccessToken(storedToken)
      console.log('Leases Context accessToken Set')
    }
  }, [])

  // Function for getting leases
  const getAllLeases = (params, successCallback, errorCallback) => {
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + '/leases', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
          setLeases(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  // Function for getting a single lease
  const getLease = (id, successCallback, errorCallback) => {
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + `/leases/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
          setLease(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  // Function for adding leases
  const addLeases = (data, successCallback, errorCallback) => {
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .post(process.env.NEXT_PUBLIC_API_BASE_URL + '/leases', data, {
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

  const editLeases = (data, successCallback, errorCallback) => {
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .put(process.env.NEXT_PUBLIC_API_BASE_URL + '/leases', data, {
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
    leases,
    lease,
    setLease,
    setLeases,
    addLeases,
    editLeases,
    loading,
    setLoading,
    setAccessToken,
    accessToken,
    getAllLeases,
    getLease
  }

  return <LeasesContext.Provider value={values}>{children}</LeasesContext.Provider>
}

export { LeasesContext, LeasesProvider }
