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
  // user: null,
  loading: true,
  accessToken: null,
  setAccessToken: () => null,
  setUser: () => null,
  setLoading: () => Boolean,
  getTenants: () => Promise.resolve(),
  setTenants: () => null,
  tenants: null
}
const TenantsContext = createContext(defaultProvider)

const TenantsProvider = ({ children }) => {
  // ** States
  // const [user, setUser] = useState(defaultProvider.user)
  const [tenants, setTenants] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [accessToken, setAccessToken] = useState(null)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    if (!accessToken) {
      setAccessToken(window.localStorage.getItem('accessToken'))
    }
    console.log('Tenants Context accessToken Set')
  }, [])

  //function for registering an account.
  const getTenants = (params, successCallback, errorCallback) => {
    if (!accessToken) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get('https://api.pm.manages.homes/tenants', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: params
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

  const values = {
    // user,
    // setUser,
    tenants,
    setTenants,
    loading,
    setLoading,
    setAccessToken,
    accessToken,
    getTenants: getTenants
  }

  return <TenantsContext.Provider value={values}>{children}</TenantsContext.Provider>
}

export { TenantsContext, TenantsProvider }
