import { useContext } from 'react'
import { TenantContext } from 'src/context/TenantContext'

export const useTenant = () => useContext(TenantContext)
