import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useUsers } from 'src/hooks/useUsers'
import UserEditInfo from 'src/ui/user/UserEditInfo'

const UserView = () => {
  const router = useRouter()
  const { id } = router.query
  const { tab } = router.query
  const users = useUsers()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    if (id) {
      // Ensure id is defined before making the API call
      users.getUser(
        id,
        responseData => {
          console.log('called')
          let { data } = responseData
          setUserData(data)
          console.log('FROM INDEX PAGE:', responseData)

          if (responseData?.status === 'FAILED') {
            alert(responseData.message || 'Failed to fetch users')
          }
        },
        error => {
          console.log(id)

          toast.error(error.response.data?.description || 'An error occurred. Please try again or contact support.', {
            duration: 5000
          })
        }
      )
    }
  }, [id, tab])

  return <UserEditInfo tab={tab} setUserData={setUserData} userData={userData} />
}

export default UserView
