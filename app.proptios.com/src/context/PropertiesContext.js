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
  setLoading: () => {},
  getAllProperties: () => Promise.resolve(),
  getProperties: () => Promise.resolve(),
  getProperty: () => Promise.resolve(),
  addProperties: () => Promise.resolve(),
  addMaintenanceRequests: () => Promise.resolve(),
  addUnits: () => Promise.resolve(),
  editUnits: () => Promise.resolve(),
  editProperties: () => Promise.resolve(),
  deleteUnits: () => Promise.resolve(),
  deleteProperties: () => Promise.resolve(),
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
    const storedToken = getStoredAccessToken()
    if (storedToken) {
      setAccessToken(storedToken)
      console.log('Properties Context accessToken Set')
    }
  }, [])

  // Function for getting properties
  const getProperties = (params, successCallback, errorCallback) => {
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + '/properties', {
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
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + '/properties/all', {
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
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get(process.env.NEXT_PUBLIC_API_BASE_URL + `/properties/${id}/all`, {
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
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .post(process.env.NEXT_PUBLIC_API_BASE_URL + '/properties', data, {
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

  // Function for deleting a property
  const deleteProperties = (id, successCallback, errorCallback) => {
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .delete(process.env.NEXT_PUBLIC_API_BASE_URL + `/properties/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        if (successCallback) {
          successCallback(response.data)
          setProperties(prevProperties => {
            if (Array.isArray(prevProperties)) {
              return prevProperties.filter(property => property.id !== id)
            }
            if (prevProperties && Array.isArray(prevProperties.data)) {
              return { ...prevProperties, data: prevProperties.data.filter(property => property.id !== id) }
            }

            return prevProperties
          })
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  // Function for adding units
  const addUnits = (data, successCallback, errorCallback) => {
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .post(process.env.NEXT_PUBLIC_API_BASE_URL + '/properties/units', data, {
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

  // Function for deleting units
  const deleteUnits = (id, successCallback, errorCallback) => {
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .delete(process.env.NEXT_PUBLIC_API_BASE_URL + `/properties/units/${id}`, {
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
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .put(process.env.NEXT_PUBLIC_API_BASE_URL + '/properties/units', data, {
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
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .put(process.env.NEXT_PUBLIC_API_BASE_URL + '/properties', data, {
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
    const token = getStoredAccessToken() || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .post(process.env.NEXT_PUBLIC_API_BASE_URL + '/properties/maintenance-requests', data, {
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
    addProperties,
    deleteProperties,
    addMaintenanceRequests,
    addUnits,
    deleteUnits,
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
