// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import tenantConfig from 'src/configs/Tenant'

// ** Defaults
const defaultProvider = {
  tenants: null,
  tenant: null,
  loading: true,
  setTenants: () => null,
  setTenant: () => null,
  setLoading: () => Boolean,
  getTenants: () => Promise.resolve(),
  getTenant: () => Promise.resolve()
}
const TenantContext = createContext(defaultProvider)

const TenantProvider = ({ children }) => {
  // ** States

  const [tenant, setTenant] = useState(defaultProvider.user)
  const [tenants, setTenants] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initTenant = async () => {
      const storedToken = window.localStorage.getItem(tenantConfig.storageTokenKeyName)
      if (storedToken) {
        let userData = window.localStorage.getItem('userData')

        setLoading(false)
      } else {
        setLoading(false)
      }
    }
    initTenant()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getTenants = () => {
    setTenants('tenants')
  }

  const getTenant = () => {
    setTenant('tenant')
  }

  const values = {
    tenants,
    tenant,
    loading,
    setTenants,
    setTenant,
    setLoading,
    getTenants: getTenants,
    getTenant: getTenant
  }

  return <TenantContext.Provider value={values}>{children}</TenantContext.Provider>
}

export { TenantContext, TenantProvider }
