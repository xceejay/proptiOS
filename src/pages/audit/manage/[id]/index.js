// ** MUI Imports
import Grid from '@mui/material/Grid'
import axios from 'src/pages/middleware/axios'
import { useEffect, useState } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useAudit } from 'src/hooks/useAudit'
import AuditEditInfo from 'src/ui/audit/AuditEditInfo'
import { useRouter } from 'next/router'

const AuditEdit = () => {
  const router = useRouter()
  const { id } = router.query
  const audit = useAudit()
  const [auditData, setAuditData] = useState()

  useEffect(() => {
    if (id) {
      // Ensure id is defined before making the API call

      audit.getAudit(
        id,
        responseData => {
          console.log('called')
          let { data } = responseData
          setAuditData(data)
          console.log('FROM INDEX PAGE:', data)

          if (data?.status === 'NO_RES') {
            console.log('NO results')
          } else if (data?.status === 'FAILED') {
            alert(data.message || 'Failed to fetch audit')

            return
          }

          // setAuditData(response)
        },
        error => {
          console.log(id)

          toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
            duration: 5000
          })
        }
      )
    }
  }, [id, audit])

  return (
    <Grid>
      {console.log(audit)}
      <AuditEditInfo auditData={auditData} tab={'details'}></AuditEditInfo>
    </Grid>
  )
}

// export const getServerSideProps = async ({ params }) => {
//   // const res = await axios.get(process.env.API_BASE_URL + '/apps/invoice/invoices')
//   // const invoiceData = res.data.allData
//   // return {
//   //   props: {
//   //     invoiceData
//   //   }
//   // }
// }

export default AuditEdit
