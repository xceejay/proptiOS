// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TenantsManageTable from 'src/ui/tenant/TenantManageTable'

const TenantsManage = () => {
  return (
    <Grid>
      <TenantsManageTable></TenantsManageTable>
    </Grid>
  )
}

export default TenantsManage
