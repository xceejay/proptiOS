// ** Demo Components Imports
// import Preview from 'src/views/apps/invoice/preview/Preview'
import { useEffect, useState } from 'react'
import { useInvoices } from 'src/hooks/useInvoices'
import PreviewCard from 'src/views/apps/invoice/preview/PreviewCard'

const InvoicePreview = ({ id }) => {
  const [invoiceData, setInvoiceData] = useState(null)
  const invoices = useInvoices()
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
  //         console.error('FROM INDEX PAGE:', error)
  //       }
  //     )
  //   }
  // }, [invoiceData])

  return <PreviewCard id={id} />
}

export default InvoicePreview
