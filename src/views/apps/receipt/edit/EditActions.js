// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import { GridLegacy as Grid } from '@mui/material'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const OptionsWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

const EditActions = ({ id, toggleSendReceiptDrawer, toggleAddPaymentDrawer }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
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
            <Box sx={{ mb: 2, gap: 4, display: 'flex', alignItems: 'center' }}>
              <Button
                fullWidth
                component={Link}
                color='secondary'
                variant='outlined'
                href={`/apps/receipt/preview/${id}`}
              >
                Preview
              </Button>
              <Button size='small' fullWidth color='secondary' variant='outlined'>
                Save
              </Button>
            </Box>
            <Button
              size='small'
              fullWidth
              variant='contained'
              sx={{ '& svg': { mr: 2 } }}
              onClick={toggleAddPaymentDrawer}
            >
              <Icon fontSize='14px' icon='tabler:currency-dollar' />
              Add Payment
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel id='payment-select'>Accept payments via</InputLabel>
          <Select fullWidth labelId='payment-select' label='Accept payments via' defaultValue='Internet Banking'>
            <MenuItem value='Internet Banking'>Internet Banking</MenuItem>
            <MenuItem value='Debit Card'>Debit Card</MenuItem>
            <MenuItem value='Credit Card'>Credit Card</MenuItem>
            <MenuItem value='Paypal'>Paypal</MenuItem>
            <MenuItem value='UPI Transfer'>UPI Transfer</MenuItem>
          </Select>
        </FormControl>
        <OptionsWrapper>
          <InputLabel sx={{ cursor: 'pointer' }} htmlFor='receipt-edit-payment-terms'>
            Payment Terms
          </InputLabel>
          <Switch defaultChecked id='receipt-edit-payment-terms' />
        </OptionsWrapper>
        <OptionsWrapper>
          <InputLabel sx={{ cursor: 'pointer' }} htmlFor='receipt-edit-client-notes'>
            Client Notes
          </InputLabel>
          <Switch id='receipt-edit-client-notes' />
        </OptionsWrapper>
        <OptionsWrapper>
          <InputLabel sx={{ cursor: 'pointer' }} htmlFor='receipt-edit-payment-stub'>
            Payment Stub
          </InputLabel>
          <Switch id='receipt-edit-payment-stub' />
        </OptionsWrapper>
      </Grid>
    </Grid>
  )
}

export default EditActions
