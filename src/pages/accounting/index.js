import { useState, useEffect } from 'react'

import { useRouter } from 'next/router'
import ParentAccountingEditInfo from 'src/ui/accounting/ParentAccountingEditInfo'
import { useAccounting } from 'src/hooks/useAccounting'

const AccountingPage = () => {
  const router = useRouter
  const tab = router.query?.tab || 'payments'
  const [accountingData, setAccountingData] = useState(null)
  const paginationModel = {}

  const [loading, setLoading] = useState(false)

  const accounting = useAccounting()
  useEffect(() => {
    if (!accountingData) {
      accounting.getAllAccounting(
        { page: paginationModel?.page || 0, limit: paginationModel?.pageSize || 0 },
        responseData => {
          const { data } = responseData

          if (data?.status === 'FAILED') {
            alert(response.message || 'Failed to fetch properties')
          } else {
            setAccountingData(data)
          }

          setLoading(false) // Stop loading when the request completes
        },
        error => {
          console.error('Accounting data cannot be retrieved:', error)
          setLoading(false) // Stop loading on error
        }
      )
    }
  }, [])

  return <ParentAccountingEditInfo tab={tab} accountingData={accountingData} setAccountingData={setAccountingData} />
}

export default AccountingPage
