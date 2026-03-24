import { useContext } from 'react'
import { PropertiesContext } from 'src/context/PropertiesContext'

export const useProperties = () => useContext(PropertiesContext)
