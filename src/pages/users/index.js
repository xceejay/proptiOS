import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'
import UserEditInfo from '../../ui/user/UserEditInfo'
import { useRouter } from 'next/router'

const UserManagementPage = () => {
  const router = useRouter
  const tab = router.query?.tab || 'manage'
  const [usersData, setUsersData] = useState(null)

  return <UserEditInfo tab={tab} usersData={usersData} />
}

export default UserManagementPage

// ** MUI Imports
// import Grid from '@mui/material/Grid'
// import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

// import UserManageTable from 'src/ui/user/UserManageTable'

// const UserPage = () => {
//   return (
//     <Grid>
//       <Grid item xs={12} sm={12} lg={12}>
//         <Grid container spacing={6} sx={{ mb: 4 }}>
//           <Grid item xs={6} sm={6} lg={3}>
//             {/* prettier-ignore */}
//             <CardStatsVertical

//                 // stats={"0"}
//                 chipText={"0"}
//                 avatarColor='success'
//                 chipColor='default'
//                 title='Active'
//                 subtitle='Total active users'
//                 avatarIcon='tabler:home'
//               />
//           </Grid>

//           {/*
//           THIS ONE has stats
//           <Grid item xs={6} sm={6} lg={3}>
//             <CardStatsVertical
//               stats={"0"}
//               chipText={'0'}
//               avatarColor='info'
//               chipColor='default'
//               title='Archived'
//               subtitle='Total archived users'
//               avatarIcon='tabler:woman'
//             />
//           </Grid> */}

//           <Grid item xs={6} sm={6} lg={3}>
//             <CardStatsVertical
//               chipText={'0'}
//               avatarColor='primary'
//               chipColor='default'
//               title='Total'
//               subtitle='Total users'
//               avatarIcon='tabler:woman'
//             />
//           </Grid>
//           <Grid item xs={6} sm={6} lg={3}>
//             <CardStatsVertical
//               chipText={'0'}
//               avatarColor='warning'
//               chipColor='default'
//               title='Expiring Soon'
//               subtitle='Users expiring soon'
//               avatarIcon='tabler:woman'
//             />
//           </Grid>
//           <Grid item xs={6} sm={6} lg={3}>
//             <CardStatsVertical
//               chipText={'0'}
//               avatarColor='secondary'
//               chipColor='default'
//               title='Archived'
//               subtitle='Total archived users'
//               avatarIcon='tabler:woman'
//             />
//           </Grid>
//         </Grid>
//       </Grid>
//       <Grid>
//         <UserManageTable></UserManageTable>
//       </Grid>
//     </Grid>
//   )
// }

// export default UserPage
