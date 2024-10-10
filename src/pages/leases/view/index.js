// ** Demo Components Imports
// import Preview from 'src/views/apps/lease/preview/Preview'
import { useEffect, useState } from 'react'
import { useLeases } from 'src/hooks/useLeases'
import PreviewCard from 'src/views/apps/lease/preview/PreviewCard'

const LeasePreview = ({ id }) => {
  const [leaseData, setLeaseData] = useState(null)
  const leases = useLeases()
  // useEffect(() => {
  //   if (id) {
  //     // Ensure id is defined before making the API call
  //     leases.getLease(
  //       id,
  //       responseData => {
  //         console.log('called')
  //         let { data } = responseData
  //         setLeaseData(data)
  //         console.log('FROM leases single PAGE:', responseData)

  //         if (responseData?.status === 'FAILED') {
  //           alert(responseData.message || 'Failed to fetch leases')
  //         }
  //       },
  //       error => {
  //         console.log(id)
  //
  toast.error(error.response.data.description, {
    duration: 5000
  })
  //       }
  //     )
  //   }
  // }, [leaseData])

  return <PreviewCard id={id} />
}

export default LeasePreview
