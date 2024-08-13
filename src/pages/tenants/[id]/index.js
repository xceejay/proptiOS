// ** MUI Imports
import Grid from '@mui/material/Grid'
import axios from 'axios'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import TenantEditInfo from 'src/ui/tenant/TenantEditInfo'

const TenantEdit = ({ invoiceData }) => {
  return (
    <Grid>
      <TenantEditInfo tab={'account'} invoiceData={invoiceData}></TenantEditInfo>
    </Grid>
  )
}

export const getServerSideProps = async ({ params }) => {
  const res = await axios.get('https://api.pm.manages.homes/apps/invoice/invoices')
  const invoiceData = res.data.allData

  return {
    props: {
      invoiceData
    }
  }
}

export default TenantEdit
