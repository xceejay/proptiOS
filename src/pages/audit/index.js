import { useState } from 'react'

import { useRouter } from 'next/router'
import ParentAuditEditInfo from 'src/ui/audit/ParentAuditEditInfo'

const AuditPage = () => {
  const router = useRouter
  const tab = router.query?.tab || 'manage'
  const [auditData, setAuditData] = useState(null)

  return <ParentAuditEditInfo tab={tab} auditData={auditData} />
}
AuditPage.acl = { action: 'read', subject: 'audit' }

export default AuditPage
