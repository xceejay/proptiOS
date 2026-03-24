import { useContext } from 'react'
import { LeasesContext } from 'src/context/LeasesContext'

export const useLeases = () => useContext(LeasesContext)
