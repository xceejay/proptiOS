// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'

const PropertyViewMarketing = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <Card>
          <CardHeader title='Marketing' />
          <Divider />
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
              <Icon icon='tabler:speakerphone' fontSize='3rem' style={{ marginBottom: 16, opacity: 0.4 }} />
              <Typography variant='h6' sx={{ mb: 2, color: 'text.secondary' }}>
                Property Marketing
              </Typography>
              <Typography variant='body2' sx={{ color: 'text.disabled', textAlign: 'center', maxWidth: 400 }}>
                Marketing tools for listing your property, managing public visibility, and tracking applicant interest
                will be available here soon.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PropertyViewMarketing
