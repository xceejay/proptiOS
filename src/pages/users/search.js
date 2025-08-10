// ** MUI Imports
import Card from '@mui/material/Card'
import { GridLegacy as Grid } from '@mui/material'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const UsersSearch = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Users Search 🔍'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>Users Search.</Typography>
            <Typography></Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default UsersSearch
