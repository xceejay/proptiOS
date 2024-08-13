import { useContext } from 'react'
import { AccountingContext } from 'src/context/AccountingContext'

export const useAccounting = () => useContext(AccountingContext)
