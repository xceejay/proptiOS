// ** MUI Imports
import Grid from '@mui/material/Grid'
import axios from 'axios'
import { useEffect } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useTenants } from 'src/hooks/useTenants'
import TenantEditInfo from 'src/ui/tenant/TenantEditInfo'

const TenantEdit = () => {
  useEffect(() => {
    // tenants.getTenants(
    //   { page: 1, limit: 2 },
    //   responseData => {
    //     console.log('called')
    //     let { response } = responseData
    //     console.log(response?.data)
    //     if (response?.status === 'FAILED') {
    //       alert(response.message || 'Failed to fetch tenants')
    //       return
    //     }
    //     setTenantsData(response)
    //     console.log('Tenants Retrieved:', response)
    //   },
    //   error => {
    //     console.error('Tenants Cannot be retrieved:', error)
    //   }
    // )
  }, [])

  const tenants = useTenants()

  return (
    <Grid>
      {console.log(tenants)}
      <TenantEditInfo tab={'account'} invoiceData={tenants?.tenants?.data?.items[0]}></TenantEditInfo>
    </Grid>
  )
}

// export const getServerSideProps = async ({ params }) => {
//   // const res = await axios.get('https://api.pm.manages.homes/apps/invoice/invoices')
//   // const invoiceData = res.data.allData
//   // return {
//   //   props: {
//   //     invoiceData
//   //   }
//   // }
// }

export default TenantEdit
