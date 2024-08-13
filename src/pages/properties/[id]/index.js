// ** MUI Imports
import Grid from '@mui/material/Grid'
import axios from 'axios'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import PropertyEditInfo from 'src/ui/property/PropertyEditInfo'

const PropertyEdit = ({ invoiceData }) => {
  return (
    <Grid>
      <PropertyEditInfo tab={'overview'} invoiceData={invoiceData}></PropertyEditInfo>
    </Grid>
  )
}

export async function getServerSideProps(params) {
  const res = await axios.get('https://api.pm.manages.homes/apps/invoice/invoices')
  const invoiceData = res.data.allData

  return {
    props: {
      invoiceData
    }
  }
}

export default PropertyEdit
