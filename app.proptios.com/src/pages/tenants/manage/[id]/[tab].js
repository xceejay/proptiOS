import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useTenants } from 'src/hooks/useTenants'
import TenantEditInfo from 'src/ui/tenant/TenantEditInfo'
import toast from 'react-hot-toast'

const UserView = () => {
  const router = useRouter()
  const { id } = router.query
  const { tab } = router.query
  const tenants = useTenants()
  const [tenantData, setTenantData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (id) {
      setLoading(true)
      setNotFound(false)
      tenants.getTenant(
        id,
        responseData => {
          let { data } = responseData
          setLoading(false)

          if (responseData?.status === 'FAILED' || responseData?.status === 'NO_RES' || !data?.id) {
            setNotFound(true)

            return
          }

          setTenantData(data)
        },
        error => {
          setLoading(false)
          setNotFound(true)
          toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
            duration: 5000
          })
        }
      )
    }
  }, [id, tab])

  return <TenantEditInfo tab={tab} setTenantData={setTenantData} tenantData={tenantData} loading={loading} notFound={notFound} />
}

export default UserView
