import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import ParentUserEditInfo from 'src/ui/user/ParentUserEditInfo'

const UsersPage = () => {
  const router = useRouter
  const tab = router.query?.tab || 'invite'
  const [usersData, setUsersData] = useState(null)

  return <ParentUserEditInfo tab={tab} usersData={usersData} />
}

export default UsersPage
