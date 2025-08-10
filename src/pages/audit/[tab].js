import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAudit } from 'src/hooks/useAudit'
import ParentAuditEditInfo from 'src/ui/audit/ParentAuditEditInfo'

const AuditTab = ({ invoiceData }) => {
  const router = useRouter()
  const { id } = router.query
  const { tab } = router.query
  const audit = useAudit()
  const [auditData, setAuditData] = useState(null)

  useEffect(() => {
    if (id) {
      // Ensure id is defined before making the API call
      audit.getAudit(
        id,
        responseData => {
          console.log('called')
          let { data } = responseData
          setAuditData(data)
          console.log('FROM INDEX PAGE:', responseData)

          if (responseData?.status === 'FAILED') {
            alert(responseData.message || 'Failed to fetch audit')
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
  }, [id, tab])

  return <ParentAuditEditInfo tab={tab} setAuditData={setAuditData} auditData={auditData} />
}

export default AuditTab
