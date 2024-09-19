import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import ParentFinancialEditInfo from 'src/ui/financial/ParentFinancialEditInfo'
import { useFinancial } from 'src/hooks/useFinancial'

const FinancialTab = () => {
  const router = useRouter()
  const { tab } = router.query
  const [financialData, setFinancialData] = useState(null)
  const paginationModel = {}
  const [loading, setLoading] = useState(false)

  const financial = useFinancial()
  useEffect(() => {
    if (!financialData) {
      financial.getAllFinancial(
        { page: paginationModel?.page || 0, limit: paginationModel?.pageSize || 0 },
        responseData => {
          const { data } = responseData

          if (data?.status === 'FAILED') {
            alert(response.message || 'Failed to fetch properties')
          } else {
            setFinancialData(data)
          }

          setLoading(false) // Stop loading when the request completes
        },
        error => {
          console.error('Financial data cannot be retrieved:', error)
          setLoading(false) // Stop loading on error
        }
      )
    }
  }, [])

  return <ParentFinancialEditInfo tab={tab} setFinancialData={setFinancialData} financialData={financialData} />
}

export default FinancialTab
