// ** Third Party Imports
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useFinance } from 'src/hooks/useFinance'
import Spinner from 'src/@core/components/spinner'

import ReceiptPrint from 'src/views/apps/receipt/print/PrintPage'

// ** Demo Components Imports

const ReceiptPreview = () => {
  const [receiptData, setReceiptData] = useState(null)
  const finance = useFinance()
  const router = useRouter()
  const { id } = router.query
  const [addPaymentOpen, setAddPaymentOpen] = useState(false)
  const [sendReceiptOpen, setSendReceiptOpen] = useState(false)

  const toggleSendReceiptDrawer = () => setSendReceiptOpen(!sendReceiptOpen)
  const toggleAddPaymentDrawer = () => setAddPaymentOpen(!addPaymentOpen)
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

          toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
            duration: 5000
          })
        }
      )
    }
  }, [])

  if (!receiptData) return <Spinner></Spinner>
  return (
    <>
      {receiptData ? (
        <>
          <ReceiptPrint receiptData={receiptData}></ReceiptPrint>
        </>
      ) : (
        <>No receipt</>
      )}
    </>
  )
}

export default ReceiptPreview
