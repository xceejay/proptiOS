// ** React Imports
import { createContext, useState, useEffect } from 'react'

// ** ThemeConfig Import
import themeConfig from 'src/configs/themeConfig'

const initialSettings = {
  themeColor: 'primary',
  mode: themeConfig.mode,
  skin: themeConfig.skin,
  footer: themeConfig.footer,
  layout: 'vertical',
  lastLayout: 'vertical',
  direction: themeConfig.direction,
  navHidden: themeConfig.navHidden,
  appBarBlur: themeConfig.appBarBlur,
  navCollapsed: themeConfig.navCollapsed,
  contentWidth: themeConfig.contentWidth,
  toastPosition: themeConfig.toastPosition,
  verticalNavToggleType: themeConfig.verticalNavToggleType,
  appBar: themeConfig.appBar
}

const staticSettings = {
  appBar: initialSettings.appBar,
  footer: initialSettings.footer,
  layout: initialSettings.layout,
  navHidden: initialSettings.navHidden,
  lastLayout: initialSettings.lastLayout,
  toastPosition: initialSettings.toastPosition
}

const restoreSettings = () => {
  let settings = null
  try {
    const storedData = window.localStorage.getItem('settings')
    if (storedData) {
      settings = { ...JSON.parse(storedData), ...staticSettings, layout: 'vertical', lastLayout: 'vertical' }
    } else {
      settings = initialSettings
    }
  } catch (err) {
    console.error(err)
  }

  return settings
}

// set settings in localStorage
const storeSettings = settings => {
  const initSettings = Object.assign({}, settings)
  delete initSettings.appBar
  delete initSettings.footer
  delete initSettings.layout
  delete initSettings.navHidden
  delete initSettings.lastLayout
  delete initSettings.toastPosition
  window.localStorage.setItem('settings', JSON.stringify(initSettings))
}

// ** Create Context
export const SettingsContext = createContext({
  saveSettings: () => null,
  settings: initialSettings
})

export const SettingsProvider = ({ children, pageSettings }) => {
  // ** State
  const [settings, setSettings] = useState({ ...initialSettings })

  const saveSettings = updatedSettings => {
    storeSettings(updatedSettings)
    setSettings(updatedSettings)
  }

  useEffect(() => {
    const restoredSettings = restoreSettings()

    if (restoredSettings) {
      setSettings({ ...restoredSettings })
    }

    if (pageSettings) {
      setSettings(prevSettings => ({ ...prevSettings, ...pageSettings, layout: 'vertical', lastLayout: 'vertical' }))
    }
  }, [pageSettings])

  useEffect(() => {
    if (settings.layout !== 'vertical' || settings.lastLayout !== 'vertical') {
      saveSettings({ ...settings, layout: 'vertical', lastLayout: 'vertical' })
    }
  }, [settings.layout, settings.lastLayout])

  return <SettingsContext.Provider value={{ settings, saveSettings }}>{children}</SettingsContext.Provider>
}

export const SettingsConsumer = SettingsContext.Consumer
