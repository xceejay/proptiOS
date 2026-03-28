import { useRouter } from 'next/router'
import ParentCommunicationEditInfo from 'src/ui/communication/ParentCommunicationEditInfo'

const CommunicationPage = () => {
  const router = useRouter()
  const tab = router.query?.tab || 'issues'

  return <ParentCommunicationEditInfo tab={tab} communicationData={null} />
}
CommunicationPage.acl = { action: 'read', subject: 'communication' }

export default CommunicationPage
