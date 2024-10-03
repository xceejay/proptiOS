// ** Third Party Imports
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useInvoices } from 'src/hooks/useInvoices'
import PreviewCardById from 'src/views/apps/invoice/preview/PreviewCardById'

// ** Demo Components Imports

const InvoicePreview = () => {
  const [invoiceData, setInvoiceData] = useState(null)
  const invoices = useInvoices()
  const router = useRouter()
  const { id } = router.query
  useEffect(() => {
    if (id) {
      // Ensure id is defined before making the API call
      invoices.getInvoice(
        id,
        responseData => {
          console.log('called')
          let { data } = responseData
          setInvoiceData(data)
          console.log('FROM invoices single PAGE:', responseData)

          if (responseData?.status === 'FAILED') {
            alert(responseData.message || 'Failed to fetch invoices')
          }
        },
        error => {
          console.log(id)
          console.error('FROM invoice preview PAGE:', error)
        }
      )
    }
  }, [])

  return <PreviewCardById id={id} setInvoiceData={setInvoiceData} invoiceData={invoiceData} />
}

export default InvoicePreview
