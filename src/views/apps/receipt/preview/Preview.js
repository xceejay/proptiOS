// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'

// ** Third Party Components
import axios from 'axios'

// ** Demo Components Imports
import PreviewCard from 'src/views/apps/receipt/preview/PreviewCard'
import PreviewActions from 'src/views/apps/receipt/preview/PreviewActions'
import AddPaymentDrawer from 'src/views/apps/receipt/shared-drawer/AddPaymentDrawer'
import SendReceiptDrawer from 'src/views/apps/receipt/shared-drawer/SendReceiptDrawer'

const ReceiptPreview = ({ id }) => {
  // ** State
  const [error, setError] = useState(false)
  const [data, setData] = useState(null)
  const [addPaymentOpen, setAddPaymentOpen] = useState(false)
  const [sendReceiptOpen, setSendReceiptOpen] = useState(false)
  useEffect(() => {
    // axios
    //   .get('/apps/receipt/single-receipt', { params: { id } })
    //   .then(res => {
    //     setData(res.data)
    //     setError(false)
    //   })
    //   .catch(() => {
    //     setData(null)
    //     setError(true)
    //   })
  }, [id])
  const toggleSendReceiptDrawer = () => setSendReceiptOpen(!sendReceiptOpen)
  const toggleAddPaymentDrawer = () => setAddPaymentOpen(!addPaymentOpen)
  if (data) {
    return (
      <>
        <Grid container spacing={6}>
          <Grid item xl={9} md={8} xs={12}>
            <PreviewCard data={data} />
          </Grid>
          <Grid item xl={3} md={4} xs={12}>
            <PreviewActions
              id={id}
              toggleAddPaymentDrawer={toggleAddPaymentDrawer}
              toggleSendReceiptDrawer={toggleSendReceiptDrawer}
            />
          </Grid>
        </Grid>
        <SendReceiptDrawer open={sendReceiptOpen} toggle={toggleSendReceiptDrawer} />
        <AddPaymentDrawer open={addPaymentOpen} toggle={toggleAddPaymentDrawer} />
      </>
    )
  } else if (error) {
    return (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='error'>
            Receipt with the id: {id} does not exist. Please check the list of receipts:{' '}
            <Link href='/leases'>Receipt List</Link>
          </Alert>
        </Grid>
      </Grid>
    )
  } else {
    return null
  }
}

export default ReceiptPreview
