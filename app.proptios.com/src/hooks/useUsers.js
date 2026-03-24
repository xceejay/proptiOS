import { useContext } from 'react'
import { UsersContext as UsersContext } from 'src/context/UsersContext'

export const useUsers = () => useContext(UsersContext)
