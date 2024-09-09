import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import ParentTenantEditInfo from 'src/ui/tenant/ParentTenantEditInfo'

const TenantsPage = () => {
  const router = useRouter
  const tab = router.query?.tab || 'overview'
  const [tenantsData, setTenantsData] = useState(null)

  return <ParentTenantEditInfo tab={tab} tenantsData={tenantsData} />
}

export default TenantsPage
