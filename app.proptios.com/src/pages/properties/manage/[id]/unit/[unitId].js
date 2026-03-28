import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid'
import toast from 'react-hot-toast'
import { useProperties } from 'src/hooks/useProperties'
import PropertyUnitDetail from 'src/ui/property/PropertyUnitDetail'

const PropertyUnitDetailPage = () => {
  const router = useRouter()
  const { id } = router.query
  const properties = useProperties()
  const [propertyData, setPropertyData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      return
    }

    setLoading(true)
    properties.getProperty(
      id,
      responseData => {
        const { data } = responseData
        setPropertyData(data)
        setLoading(false)
      },
      error => {
        toast.error(error.response?.data?.description || 'Failed to load unit details. Please try again.', {
          duration: 5000
        })
        setLoading(false)
      }
    )
  }, [id])

  return (
    <Grid>
      <PropertyUnitDetail propertyData={propertyData} loading={loading} />
    </Grid>
  )
}

PropertyUnitDetailPage.acl = { action: 'read', subject: 'properties' }

export default PropertyUnitDetailPage
