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
  getTenants: () => Promise.resolve(),
  getTenant: () => Promise.resolve(),
  addTenants: () => Promise.resolve(),
  tenant: null,
  setTenants: () => {},
  setTenant: () => {},
  tenants: null
}

const TenantsContext = createContext(defaultProvider)

const TenantsProvider = ({ children }) => {
  // ** States
  const [tenants, setTenants] = useState(defaultProvider.tenants)
  const [tenant, setTenant] = useState(defaultProvider.tenant)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [accessToken, setAccessToken] = useState(null)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const storedToken = window.localStorage.getItem('accessToken')
    if (storedToken) {
      setAccessToken(storedToken)
      console.log('Tenants Context accessToken Set')
    }
  }, [])

  // Function for getting tenants
  const getTenants = (params, successCallback, errorCallback) => {
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get('https://api.pm.manages.homes/tenants', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
          setTenants(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  // Function for getting a single tenant
  const getTenant = (id, successCallback, errorCallback) => {
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get(`https://api.pm.manages.homes/tenants/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
          setTenant(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  // Function for adding tenants
  const addTenants = (data, successCallback, errorCallback) => {
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .post('https://api.pm.manages.homes/tenants', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)

          // Map the request data to include empty arrays/default values for other fields
          // const newTenant = data.map(tenant => ({
          //   ...tenant,
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

          // // Update the tenants state
          // setTenants(prevTenants => ({
          //   ...prevTenants,
          //   data: {
          //     ...prevTenants.data,
          //     items: [...(prevTenants.data.items || []), ...newTenant]
          //   }
          // }))

          // console.log('Updated tenants:', tenants)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const values = {
    tenants,
    tenant,
    setTenant,
    setTenants,
    addTenants,
    loading,
    setLoading,
    setAccessToken,
    accessToken,
    getTenants,
    getTenant
  }

  return <TenantsContext.Provider value={values}>{children}</TenantsContext.Provider>
}

export { TenantsContext, TenantsProvider }
