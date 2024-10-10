// ** MUI Imports
import Grid from '@mui/material/Grid'
import axios from 'src/pages/middleware/axios'
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

          if (data?.status === 'NO_RES') {
            console.log('NO results')
          } else if (data?.status === 'FAILED') {
            alert(data.message || 'Failed to fetch tenants')

            return
          }

          // setTenantsData(response)
        },
        error => {
          console.log(id)

          toast.error(error.response.data.description, {
            duration: 5000
          })
        }
      )
    }
  }, [id, tenants])

  return (
    <Grid>
      {console.log(tenants)}
      <TenantEditInfo tenantData={tenantData} tab={'details'}></TenantEditInfo>
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
