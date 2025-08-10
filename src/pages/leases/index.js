import { useEffect, useState } from 'react'

import { GridLegacy as Grid } from '@mui/material'
import { useRouter } from 'next/router'
import ParentLeaseEditInfo from 'src/ui/lease/ParentLeaseEditInfo'

const LeasesPage = () => {
  const router = useRouter
  const tab = router.query?.tab || 'management'
  const [leasesData, setLeasesData] = useState(null)

  return <ParentLeaseEditInfo tab={tab} leasesData={leasesData} />
}

export default LeasesPage
