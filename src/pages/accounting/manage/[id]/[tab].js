import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useAccounting } from 'src/hooks/useAccounting'
import AccountingEditInfo from 'src/ui/accounting/AccountingEditInfo'

const UserView = ({ invoiceData }) => {
  const router = useRouter()
  const { id } = router.query
  const { tab } = router.query
  const accounting = useAccounting()
  const [accountingData, setAccountingData] = useState(null)

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
  }, [id, tab])

  return <AccountingEditInfo tab={tab} setAccountingData={setAccountingData} accountingData={accountingData} />
}

export default UserView
