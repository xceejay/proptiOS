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
  loading: true,
  accessToken: null,
  setAccessToken: () => {},
  setUser: () => {},
  setLoading: () => {},
  getAllLeases: () => Promise.resolve(),
  getLease: () => Promise.resolve(),
  addLeases: () => Promise.resolve(),
  editLeases: () => Promise.resolve(),
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
    const storedToken = window.localStorage.getItem('accessToken')
    if (storedToken) {
      setAccessToken(storedToken)
      console.log('Leases Context accessToken Set')
    }
  }, [])

  // Function for getting leases
  const getAllLeases = (params, successCallback, errorCallback) => {
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get('https://api.pm.manages.homes/leases', {
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
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get(`https://api.pm.manages.homes/leases/${id}`, {
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
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .post('https://api.pm.manages.homes/leases', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)

          // Map the request data to include empty arrays/default values for other fields
          // const newLease = data.map(lease => ({
          //   ...lease,
          //   id: response.data.id || null, // Assuming the response contains a unique id
          //   uuid: response.data.uuid || null, // Assuming the response contains a unique UUID
          //   contract_documents: [],
          //   id_documents: [],
          //   maintenance_requests: [],
          //   transactions: [],
          //   property: {},
          //   unit: {
          //     id: null,
          //     floor_no: null,
          //     bedrooms: null,
          //     furnished_status: null,
          //     monthly_rent: null
          //   },
          //   status: 'active',
          //   created_at: new Date().toISOString(),
          //   updated_at: new Date().toISOString(),
          //   logged_in: null,
          //   logged_out: null
          // }))

          // // Update the leases state
          // setLeases(prevLeases => ({
          //   ...prevLeases,
          //   data: {
          //     ...prevLeases.data,
          //     items: [...(prevLeases.data.items || []), ...newLease]
          //   }
          // }))

          // console.log('Updated leases:', leases)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const editLeases = (data, successCallback, errorCallback) => {
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .put('https://api.pm.manages.homes/leases', data, {
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
