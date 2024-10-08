import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Icon,
  IconButton,
  Tooltip
} from '@mui/material'
import PropertyManageTable from './PropertyManageTable'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
const ParentPropertyViewManagement = ({ setPropertyData, propertyData }) => {
  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            title='Properties'
            action={
              <Tooltip title='Toggle Grid View'>
                <IconButton>
                  <GridViewOutlinedIcon></GridViewOutlinedIcon>
                </IconButton>
              </Tooltip>
            }
          />
          <CardContent>
            <Grid>
              <PropertyManageTable></PropertyManageTable>
            </Grid>
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
        </Card>
      </Grid>
    </Grid>
  )
}

export default ParentPropertyViewManagement
