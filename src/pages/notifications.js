// ** MUI Imports
import Card from '@mui/material/Card'
import { GridLegacy as Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const Notifications = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Notifications '></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>Notifications.</Typography>
            <Typography></Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Notifications
