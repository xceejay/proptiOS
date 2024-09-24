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

import { toast } from 'react-hot-toast' // Make sure to import toast

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useRouter } from 'next/router'

const OptionsWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
}))

const AddActions = props => {
  const router = useRouter()

  const { submittedContent } = props
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Button size='small' fullWidth variant='contained' sx={{ mb: 2, '& svg': { mr: 2 } }}>
              <Icon fontSize='14px' icon='tabler:pencil' />
              Sign Lease
            </Button>
            <Button
              onClick={() => {
                if (!submittedContent) {
                  toast.error(
                    'No document available for preview. Please save your changes before trying to preview the document.'
                  )
                } else {
                  console.log('else Running')
                  // Navigate to the preview page if submittedContent is not empty

                  router.push({
                    pathname: 'view/[id]',
                    query: { id: '4987', submittedContent: submittedContent }
                  })
                }
              }}
              fullWidth
              sx={{ mb: 2 }}
              color='secondary'
              variant='outlined'
            >
              Preview
            </Button>
            {/* <Button size='small' fullWidth variant='outlined' color='secondary'>
              Save
            </Button> */}
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
            Tenant Agreement Placeholders:
          </Typography>
          <Typography variant='body2' paragraph>
            When modifying a tenant agreement, you can insert placeholders into the document by using the{' '}
            {'{{placeholder_name}}'}
            format. After clicking "Insert Details," the system will replace these placeholders with the correct values.
            If the document does not contain any {'{{}}'} placeholders, the system will return an error when you try to
            insert details.<br></br>
            <br></br>
            <strong>Note:</strong> It is recommended to use these placeholders for accuracy, but you can also manually
            type the names or details if needed.
          </Typography>
          <Typography variant='body2' paragraph>
            Here are the available placeholders you can use:
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
            <li>
              <code>{'{{security_deposit}}'}</code> - The amount of the security deposit
            </li>
            <li>
              <code>{'{{late_fee}}'}</code> - The late fee charged for delayed payments
            </li>
            <li>
              <code>{'{{grace_period}}'}</code> - The number of days allowed for rent payment without penalty
            </li>
            <li>
              <code>{'{{renewal_terms}}'}</code> - The terms for lease renewal
            </li>
            <li>
              <code>{'{{termination_clause}}'}</code> - The conditions for terminating the lease
            </li>
            <li>
              <code>{'{{notice_period}}'}</code> - The required notice period for termination
            </li>
            <li>
              <code>{'{{early_termination_fee}}'}</code> - The fee for early termination of the lease
            </li>
            <li>
              <code>{'{{rent_increase_rate}}'}</code> - The percentage rate of rent increase upon renewal
            </li>
            <li>
              <code>{'{{guarantor_name}}'}</code> - The name of the guarantor, if applicable
            </li>
            <li>
              <code>{'{{maintenance_responsibility}}'}</code> - Responsibilities for maintenance (tenant/landlord)
            </li>
            <li>
              <code>{'{{payment_method}}'}</code> - The method of rent payment (e.g., bank transfer, credit card)
            </li>
            <li>
              <code>{'{{lease_signed_date}}'}</code> - The date the lease was signed
            </li>
            <li>
              <code>{'{{tenant_signature}}'}</code> - Placeholder for the tenant’s signature
            </li>
            <li>
              <code>{'{{landlord_signature}}'}</code> - Placeholder for the landlord’s signature
            </li>
            <li>
              <code>{'{{insurance_policy}}'}</code> - Details of required insurance policies, if applicable
            </li>
            <li>
              <code>{'{{pet_policy}}'}</code> - The terms related to pet allowance, if applicable
            </li>
            <li>
              <code>{'{{occupants_count}}'}</code> - The number of occupants allowed in the unit
            </li>
            <li>
              <code>{'{{utilities_included}}'}</code> - Whether utilities are included in the rent
            </li>
            <li>
              <code>{'{{utility_details}}'}</code> - Specifics about included utilities
            </li>
            <li>
              <code>{'{{sublet_permission}}'}</code> - Whether subletting is allowed or not
            </li>
            <li>
              <code>{'{{move_in_condition}}'}</code> - The condition of the property upon move-in
            </li>
            <li>
              <code>{'{{move_out_condition}}'}</code> - The expected condition of the property upon move-out
            </li>
          </ul>
          <Typography variant='body2' paragraph>
            Ensure the correct format and placeholders are used to avoid any errors.
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}

export default AddActions
