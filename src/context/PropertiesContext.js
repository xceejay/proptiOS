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
  getProperties: () => Promise.resolve(),
  setProperties: () => null,
  properties: null
}
const PropertiesContext = createContext(defaultProvider)

const PropertiesProvider = ({ children }) => {
  // ** States
  // const [user, setUser] = useState(defaultProvider.user)
  const [properties, setProperties] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [accessToken, setAccessToken] = useState(null)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    if (!accessToken) {
      setAccessToken(window.localStorage.getItem('accessToken'))
    }
    console.log('Properties Context accessToken Set')
  }, [])

  //function for registering an account.
  const getProperties = (params, successCallback, errorCallback) => {
    if (!accessToken) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get('https://api.pm.manages.homes/properties', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: params
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
          setProperties(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const values = {
    // user,
    // setUser,
    properties,
    setProperties,
    loading,
    setLoading,
    setAccessToken,
    accessToken,
    getProperties: getProperties
  }

  return <PropertiesContext.Provider value={values}>{children}</PropertiesContext.Provider>
}

export { PropertiesContext, PropertiesProvider }
