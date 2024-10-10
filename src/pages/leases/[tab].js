import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'

import { useRouter } from 'next/router'
import ParentLeaseEditInfo from 'src/ui/lease/ParentLeaseEditInfo'
import toast from 'react-hot-toast'

const LeasesTab = () => {
  const router = useRouter()
  const { tab } = router.query
  const [leasesData, setLeasesData] = useState(null)

  // useEffect(() => {
  //   if (id) {
  //     // Ensure id is defined before making the API call
  //     tenants.getTenant(
  //       id,
  //       responseData => {
  //         console.log('called')
  //         let { data } = responseData
  //         setTenantData(data)
  //         console.log('FROM INDEX PAGE:', responseData)

  //         if (responseData?.status === 'FAILED') {
  //           alert(responseData.message || 'Failed to fetch tenants')
  //         }
  //       },
  //       error => {
  //         console.log(id)
  //
  // toast.error(error.response.data.description, {
  //   duration: 5000
  // })
  //       }
  //     )
  //   }
  // }, [id])

  return <ParentLeaseEditInfo tab={tab} leasesData={leasesData} />
}

export default LeasesTab
