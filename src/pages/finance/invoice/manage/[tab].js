import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'
import InvoiceEditInfo from '../../../ui/invoice/InvoiceEditInfo'
import { useRouter } from 'next/router'

const InvoicesPage = () => {
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
  //         console.error('FROM INDEX PAGE:', error)
  //       }
  //     )
  //   }
  // }, [id])

  return <InvoiceEditInfo tab={tab} tenantData={tenantData} />
}

export default InvoicesPage
