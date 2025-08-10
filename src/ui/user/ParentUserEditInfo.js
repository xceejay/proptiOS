// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports

import ParentUserViewRight from './ParentUserViewRight'

const UserEditInfo = ({ userData, tab }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid size={12} md={5} lg={4}>
        <UserViewLeft userData={userData} />
      </Grid> */}
      <Grid size={12} md={12} lg={12}>
        <ParentUserViewRight userData={userData} tab={tab} />
      </Grid>
    </Grid>
  )
}

export default UserEditInfo
