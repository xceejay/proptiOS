import { useRouter } from 'next/router'
// import { useSettings } from 'src/hooks/useSettings'
import ParentSettingsEditInfo from 'src/ui/settings/ParentSettingsEditInfo'

const SettingsTab = ({ invoiceData }) => {
  const router = useRouter()
  const { id } = router.query
  const { tab } = router.query
  // const settings = useSettings()
  // const [settingsData, setSettingsData] = useState(null)

  // useEffect(() => {
  //   if (id) {
  //     settings.getSettings(
  //       id,
  //       responseData => {
  //         console.log('called')
  //         let { data } = responseData
  //         setSettingsData(data)
  //         console.log('FROM INDEX PAGE:', responseData)

  //         if (responseData?.status === 'FAILED') {
  //           alert(responseData.message || 'Failed to fetch settings')
  //         }
  //       },
  //       error => {
  //         console.log(id)

  //         toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
  //           duration: 5000
  //         })
  //       }
  //     )
  //   }
  // }, [id, tab])

  return <ParentSettingsEditInfo tab={tab} setSettingsData={null} settingsData={null} />
}

export default SettingsTab
