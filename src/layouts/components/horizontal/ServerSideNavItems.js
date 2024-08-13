// ** React Imports
import { useEffect, useState } from 'react'

// ** Axios Import
import axios from 'axios'

const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState([])
  useEffect(() => {
    axios.get('https://api.pm.manages.homes/api/horizontal-nav/data').then(response => {
      const menuArray = response.data
      setMenuItems(menuArray)
    })
  }, [])

  return { menuItems }
}

export default ServerSideNavItems
