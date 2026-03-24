import { useContext } from 'react'
import { CommunicationContext } from 'src/context/CommunicationContext'

export const useCommunication = () => useContext(CommunicationContext)
