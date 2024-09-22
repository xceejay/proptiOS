import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const OptionsWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

const AddActions = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Button size='small' fullWidth variant='contained' sx={{ mb: 2, '& svg': { mr: 2 } }}>
              <Icon fontSize='14px' icon='tabler:pencil' />
              Sign Lease
            </Button>
            <Button fullWidth sx={{ mb: 2 }} component={Link} color='secondary' variant='outlined' href='view/4987'>
              Preview
            </Button>
            <Button size='small' fullWidth variant='outlined' color='secondary'>
              Save
            </Button>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth sx={{ mb: 4 }}>
          <InputLabel id='payment-select'>Accept payments via</InputLabel>
          <Select fullWidth labelId='payment-select' label='Accept payments via' defaultValue='Internet Banking'>
            <MenuItem value='mobile_money'>Mobile Money</MenuItem>
            <MenuItem value='cash'>Cash</MenuItem>
            <MenuItem value='debit_card'>Debit Card</MenuItem>
            <MenuItem value='credit_card'>Credit Card</MenuItem>
            <MenuItem value='bank_transfer'>Bank ACH</MenuItem>
            <MenuItem value='check'>Bank Check</MenuItem>
          </Select>
        </FormControl>
        <OptionsWrapper>
          <InputLabel sx={{ cursor: 'pointer' }} htmlFor='invoice-add-payment-terms'>
            Payment Terms
          </InputLabel>
          <Switch defaultChecked id='invoice-add-payment-terms' />
        </OptionsWrapper>
        <OptionsWrapper>
          <InputLabel sx={{ cursor: 'pointer' }} htmlFor='invoice-add-client-notes'>
            Client Notes
          </InputLabel>
          <Switch id='invoice-add-client-notes' />
        </OptionsWrapper>
        <OptionsWrapper>
          <InputLabel sx={{ cursor: 'pointer' }} htmlFor='invoice-add-payment-stub'>
            Payment Stub
          </InputLabel>
          <Switch id='invoice-add-payment-stub' />
        </OptionsWrapper>
      </Grid>

      <Grid item xs={12}>
        {/* Documentation Paragraph */}
        <Box sx={{ mt: 4 }}>
          <Typography variant='h6' gutterBottom>
            Tenant Agreement Variables:
          </Typography>
          <Typography variant='body2' paragraph>
            When modifying a tenant agreement, you can insert variables into the document by using the{' '}
            {'{{variable_name}}'}
            format. After clicking "Insert Details," the system will replace these placeholders with the correct values.
            If the document does not contain any {'{{}}'} placeholders, the system will return an error when you try to
            insert details.<br></br>
            <br></br>
            <strong>Note:</strong> It is recommended to use these variables for accuracy, but you can also manually type
            the names or details if needed.
          </Typography>
          <Typography variant='body2' paragraph>
            Here are the available variables you can use:
          </Typography>
          <ul>
            <li>
              <code>{'{{landlord_name}}'}</code> - The name of the landlord
            </li>
            <li>
              <code>{'{{tenant_name}}'}</code> - The name of the tenant
            </li>
            <li>
              <code>{'{{currency}}'}</code> - The currency for the rent amount
            </li>
            <li>
              <code>{'{{rent_amount}}'}</code> - The rent amount
            </li>
            <li>
              <code>{'{{payment_frequency}}'}</code> - The frequency of rent payments
            </li>
            <li>
              <code>{'{{lease_start_date}}'}</code> - The start date of the lease
            </li>
            <li>
              <code>{'{{lease_end_date}}'}</code> - The end date of the lease
            </li>
            <li>
              <code>{'{{title}}'}</code> - The title of the agreement
            </li>
            <li>
              <code>{'{{unit_name}}'}</code> - The name of the unit
            </li>
            <li>
              <code>{'{{property_name}}'}</code> - The name of the property
            </li>
            <li>
              <code>{'{{tenant_name}}'}</code> - The name of the tenant (repeated)
            </li>
          </ul>
          <Typography variant='body2' paragraph>
            Ensure the correct format and variables are used to avoid any errors.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}

export default AddActions
