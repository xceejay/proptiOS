import { useEffect, useState } from 'react'

import { GridLegacy as Grid } from '@mui/material'
import { useRouter } from 'next/router'
import ParentSettingsEditInfo from 'src/ui/settings/ParentSettingsEditInfo'

const SettingsPage = () => {
  const router = useRouter
  const tab = router.query?.tab || 'account'
  const [settingsData, setSettingsData] = useState(null)

  return <ParentSettingsEditInfo tab={tab} settingsData={settingsData} />
}
SettingsPage.acl = { action: 'read', subject: 'settings' }

export default SettingsPage
