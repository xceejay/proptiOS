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
  audit: null,
  loading: true,
  setAudit: () => null,
  setLoading: () => Boolean,
  getAllAuditLogs: () => Promise.resolve()
}
const AuditContext = createContext(defaultProvider)

const AuditProvider = ({ children }) => {
  // ** States
  const [audit, setAudit] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    console.log('test')
  }, [])

  const getAllAuditLogs = (params, successCallback, errorCallback) => {
    const token = window.localStorage.getItem('accessToken') || accessToken

    if (!token) {
      const error = new Error('No access token found')
      if (errorCallback) errorCallback(error)

      return
    }

    axios
      .get(
        'https://api.pm.manages.homes/auditlogs',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        },
        params
      )
      .then(response => {
        if (successCallback) {
          alert(JSON.stringify(response))
          successCallback(response.data)
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const values = {
    audit,
    loading,
    setAudit,
    setLoading,
    getAllAuditLogs: getAllAuditLogs
  }

  return <AuditContext.Provider value={values}>{children}</AuditContext.Provider>
}

export { AuditContext, AuditProvider }
