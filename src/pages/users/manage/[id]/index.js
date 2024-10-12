// ** MUI Imports
import Grid from '@mui/material/Grid'
import axios from 'src/pages/middleware/axios'
import { useEffect, useState } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { useUsers } from 'src/hooks/useUsers'
import UserEditInfo from 'src/ui/user/UserEditInfo'
import { useRouter } from 'next/router'

const UserEdit = () => {
  const router = useRouter()
  const { id } = router.query
  const users = useUsers()
  const [userData, setUserData] = useState()

  useEffect(() => {
    if (id) {
      // Ensure id is defined before making the API call

      users.getUser(
        id,
        responseData => {
          console.log('called')
          let { data } = responseData
          setUserData(data)
          console.log('FROM INDEX PAGE:', data)

          if (data?.status === 'NO_RES') {
            console.log('NO results')
          } else if (data?.status === 'FAILED') {
            alert(data.message || 'Failed to fetch users')

            return
          }

          // setUsersData(response)
        },
        error => {
          console.log(id)

          toast.error(error.response.data?.description || 'An error occurred. Please try again or contact support.', {
            duration: 5000
          })
        }
      )
    }
  }, [id, users])

  return (
    <Grid>
      {console.log(users)}
      <UserEditInfo userData={userData} tab={'details'}></UserEditInfo>
    </Grid>
  )
}

// export const getServerSideProps = async ({ params }) => {
//   // const res = await axios.get('https://api.pm.manages.homes/apps/invoice/invoices')
//   // const invoiceData = res.data.allData
//   // return {
//   //   props: {
//   //     invoiceData
//   //   }
//   // }
// }

export default UserEdit
