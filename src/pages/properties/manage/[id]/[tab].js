import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useProperties } from 'src/hooks/useProperties'
import PropertyEditInfo from 'src/ui/property/PropertyEditInfo'
import toast from 'react-hot-toast'

const PropertyManageId = ({ invoiceData }) => {
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

          toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
            duration: 5000
          })
        }
      )
    }
  }, [id, tab])

  return <PropertyEditInfo tab={tab} setPropertyData={setPropertyData} propertyData={propertyData} />
}

PropertyManageId.acl = { action: 'read', subject: 'properties' }

export default PropertyManageId
