// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
// import UserViewLeft from 'src/ui/user/UserViewLeft'
import UserViewRight from 'src/ui/user/UserViewRight'

const UserEditInfo = ({ usersData, tab }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12} md={5} lg={4}>
        <UsersViewLeft usersData={usersData} />
      </Grid> */}

      {/* doubled all the values for size of grid */}
      <Grid item xs={24} md={14} lg={16}>
        <UserViewRight usersData={usersData} tab={tab} />
      </Grid>
    </Grid>
  )
}

export default UserEditInfo
