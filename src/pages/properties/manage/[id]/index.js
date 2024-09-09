// ** MUI Imports
import Grid from '@mui/material/Grid'
import axios from 'src/pages/middleware/axios'
import { useEffect, useState } from 'react'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import PropertyEditInfo from 'src/ui/property/PropertyEditInfo'
import { useRouter } from 'next/router'
import { useProperties } from 'src/hooks/useProperties'

const PropertyEdit = ({}) => {
  const router = useRouter()
  const [propertyData, setPropertyData] = useState(null)
  const { id } = router.query
  const { tab } = router.query || 'overview'

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
          console.error('FROM INDEX PAGE:', error)
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
//   const res = await axios.get('https://api.pm.manages.homes/apps/invoice/invoices')
//   const invoiceData = res.data.allData

//   return {
//     props: {
//       invoiceData
//     }
//   }
// }

export default PropertyEdit
