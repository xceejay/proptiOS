import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import ParentAccountingEditInfo from 'src/ui/accounting/ParentAccountingEditInfo'

const AccountingPage = () => {
  const router = useRouter
  const tab = router.query?.tab || 'payments'
  const [accountingData, setAccountingData] = useState(null)

  return <ParentAccountingEditInfo tab={tab} accountingData={accountingData} />
}

export default AccountingPage
