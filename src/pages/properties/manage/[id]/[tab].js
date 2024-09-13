import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useLeases } from 'src/hooks/useLeases'
import PropertyEditInfo from 'src/ui/lease/PropertyEditInfo'

const UserView = ({ invoiceData }) => {
  const router = useRouter()
  const { id } = router.query
  const { tab } = router.query
  const leases = useLeases()
  const [leaseData, setPropertyData] = useState(null)

  useEffect(() => {
    if (id) {
      // Ensure id is defined before making the API call
      leases.getProperty(
        id,
        responseData => {
          console.log('called')
          let { data } = responseData
          setPropertyData(data)
          console.log('FROM INDEX PAGE:', responseData)

          if (responseData?.status === 'FAILED') {
            alert(responseData.message || 'Failed to fetch leases')
          }
        },
        error => {
          console.log(id)
          console.error('FROM INDEX PAGE:', error)
        }
      )
    }
  }, [id, tab])

  return <PropertyEditInfo tab={tab} setPropertyData={setPropertyData} leaseData={leaseData} />
}

export default UserView
