// ** Third Party Imports
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useFinance } from 'src/hooks/useFinance'
import MaintenanceReceipt from 'src/views/apps/receipt/preview/MaintenanceReceipt'
import RentPaymentReceipt from 'src/views/apps/receipt/preview/RentPaymentReceipt'
import Spinner from 'src/@core/components/spinner'
import { Grid } from '@mui/material'
import EditActions from 'src/views/apps/receipt/edit/EditActions'
import SendReceiptDrawer from 'src/views/apps/receipt/shared-drawer/SendReceiptDrawer'
import AddPaymentDrawer from 'src/views/apps/receipt/shared-drawer/AddPaymentDrawer'

import PreviewActions from 'src/views/apps/receipt/preview/PreviewActions'

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

          toast.error(error.response.data.description, {
            duration: 5000
          })
        }
      )
    }
  }, [])

  if (!receiptData) return <Spinner></Spinner>
  return (
    <>
      {receiptData.payment_type === 'rent' ? (
        <>
          <Grid container spacing={6}>
            <Grid item xl={9} md={8} xs={12}>
              <RentPaymentReceipt id={id} setReceiptData={setReceiptData} receiptData={receiptData} />
            </Grid>
            <Grid item xl={3} md={4} xs={12}>
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
        <>No receipt</>
      )}
    </>
  )
}

export default ReceiptPreview
