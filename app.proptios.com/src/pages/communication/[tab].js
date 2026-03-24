import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useCommunication } from 'src/hooks/useCommunication'
import ParentCommunicationEditInfo from 'src/ui/communication/ParentCommunicationEditInfo'

const CommunicationTab = ({ invoiceData }) => {
  const router = useRouter()
  const { id } = router.query
  const { tab } = router.query
  const communication = useCommunication()
  const [communicationData, setCommunicationData] = useState(null)

  useEffect(() => {
    if (id) {
      // Ensure id is defined before making the API call
      communication.getCommunication(
        id,
        responseData => {
          console.log('called')
          let { data } = responseData
          setCommunicationData(data)
          console.log('FROM INDEX PAGE:', responseData)

          if (responseData?.status === 'FAILED') {
            alert(responseData.message || 'Failed to fetch communication')
          }
        },
        error => {
          console.log(id)

          toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
            duration: 5000
          })
        }
      )
    }
  }, [id, tab])

  return (
    <ParentCommunicationEditInfo
      tab={tab}
      setCommunicationData={setCommunicationData}
      communicationData={communicationData}
    />
  )
}

export default CommunicationTab
