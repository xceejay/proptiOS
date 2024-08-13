import { useContext } from 'react'
import { MaintenanceContext } from 'src/context/MaintenanceContext'

export const useMaintenance = () => useContext(MaintenanceContext)
