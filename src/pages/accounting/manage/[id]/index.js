// ** MUI Imports
import Grid from '@mui/material/Grid'
import axios from 'src/pages/middleware/axios'
import { useEffect, useState } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import AccountingEditInfo from 'src/ui/accounting/AccountingEditInfo'
import { useRouter } from 'next/router'
import { useAccounting } from 'src/hooks/useAccounting'

const AccountingEdit = ({}) => {
  const router = useRouter()
  const [accountingData, setAccountingData] = useState(null)
  const { id } = router.query
  const { tab } = router.query || 'management'

  const accounting = useAccounting()
  useEffect(() => {
    if (id) {
      // Ensure id is defined before making the API call
      accounting.getAccounting(
        id,
        responseData => {
          console.log('called')
          let { data } = responseData
          setAccountingData(data)
          console.log('FROM INDEX PAGE:', responseData)

          if (responseData?.status === 'FAILED') {
            alert(responseData.message || 'Failed to fetch accounting')
          }
        },
        error => {
          console.log(id)
          console.error('FROM INDEX PAGE:', error)
        }
      )
    }
  }, [accountingData])

  return (
    <Grid>
      <AccountingEditInfo
        tab={tab}
        setAccountingData={setAccountingData}
        accountingData={accountingData}
      ></AccountingEditInfo>
    </Grid>
  )
}

// export async function getServerSideProps(params) {
//   const res = await axios.get('https://api.pm.manages.homes/apps/invoice/invoices')
//   const invoiceData = res.data.allData

//   return {
//     props: {
//       invoiceData
//     }
//   }
// }

export default AccountingEdit
