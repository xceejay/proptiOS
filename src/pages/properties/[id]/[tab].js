import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useProperties } from 'src/hooks/useProperties'
import PropertyEditInfo from 'src/ui/property/PropertyEditInfo'

const UserView = ({ invoiceData }) => {
  const router = useRouter()
  const { id } = router.query
  const { tab } = router.query
  const properties = useProperties()
  const [propertyData, setPropertyData] = useState(null)

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
  }, [id])

  return <PropertyEditInfo tab={tab} setPropertyData={setPropertyData} propertyData={propertyData} />
}

export default UserView
