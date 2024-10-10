import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'

import { useRouter } from 'next/router'
import ParentPropertyEditInfo from 'src/ui/property/ParentPropertyEditInfo'

const PropertiesTab = () => {
  const router = useRouter()
  const { tab } = router.query
  const [propertiesData, setPropertiesData] = useState(null)

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
  toast.error(error.response.data.description, {
    duration: 5000
  })
  //       }
  //     )
  //   }
  // }, [id])

  return <ParentPropertyEditInfo tab={tab} propertiesData={propertiesData} />
}

export default PropertiesTab
