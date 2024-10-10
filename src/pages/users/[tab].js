import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useUsers } from 'src/hooks/useUsers'
import ParentUserEditInfo from 'src/ui/user/ParentUserEditInfo'

const UserTab = ({ invoiceData }) => {
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

          toast.error(error.response.data.description, {
            duration: 5000
          })
        }
      )
    }
  }, [id, tab])

  return <ParentUserEditInfo tab={tab} setUserData={setUserData} userData={userData} />
}

export default UserTab
