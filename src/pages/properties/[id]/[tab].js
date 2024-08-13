// ** Third Party Imports
import axios from 'axios'
import PropertyEditInfo from 'src/ui/property/PropertyEditInfo'

// ** Demo Components Imports

const UserView = ({ tab, invoiceData }) => {
  return <PropertyEditInfo tab={tab} invoiceData={invoiceData} />
}

export async function getServerSideProps(params) {
  const res = await axios.get('https://api.pm.manages.homes/apps/invoice/invoices')
  const invoiceData = res.data.allData

  return {
    props: {
      invoiceData,
      tab: params?.query.tab
    }
  }
}

export default UserView
