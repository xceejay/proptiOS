// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import CommunicationViewLeft from 'src/ui/communication/CommunicationViewLeft'
import CommunicationViewRight from 'src/ui/communication/CommunicationViewRight'

const CommunicationView = ({ tab, invoiceData }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <CommunicationViewLeft />
      </Grid>
      <Grid item xs={12} md={12} lg={8}>
        <CommunicationViewRight tab={tab} invoiceData={invoiceData} />
      </Grid>
    </Grid>
  )
}

export default CommunicationView
