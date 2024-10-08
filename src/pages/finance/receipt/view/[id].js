// ** Third Party Imports
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useFinance } from 'src/hooks/useFinance'
import MaintenanceReceipt from 'src/views/apps/receipt/preview/MaintenanceReceipt'
import RentPaymentReceipt from 'src/views/apps/receipt/preview/RentPaymentReceipt'
import Spinner from 'src/@core/components/spinner'

// ** Demo Components Imports

const ReceiptPreview = () => {
  const [receiptData, setReceiptData] = useState(null)
  const finance = useFinance()
  const router = useRouter()
  const { id } = router.query
  useEffect(() => {
    if (id) {
      // Ensure id is defined before making the API call
      finance.getTransaction(
        id,
        responseData => {
          console.log('called')
          let { data } = responseData

          setReceiptData(data)
          console.log('FROM receipts single PAGE:', responseData)
          if (responseData?.status === 'FAILED') {
            alert(responseData.message || 'Failed to fetch receipts')
          }
        },
        error => {
          console.log(id)
          console.error('FROM receipt preview PAGE:', error)
        }
      )
    }
  }, [])

  if (!receiptData) return <Spinner></Spinner>
  return (
    <>
      {receiptData.payment_type === 'rent' ? (
        <RentPaymentReceipt id={id} setReceiptData={setReceiptData} receiptData={receiptData} />
      ) : receiptData.payment_type === 'maintenance' ? (
        <MaintenanceReceipt id={id} setReceiptData={setReceiptData} receiptData={receiptData} />
      ) : (
        <>No receipt</>
      )}
    </>
  )
}

export default ReceiptPreview
