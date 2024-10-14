import { useContext } from 'react'
import { AuditContext } from 'src/context/AuditContext'

export const useAudit = () => useContext(AuditContext)
