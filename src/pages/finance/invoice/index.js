import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid'
import { useRouter } from 'next/router'
import ParentInvoiceEditInfo from 'src/ui/invoice/ParentInvoiceEditInfo'

const InvoicesPage = () => {
  const router = useRouter
  const tab = router.query?.tab || 'management'
  const [invoicesData, setInvoicesData] = useState(null)

  return <ParentInvoiceEditInfo tab={tab} invoicesData={invoicesData} />
}

export default InvoicesPage
