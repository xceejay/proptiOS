import { useState, useEffect } from 'react'

import { useRouter } from 'next/router'
import ParentFinanceEditInfo from 'src/ui/finance/ParentFinanceEditInfo'
import { useFinance } from 'src/hooks/useFinance'

const FinancePage = () => {
  const router = useRouter
  const tab = router.query?.tab || 'payments'
  const [financeData, setFinanceData] = useState(null)
  const paginationModel = {}

  const [loading, setLoading] = useState(false)

  const finance = useFinance()
  useEffect(() => {
    if (!financeData) {
      finance.getAllFinance(
        { page: paginationModel?.page || 0, limit: paginationModel?.pageSize || 0 },
        responseData => {
          const { data } = responseData

          if (data?.status === 'NO_RES') {
            console.log('NO results')
          } else if (data?.status === 'FAILED') {
            alert(response.message || 'Failed to fetch properties')
          } else {
            setFinanceData(data)
          }

          setLoading(false) // Stop loading when the request completes
        },
        error => {
          toast.error(error.response.data.description, {
            duration: 5000
          })
          setLoading(false) // Stop loading on error
        }
      )
    }
  }, [])

  return <ParentFinanceEditInfo tab={tab} financeData={financeData} setFinanceData={setFinanceData} />
}

export default FinancePage
