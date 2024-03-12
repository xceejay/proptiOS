// ** Third Party Imports
import axios from 'axios'
import PropertyEditInfo from 'src/ui/property/PropertyEditInfo'

// ** Demo Components Imports

const UserView = ({ tab, invoiceData }) => {
  return <PropertyEditInfo tab={tab} invoiceData={invoiceData} />
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'account' } },
      { params: { tab: 'security' } },
      { params: { tab: 'billing-plan' } },
      { params: { tab: 'notification' } },
      { params: { tab: 'connection' } }
    ],
    fallback: false
  }
}

export async function getServerSideProps(params) {
  const res = await axios.get('/apps/invoice/invoices')
  const invoiceData = res.data.allData

  return {
    props: {
      invoiceData,
      tab: params?.tab
    }
  }
}

export default UserView
