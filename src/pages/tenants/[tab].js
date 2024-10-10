import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useTenants } from 'src/hooks/useTenants'
import ParentTenantEditInfo from 'src/ui/tenant/ParentTenantEditInfo'

const TenantTab = ({ invoiceData }) => {
  const router = useRouter()
  const { id } = router.query
  const { tab } = router.query
  const tenants = useTenants()
  const [tenantData, setTenantData] = useState(null)

  useEffect(() => {
    if (id) {
      // Ensure id is defined before making the API call
      tenants.getTenant(
        id,
        responseData => {
          console.log('called')
          let { data } = responseData
          setTenantData(data)
          console.log('FROM INDEX PAGE:', responseData)

          if (responseData?.status === 'FAILED') {
            alert(responseData.message || 'Failed to fetch tenants')
          }
        },
        error => {
          console.log(id)

          toast.error(error.response.data.description, {
            duration: 5000
          })
        }
      )
    }
  }, [id, tab])

  return <ParentTenantEditInfo tab={tab} setTenantData={setTenantData} tenantData={tenantData} />
}

export default TenantTab
