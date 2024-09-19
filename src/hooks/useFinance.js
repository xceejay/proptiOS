import { useContext } from 'react'
import { FinanceContext } from 'src/context/FinanceContext'

export const useFinance = () => useContext(FinanceContext)
