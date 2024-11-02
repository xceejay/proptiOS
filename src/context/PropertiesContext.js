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
  setLoading: () => {},
  getAllProperties: () => Promise.resolve(),
  getProperties: () => Promise.resolve(),
  getProperty: () => Promise.resolve(),
  addProperties: () => Promise.resolve(), // Renamed for consistency
  addMaintenanceRequests: () => Promise.resolve(), // Renamed for consistency
  addUnits: () => Promise.resolve(), // Renamed for consistency
  editUnits: () => Promise.resolve(), // Renamed for consistency
  editProperties: () => Promise.resolve(), // Renamed for consistency
  property: null,
  setProperty: () => {},
  properties: null,
  setProperties: () => {}
}

const PropertiesContext = createContext(defaultProvider)

const PropertiesProvider = ({ children }) => {
  // ** States
  const [properties, setProperties] = useState(defaultProvider.properties)
  const [property, setProperty] = useState(defaultProvider.property)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [accessToken, setAccessToken] = useState(null)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const storedToken = window.localStorage.getItem('accessToken')
    if (storedToken) {
      setAccessToken(storedToken)
      console.log('Properties Context accessToken Set')
    }
  }, [])

  // Function for getting properties
  const getProperties = (params, successCallback, errorCallback) => {
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get('https://api.pm.manages.homes/properties', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
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

  // get all properties and all its data
  const getAllProperties = (params, successCallback, errorCallback) => {
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get('https://api.pm.manages.homes/properties/all', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params
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

  // Function for getting a single property
  const getProperty = (id, successCallback, errorCallback) => {
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get(`https://api.pm.manages.homes/properties/${id}/all`, {
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

  // Function for adding a property
  const addProperties = (data, successCallback, errorCallback) => {
    // Renamed function
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .post('https://api.pm.manages.homes/properties', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
          console.log(properties)
          setProperties(prevProperties => [...(prevProperties.data || []), response.data])
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  //function for adding units
  const addUnits = (data, successCallback, errorCallback) => {
    // Renamed function
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .post('https://api.pm.manages.homes/properties/units', data, {
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

  const editUnits = (data, successCallback, errorCallback) => {
    // Renamed function
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .put('https://api.pm.manages.homes/properties/units', data, {
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

  const editProperties = (data, successCallback, errorCallback) => {
    // Renamed function
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .put('https://api.pm.manages.homes/properties', data, {
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

  const addMaintenanceRequests = (data, successCallback, errorCallback) => {
    // Renamed function
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .post('https://api.pm.manages.homes/properties/maintenance-requests', data, {
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
    properties,
    property,
    setProperty,
    setProperties,
    addProperties, // Updated function name
    addMaintenanceRequests,
    addUnits,
    editUnits,
    editProperties,
    loading,
    setLoading,
    setAccessToken,
    accessToken,
    getProperties,
    getAllProperties,
    getProperty
  }

  return <PropertiesContext.Provider value={values}>{children}</PropertiesContext.Provider>
}

export { PropertiesContext, PropertiesProvider }

