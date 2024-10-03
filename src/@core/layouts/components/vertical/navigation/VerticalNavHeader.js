// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Custom Icon Import
import Icon from 'src/@core/components/icon'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'

// ** Styled Components
const MenuHeaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: theme.spacing(4.5),
  transition: 'padding .25s ease-in-out',
  minHeight: theme.mixins.toolbar.minHeight
}))

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  lineHeight: '24px',
  fontSize: '1rem !important',
  color: theme.palette.text.primary,
  transition: 'opacity .25s ease-in-out, margin .25s ease-in-out'
}))

const LinkStyled = styled(Link)({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const VerticalNavHeader = props => {
  // ** Props
  const {
    hidden,
    navHover,
    settings,
    saveSettings,
    collapsedNavWidth,
    toggleNavVisibility,
    navigationBorderWidth,
    menuLockedIcon: userMenuLockedIcon,
    navMenuBranding: userNavMenuBranding,
    menuUnlockedIcon: userMenuUnlockedIcon
  } = props

  // ** Hooks & Vars
  const theme = useTheme()

  const auth = useAuth()
  const [user, setUser] = useState()
  const { navCollapsed } = settings
  const menuCollapsedStyles = navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }

  useEffect(() => {
    console.log('set user within vertical nav')

    setUser(auth.user)
  }, [auth])

  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userNavMenuBranding) {
        return 0
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 32) / 8
      }
    } else {
      return 4.5
    }
  }
  const MenuLockedIcon = () => userMenuLockedIcon || <Icon icon='tabler:circle-dot' />
  const MenuUnlockedIcon = () => userMenuUnlockedIcon || <Icon icon='tabler:circle' />

  return (
    <MenuHeaderWrapper
      className='nav-header'
      sx={{
        pl: menuHeaderPaddingLeft(),
        '& .MuiTypography-root, & .MuiIconButton-root': {
          color: 'text.primary'
        }
      }}
    >
      {userNavMenuBranding ? (
        userNavMenuBranding(props)
      ) : (
        <LinkStyled href='/'>
          <></>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 30' width='32' height='30'>
            <rect width='32' height='30' fill='#CCCCCC0D'></rect>
            <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='10px' fill='#333333FF'>
              32x30
            </text>
          </svg>
          <HeaderTitle variant='h6' sx={{ ...menuCollapsedStyles, ...(navCollapsed && !navHover ? {} : { ml: 2 }) }}>
            {user?.site_id ? user.site_id : themeConfig.templateName}
          </HeaderTitle>
        </LinkStyled>
      )}

      {hidden ? (
        <IconButton
          disableRipple
          disableFocusRipple
          onClick={toggleNavVisibility}
          sx={{
            p: 0,
            backgroundColor: 'transparent !important',
            color: `${theme.palette.text.secondary} !important`
          }}
        >
          {/* disabled close icon because it does not look good */}
          {/* <Icon icon='tabler:x' fontSize='1rem' /> */}
        </IconButton>
      ) : userMenuLockedIcon === null && userMenuUnlockedIcon === null ? null : (
        <></>

        // <IconButton
        //   disableRipple
        //   disableFocusRipple
        //   onClick={() => saveSettings({ ...settings, navCollapsed: !navCollapsed })}
        //   sx={{
        //     p: 0,
        //     backgroundColor: 'transparent !important',
        //     '& svg': {
        //       fontSize: '1.25rem',
        //       ...menuCollapsedStyles,
        //       transition: 'opacity .25s ease-in-out'
        //     }
        //   }}
        // >
        //   {navCollapsed ? MenuUnlockedIcon() : MenuLockedIcon()}
        // </IconButton>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
