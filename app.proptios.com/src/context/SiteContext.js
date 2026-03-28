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
  site: null,
  loading: true,
  setSite: () => null,
  setLoading: () => Boolean,
  getAllDashboard: () => Promise.resolve()
}
const SiteContext = createContext(defaultProvider)

const SiteProvider = ({ children }) => {
  // ** States
  const [site, setSite] = useState(defaultProvider.user)
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
  // }, [])

  //function for registering an account.
  const getAllDashboard = (params, successCallback, errorCallback) => {
    const token = getStoredAccessToken()

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
          setSite(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const values = {
    site,
    loading,
    setSite,
    setLoading,
    getAllDashboard: getAllDashboard
  }

  return <SiteContext.Provider value={values}>{children}</SiteContext.Provider>
}

export { SiteContext, SiteProvider }
