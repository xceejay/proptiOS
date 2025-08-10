// ** Demo Components Imports
// import Preview from 'src/views/apps/receipt/preview/Preview'
import { useState } from 'react'
import { useFinance } from 'src/hooks/useFinance'
import PreviewCard from 'src/views/apps/receipt/preview/PreviewCard'

const ReceiptPreview = ({ id }) => {
  const [receiptData, setReceiptData] = useState(null)
  const finance = useFinance()
  // useEffect(() => {
  //   if (id) {
  //     // Ensure id is defined before making the API call
  //     receipts.getReceipt(
  //       id,
  //       responseData => {
  //         console.log('called')
  //         let { data } = responseData
  //         setReceiptData(data)
  //         console.log('FROM receipts single PAGE:', responseData)

  //         if (responseData?.status === 'FAILED') {
  //           alert(responseData.message || 'Failed to fetch receipts')
  //         }
  //       },
  //       error => {
  //         console.log(id)
  //
  toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
    duration: 5000
  })
  //       }
  //     )
  //   }
  // }, [receiptData])

  return <PreviewCard id={id} />
}

export default ReceiptPreview
