// ** MUI Imports
import Grid from '@mui/material/Grid'
import axios from 'src/pages/middleware/axios'
import { useEffect, useState } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ParentPropertyEditInfo from 'src/ui/property/ParentPropertyEditInfo'
import { useRouter } from 'next/router'
import { useProperties } from 'src/hooks/useProperties'
import PropertyEditInfo from 'src/ui/property/PropertyEditInfo'
import toast from 'react-hot-toast'

const PropertyEdit = ({}) => {
  const router = useRouter()
  const [propertyData, setPropertyData] = useState(null)
  const { id } = router.query
  const { tab } = router.query || 'management'

  const properties = useProperties()
  useEffect(() => {
    if (id) {
      // Ensure id is defined before making the API call
      properties.getProperty(
        id,
        responseData => {
          console.log('called')
          let { data } = responseData
          setPropertyData(data)
          console.log('FROM INDEX PAGE:', responseData)

          if (responseData?.status === 'FAILED') {
            alert(responseData.message || 'Failed to fetch properties')
          }
        },
        error => {
          console.log(id)

          toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
            duration: 5000
          })
        }
      )
    }
  }, [propertyData])

  return (
    <Grid>
      <PropertyEditInfo tab={tab} setPropertyData={setPropertyData} propertyData={propertyData}></PropertyEditInfo>
    </Grid>
  )
}

// export async function getServerSideProps(params) {
//   const res = await axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + '/apps/invoice/invoices')
//   const invoiceData = res.data.allData

//   return {
//     props: {
//       invoiceData
//     }
//   }
// }

PropertyEdit.acl = { action: 'read', subject: 'properties' }
export default PropertyEdit
