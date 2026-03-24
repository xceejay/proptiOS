import { useContext } from 'react'
import { TenantsContext as TenantsContext } from 'src/context/TenantsContext'

export const useTenants = () => useContext(TenantsContext)
