import { useContext } from 'react'
import { FinancialContext } from 'src/context/FinancialContext'

export const useFinancial = () => useContext(FinancialContext)
