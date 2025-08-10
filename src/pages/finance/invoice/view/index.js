// ** Demo Components Imports
// import Preview from 'src/views/apps/invoice/preview/Preview'
import { useState } from 'react'
import { useFinance } from 'src/hooks/useFinance'
import PreviewCard from 'src/views/apps/invoice/preview/PreviewCard'

const InvoicePreview = ({ id }) => {
  const [invoiceData, setInvoiceData] = useState(null)
  const finance = useFinance()
  // useEffect(() => {
  //   if (id) {
  //     // Ensure id is defined before making the API call
  //     invoices.getInvoice(
  //       id,
  //       responseData => {
  //         console.log('called')
  //         let { data } = responseData
  //         setInvoiceData(data)
  //         console.log('FROM invoices single PAGE:', responseData)

  //         if (responseData?.status === 'FAILED') {
  //           alert(responseData.message || 'Failed to fetch invoices')
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
  // }, [invoiceData])

  return <PreviewCard id={id} />
}

export default InvoicePreview
