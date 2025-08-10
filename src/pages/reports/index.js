// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import ReportsTable from 'src/ui/reports/ReportsTable'

const Reports = () => {
  return (
    <Grid spacing={6}>
      <ReportsTable></ReportsTable>
    </Grid>
  )
}

export default Reports
