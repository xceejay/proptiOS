// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const PreviewActions = ({ id, toggleSendReceiptDrawer, toggleAddPaymentDrawer }) => {
  return (
    <Card>
      <CardContent>
        <Button
          size='small'
          fullWidth
          variant='contained'
          onClick={toggleSendReceiptDrawer}
          sx={{ mb: 2, '& svg': { mr: 2 } }}
        >
          <Icon fontSize='14px' icon='tabler:send' />
          Send Receipt
        </Button>
        <Button size='small' fullWidth sx={{ mb: 2 }} color='secondary' variant='outlined'>
          Download
        </Button>
        <Button
          fullWidth
          sx={{ mb: 2 }}
          target='_blank'
          component={Link}
          color='secondary'
          variant='outlined'
          href={`/apps/receipt/print/${id}`}
        >
          Print
        </Button>
        <Button
          fullWidth
          sx={{ mb: 2 }}
          component={Link}
          color='secondary'
          variant='outlined'
          href={`/apps/receipt/edit/${id}`}
        >
          Edit Receipt
        </Button>
        <Button size='small' fullWidth variant='contained' sx={{ '& svg': { mr: 2 } }} onClick={toggleAddPaymentDrawer}>
          <Icon fontSize='14px' icon='tabler:currency-dollar' />
          Add Payment
        </Button>
      </CardContent>
    </Card>
  )
}

export default PreviewActions
