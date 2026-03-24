// ** React Import
import { useEffect, useRef } from 'react'

// ** Layout Components
import VerticalLayout from './VerticalLayout'

const Layout = props => {
  // ** Props
  const { hidden, children, settings, saveSettings } = props

  // ** Ref
  const isCollapsed = useRef(settings.navCollapsed)
  useEffect(() => {
    if (hidden) {
      if (settings.navCollapsed) {
        saveSettings({ ...settings, navCollapsed: false, layout: 'vertical' })
        isCollapsed.current = true
      }
    } else {
      if (isCollapsed.current) {
        saveSettings({ ...settings, navCollapsed: true, layout: 'vertical', lastLayout: 'vertical' })
        isCollapsed.current = false
      }
    }
  }, [hidden, saveSettings, settings])

  return <VerticalLayout {...props}>{children}</VerticalLayout>
}

export default Layout
