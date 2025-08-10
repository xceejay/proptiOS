// ** MUI Imports
import { GridLegacy as Grid } from '@mui/material'

// ** Demo Components Imports

import ParentUserViewRight from './ParentUserViewRight'

const UserEditInfo = ({ userData, tab }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12} md={5} lg={4}>
        <UserViewLeft userData={userData} />
      </Grid> */}
      <Grid item xs={12} md={12} lg={12}>
        <ParentUserViewRight userData={userData} tab={tab} />
      </Grid>
    </Grid>
  )
}

export default UserEditInfo
