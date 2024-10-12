import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'
import LeaseEditInfo from '../../../ui/lease/LeaseEditInfo'
import { useRouter } from 'next/router'

const LeasesPage = () => {
  const router = useRouter()
  const { tab } = router.query
  const [tenantData, setTenantData] = useState(null)

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
  toast.error(error.response.data?.description || 'An error occurred. Please try again or contact support.', {
    duration: 5000
  })
  //       }
  //     )
  //   }
  // }, [id])

  return <LeaseEditInfo tab={tab} tenantData={tenantData} />
}

export default LeasesPage
