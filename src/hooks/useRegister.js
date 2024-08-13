import { useContext } from 'react'
import { RegisterContext as RegisterContext } from 'src/context/RegisterContext'

export const useRegister = () => useContext(RegisterContext)
