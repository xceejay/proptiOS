import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useTenants } from 'src/hooks/useTenants'
import TenantEditInfo from 'src/ui/tenant/TenantEditInfo'

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
          console.error('FROM INDEX PAGE:', error)
        }
      )
    }
  }, [id, tab])

  return <TenantEditInfo tab={tab} setTenantData={setTenantData} tenantData={tenantData} />
}

export default TenantTab
