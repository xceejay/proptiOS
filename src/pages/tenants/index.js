import { useEffect, useState } from 'react'

import { GridLegacy as Grid } from '@mui/material'
import { useRouter } from 'next/router'
import ParentTenantEditInfo from 'src/ui/tenant/ParentTenantEditInfo'

const TenantsPage = () => {
  const router = useRouter
  const tab = router.query?.tab || 'management'
  const [tenantsData, setTenantsData] = useState(null)

  return <ParentTenantEditInfo tab={tab} tenantsData={tenantsData} />
}

TenantsPage.acl = { action: 'read', subject: 'tenants' }

export default TenantsPage
