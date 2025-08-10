import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import ParentPropertyEditInfo from 'src/ui/property/ParentPropertyEditInfo'

const PropertiesPage = () => {
  const router = useRouter()
  const tab = router.query?.tab || 'management'
  const [propertiesData, setPropertiesData] = useState(null)

  return <ParentPropertyEditInfo tab={tab} propertiesData={propertiesData} />
}

PropertiesPage.acl = { action: 'read', subject: 'properties' }

export default PropertiesPage
