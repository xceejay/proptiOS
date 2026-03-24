// ** Third Party Imports
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'
import { useFinance } from 'src/hooks/useFinance'
import PreviewCardById from 'src/views/apps/invoice/preview/PreviewCardById'
import Spinner from 'src/@core/components/spinner'
import { normalizeTransactionPreview } from 'src/ui/finance/financeTransactionPreviewModel'

// ** Demo Components Imports

const InvoicePreview = () => {
  const [invoiceData, setInvoiceData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const finance = useFinance()
  const router = useRouter()
  const { id } = router.query
  useEffect(() => {
    if (id) {
      setLoading(true)
      setErrorMessage('')
      setInvoiceData(null)
      finance.getTransaction(
        id,
        responseData => {
          const normalizedInvoice = normalizeTransactionPreview(responseData?.data?.data || responseData?.data)

          if (responseData?.data?.status === 'FAILED' || !normalizedInvoice) {
            setErrorMessage(responseData?.data?.message || 'Failed to fetch invoice')
          } else {
            setInvoiceData(normalizedInvoice)
          }
          setLoading(false)
        },
        error => {
          const nextErrorMessage =
            error.response?.data?.description || 'An error occurred. Please try again or contact support.'
          setErrorMessage(nextErrorMessage)
          toast.error(nextErrorMessage, { duration: 5000 })
          setLoading(false)
        }
      )
    }
  }, [finance, id])

  if (loading) {
    return <Spinner />
  }

  if (errorMessage) {
    return (
      <Box sx={{ p: 6 }}>
        <Typography color='error'>{errorMessage}</Typography>
      </Box>
    )
  }

  if (!invoiceData) {
    return (
      <Box sx={{ p: 6 }}>
        <Typography>No invoice found.</Typography>
      </Box>
    )
  }

  return <PreviewCardById id={id} setInvoiceData={setInvoiceData} invoiceData={invoiceData} />
}

export default InvoicePreview
