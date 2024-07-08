import { useContext } from 'react'
import { AuthContext } from 'src/context/TenantContext'

export const useAuth = () => useContext(TenantContext)
