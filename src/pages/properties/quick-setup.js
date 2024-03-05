// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import PropertyQuickSetupForm from 'src/ui/property/quick-setup/PropertyQuickSetupForm'

const PropertiesQuickSetup = () => {
  return (
    <Grid container>
      <PropertyQuickSetupForm></PropertyQuickSetupForm>
    </Grid>
  )
}

export default PropertiesQuickSetup
