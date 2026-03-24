// ** Third Party Imports
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLeases } from 'src/hooks/useLeases'
import PreviewCardById from 'src/views/apps/lease/preview/PreviewCardById'

// ** Demo Components Imports

const resolveLeasePayload = responseData => {
  const responsePayload = responseData?.data
  const nextLease = responsePayload?.data ?? responsePayload

  if (!nextLease || nextLease?.status === 'FAILED' || nextLease === 'NO_RES') {
    return null
  }

  return nextLease
}

const LeasePreview = () => {
  const [leaseData, setLeaseData] = useState(null)
  const leases = useLeases()
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (!id) {
      return
    }

    leases.getLease(
      id,
      responseData => {
        const nextLease = resolveLeasePayload(responseData)

        if (!nextLease) {
          toast.error(responseData?.data?.message || 'Failed to fetch lease', {
            duration: 5000
          })

          return
        }

        setLeaseData(nextLease)
      },
      error => {
        toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
      }
    )
  }, [id])

  return <PreviewCardById id={id} setLeaseData={setLeaseData} leaseData={leaseData} />
}

export default LeasePreview
