import { useContext } from 'react'
import { ReportsContext } from 'src/context/ReportsContext'

export const useReports = () => useContext(ReportsContext)
