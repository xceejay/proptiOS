// ** Third Party Imports
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useLeases } from 'src/hooks/useLeases'
import PreviewCardById from 'src/views/apps/lease/preview/PreviewCardById'

// ** Demo Components Imports

const LeasePreview = () => {
  const [leaseData, setLeaseData] = useState(null)
  const leases = useLeases()
  const router = useRouter()
  const { id } = router.query
  useEffect(() => {
    if (id) {
      // Ensure id is defined before making the API call
      leases.getLease(
        id,
        responseData => {
          console.log('called')
          let { data } = responseData
          setLeaseData(data)
          console.log('FROM leases single PAGE:', responseData)

          if (responseData?.status === 'FAILED') {
            alert(responseData.message || 'Failed to fetch leases')
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
  }, [])

  return <PreviewCardById id={id} setLeaseData={setLeaseData} leaseData={leaseData} />
}

export default LeasePreview
