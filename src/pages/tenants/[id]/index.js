// ** MUI Imports
import Grid from '@mui/material/Grid'
import axios from 'axios'
import { useEffect, useState } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useTenants } from 'src/hooks/useTenants'
import TenantEditInfo from 'src/ui/tenant/TenantEditInfo'
import { useRouter } from 'next/router'

const TenantEdit = () => {
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
          console.log('FROM INDEX PAGE:', data)

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

  return (
    <Grid>
      {console.log(tenants)}
      <TenantEditInfo tenantData={tenantData} tab={'account'} invoiceData={tenantData}></TenantEditInfo>
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
