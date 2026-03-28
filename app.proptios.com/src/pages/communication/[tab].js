import { useRouter } from 'next/router'
import ParentCommunicationEditInfo from 'src/ui/communication/ParentCommunicationEditInfo'

const CommunicationTabPage = () => {
  const router = useRouter()
  const tab = router.query?.tab || 'issues'

  return <ParentCommunicationEditInfo tab={tab} communicationData={null} />
}

CommunicationTabPage.acl = { action: 'read', subject: 'communication' }

export default CommunicationTabPage
