import { useContext } from 'react'
import { SiteContext } from 'src/context/SiteContext'

export const useSite = () => useContext(SiteContext)
