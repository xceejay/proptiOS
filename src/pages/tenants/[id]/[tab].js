// ** Third Party Imports
import axios from 'axios'
import TenantEditInfo from 'src/ui/tenant/TenantEditInfo'

// ** Demo Components Imports

const UserView = ({ tab, invoiceData }) => {
  const router = useRouter()
  const { id } = router.query
  const tenants = useTenants()
  const [tenantData, setTenantData] = useState()

  useEffect(() => {
    if (id) {
      // Ensure id is defined before making the API call

      tenants.getTenant(
        id,
        responseData => {
          console.log('called')
          let { data } = responseData
          setTenantData(data)
          console.log('FROM INDEX PAGE:', response)

          if (response?.status === 'FAILED') {
            alert(response.message || 'Failed to fetch tenants')

            return
          }

          // setTenantsData(response)
        },
        error => {
          console.log(id)
          console.error('FROM INDEX PAEG:', error)
        }
      )
    }
  }, [id])

  return <TenantEditInfo tab={tab} tenantData={tenantData} />
}

// export const getStaticPaths = () => {
//   return {
//     paths: [
//       { params: { tab: 'account' } },
//       { params: { tab: 'security' } },
//       { params: { tab: 'billing-plan' } },
//       { params: { tab: 'notification' } },
//       { params: { tab: 'connection' } }
//     ],
//     fallback: false
//   }
// }

// export async function getServerSideProps(params) {}

export default UserView
