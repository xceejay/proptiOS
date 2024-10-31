import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import ParentCommunicationEditInfo from 'src/ui/communication/ParentCommunicationEditInfo'

const CommunicationPage = () => {
  const router = useRouter
  const tab = router.query?.tab || 'issues'
  const [communicationData, setCommunicationData] = useState(null)

  return <ParentCommunicationEditInfo tab={tab} communicationData={communicationData} />
}
CommunicationPage.acl = { action: 'read', subject: 'communication' }

export default CommunicationPage
