// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components
import axios from 'axios'

// ** Demo Components Imports

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Button } from '@mui/material'
import Icon from 'src/@core/components/icon'

import AddCard from 'src/views/apps/lease/add/AddCard'
import AddActions from 'src/views/apps/lease/add/AddActions'
import AddNewCustomer from 'src/views/apps/lease/add/AddNewCustomer'

const InvoiceAdd = ({}) => {
  // ** State
  const [addCustomerOpen, setAddCustomerOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)
  const [clients, setClients] = useState([])
  const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Grid pb={5}>
          <Button size='small' variant='outlined' onClick={() => router.push('/tenants')}>
            <Icon icon='tabler:arrow-left' fontSize={20} />
            Back
          </Button>
        </Grid>

        <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
          <Grid container spacing={6}>
            <Grid item xl={9} md={8} xs={12}>
              <AddCard
                clients={clients}
                invoiceNumber={1}
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                toggleAddCustomerDrawer={toggleAddCustomerDrawer}
              />
            </Grid>
            <Grid item xl={3} md={4} xs={12}>
              <AddActions />
            </Grid>
          </Grid>
          <AddNewCustomer
            clients={clients}
            open={addCustomerOpen}
            setClients={setClients}
            toggle={toggleAddCustomerDrawer}
            setSelectedClient={setSelectedClient}
          />
        </DatePickerWrapper>
      </Grid>
    </Grid>
  )
}

export default InvoiceAdd
