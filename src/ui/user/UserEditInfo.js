// ** MUI Imports
import { GridLegacy as Grid } from '@mui/material'

// ** Demo Components Imports
import UserViewLeft from 'src/ui/user/UserViewLeft'
import UserViewRight from 'src/ui/user/UserViewRight'

const UserEditInfo = ({ userData, tab }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft userData={userData} />
      </Grid>
      <Grid item xs={12} md={12} lg={8}>
        <UserViewRight userData={userData} tab={tab} />
      </Grid>
    </Grid>
  )
}

export default UserEditInfo
