// ** Third Party Imports
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useFinance } from 'src/hooks/useFinance'
import PreviewCardById from 'src/views/apps/invoice/preview/PreviewCardById'

// ** Demo Components Imports

const InvoicePreview = () => {
  const [invoiceData, setInvoiceData] = useState(null)
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

          setInvoiceData(data)
          console.log('FROM invoices single PAGE:', responseData)
          if (responseData?.status === 'FAILED') {
            alert(responseData.message || 'Failed to fetch invoices')
          }
        },
        error => {
          console.log(id)

          toast.error(error.response.data?.description || 'An error occurred. Please try again or contact support.', {
            duration: 5000
          })
        }
      )
    }
  }, [])

  return <PreviewCardById id={id} setInvoiceData={setInvoiceData} invoiceData={invoiceData} />
}

export default InvoicePreview
