// ** Third Party Imports
import axios from 'axios'
import TenantEditInfo from 'src/ui/tenant/TenantEditInfo'

// ** Demo Components Imports

const UserView = ({ tab, invoiceData }) => {
  return <TenantEditInfo tab={tab} invoiceData={invoiceData} />
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

export async function getServerSideProps(params) {
  const res = await axios.get('http://api.pm.manages.homes/apps/invoice/invoices')
  const invoiceData = res.data.allData

  return {
    props: {
      invoiceData,
      tab: params?.query.tab
    }
  }
}

export default UserView
