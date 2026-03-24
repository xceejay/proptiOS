// ** Third Party Imports
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'
import { useFinance } from 'src/hooks/useFinance'
import MaintenanceReceipt from 'src/views/apps/receipt/preview/MaintenanceReceipt'
import RentPaymentReceipt from 'src/views/apps/receipt/preview/RentPaymentReceipt'
import Spinner from 'src/@core/components/spinner'
import { Grid } from '@mui/material'
import SendReceiptDrawer from 'src/views/apps/receipt/shared-drawer/SendReceiptDrawer'
import AddPaymentDrawer from 'src/views/apps/receipt/shared-drawer/AddPaymentDrawer'

import PreviewActions from 'src/views/apps/receipt/preview/PreviewActions'
import { normalizeTransactionPreview } from 'src/ui/finance/financeTransactionPreviewModel'

// ** Demo Components Imports

const ReceiptPreview = () => {
  const [receiptData, setReceiptData] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const finance = useFinance()
  const router = useRouter()
  const { id } = router.query
  const [addPaymentOpen, setAddPaymentOpen] = useState(false)
  const [sendReceiptOpen, setSendReceiptOpen] = useState(false)

  const toggleSendReceiptDrawer = () => setSendReceiptOpen(!sendReceiptOpen)
  const toggleAddPaymentDrawer = () => setAddPaymentOpen(!addPaymentOpen)
  useEffect(() => {
    if (id) {
      setLoading(true)
      setErrorMessage('')
      setReceiptData(null)
      finance.getTransaction(
        id,
        responseData => {
          const normalizedReceipt = normalizeTransactionPreview(responseData?.data?.data || responseData?.data)

          if (responseData?.data?.status === 'FAILED' || !normalizedReceipt) {
            setErrorMessage(responseData?.data?.message || 'Failed to fetch receipt')
          } else {
            setReceiptData(normalizedReceipt)
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

  if (loading) return <Spinner></Spinner>
  if (errorMessage) {
    return (
      <Box sx={{ p: 6 }}>
        <Typography color='error'>{errorMessage}</Typography>
      </Box>
    )
  }
  if (!receiptData) {
    return (
      <Box sx={{ p: 6 }}>
        <Typography>No receipt found.</Typography>
      </Box>
    )
  }
  return (
    <>
      {receiptData.payment_type === 'rent' ? (
        <>
          <Grid container spacing={6}>
            <Grid
              size={{
                xl: 9,
                md: 8,
                xs: 12
              }}>
              <RentPaymentReceipt id={id} setReceiptData={setReceiptData} receiptData={receiptData} />
            </Grid>
            <Grid
              size={{
                xl: 3,
                md: 4,
                xs: 12
              }}>
              <PreviewActions
                id={id}
                toggleAddPaymentDrawer={toggleAddPaymentDrawer}
                toggleSendReceiptDrawer={toggleSendReceiptDrawer}
              />{' '}
            </Grid>
          </Grid>
          <SendReceiptDrawer open={sendReceiptOpen} toggle={toggleSendReceiptDrawer} />
          <AddPaymentDrawer open={addPaymentOpen} toggle={toggleAddPaymentDrawer} />
        </>
      ) : receiptData.payment_type === 'maintenance' ? (
        <MaintenanceReceipt id={id} setReceiptData={setReceiptData} receiptData={receiptData} />
      ) : (
        <Box sx={{ p: 6 }}>
          <Typography>Unsupported receipt type.</Typography>
        </Box>
      )}
    </>
  )
}

export default ReceiptPreview
