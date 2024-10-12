// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Third Party Components
import axios from 'axios'

// ** Demo Components Imports

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Button } from '@mui/material'
import Icon from 'src/@core/components/icon'

import AddCard from 'src/views/apps/receipt/add/AddCard'
import AddActions from 'src/views/apps/receipt/add/AddActions'
import AddNewCustomer from 'src/views/apps/receipt/add/AddNewCustomer'
import { useRouter } from 'next/router'
import { useProperties } from 'src/hooks/useProperties'

const ReceiptAdd = ({}) => {
  const properties = useProperties()
  const [propertiesData, setPropertiesData] = useState(null)
  const paginationModel = {}
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    properties.getAllProperties(
      { page: paginationModel.page, limit: paginationModel.pageSize },
      responseData => {
        const { data } = responseData

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
          alert(response.message || 'Failed to fetch properties')
        } else {
          console.log('properties data has been fetched in receipts', data)
          setPropertiesData(data)
        }

        setLoading(false) // Stop loading when the request completes
      },
      error => {
        toast.error(error.response.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
        setLoading(false) // Stop loading on error
      }
    )
  }, [])

  // ** State
  const [addCustomerOpen, setAddCustomerOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState(null)

  const [submittedContent, setSubmittedContent] = useState('')

  const [clients, setClients] = useState([])
  const router = useRouter()
  const toggleAddCustomerDrawer = () => setAddCustomerOpen(!addCustomerOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* <Grid pb={5}>
          <Button size='small' variant='outlined' onClick={() => router.push('/receipts')}>
            <Icon icon='tabler:arrow-left' fontSize={20} />
            Back
          </Button>
        </Grid> */}

        <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
          <Grid container spacing={6}>
            <Grid item xl={9} lg={9.5} md={8} xs={12}>
              <AddCard
                propertiesData={propertiesData}
                setPropertiesData={setPropertiesData}
                clients={clients}
                receiptNumber={1}
                selectedClient={selectedClient}
                setSelectedClient={setSelectedClient}
                toggleAddCustomerDrawer={toggleAddCustomerDrawer}
                setSubmittedContent={setSubmittedContent}
                submittedContent={submittedContent}
              />
            </Grid>
            <Grid item xl={3} lg={2.5} md={4} xs={12}>
              <AddActions setSubmittedContent={setSubmittedContent} submittedContent={submittedContent} />
            </Grid>
          </Grid>
          <AddNewCustomer
            clients={clients}
            open={addCustomerOpen}
            setClients={setClients}
            toggle={toggleAddCustomerDrawer}
            setSelectedClient={setSelectedClient}
            setSubmittedContent={setSubmittedContent}
            submittedContent={submittedContent}
          />
        </DatePickerWrapper>
      </Grid>
    </Grid>
  )
}

export default ReceiptAdd
