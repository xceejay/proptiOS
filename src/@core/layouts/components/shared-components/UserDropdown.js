import { useState, Fragment } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import { useAuth } from 'src/hooks/useAuth'
import { SvgIcon } from '@mui/material'
import Icon from 'src/@core/components/icon'

const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const MenuItemStyled = styled(MenuItem)(({ theme }) => ({
  '&:hover .MuiBox-root, &:hover .MuiBox-root svg': {
    color: theme.palette.primary.main
  }
}))

const UserDropdown = props => {
  const { settings } = props
  const [anchorEl, setAnchorEl] = useState(null)
  const router = useRouter()
  const { logout, user } = useAuth()
  const { direction } = settings

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase())
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    px: 4,
    py: 1.75,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textTransform: 'capitalize',
    textDecoration: 'none',
    '& svg': {
      mr: 2.5,
      color: 'text.primary'
    }
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar sx={{ width: 40, height: 40 }} skin='light' variant='rounded' color={'grey'}>
          {getInitials(user.name)}
        </Avatar>{' '}
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4.5 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ py: 1.75, px: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar skin='light' variant='rounded' color={'grey'} sx={{ width: '2.5rem', height: '2.5rem' }}>
                {getInitials(user.name)}
              </Avatar>{' '}
            </Badge>
            <Box sx={{ display: 'flex', ml: 2.5, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 500 }}>{user.name}</Typography>
              <Typography variant='body2'>{toTitleCase(user.user_type).replace('_', ' ')}</Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('/settings')}>
          <Box sx={styles}>
            {!user.site_subscription_id ||
              (user.site_subscription_id == 'standard' && (
                <>
                  <SvgIcon>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width={24}
                      height={24}
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth={1.5}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className=' icon-tada icon icon-tabler icons-tabler-outline icon-tabler-sparkles'
                    >
                      <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                      <path d='M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z' />
                    </svg>
                  </SvgIcon>
                  Upgrade Plan
                </>
              ))}

            {user.site_subscription_id && user.site_subscription_id != 'standard' && (
              <>
                <SvgIcon>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    stroke-width='1.5'
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    class='icon icon-tabler icons-tabler-outline icon-tabler-coffee'
                  >
                    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                    <path d='M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1' />
                    <path d='M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2' />
                    <path d='M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2' />
                    <path d='M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5z' />
                    <path d='M16.746 16.726a3 3 0 1 0 .252 -5.555' />
                  </svg>
                </SvgIcon>
                {user.site_subscription_id + ' Subscription'}
              </>
            )}
          </Box>
        </MenuItemStyled>

        <MenuItemStyled sx={{ p: 0 }} onClick={() => handleDropdownClose('/settings')}>
          <Box sx={styles}>
            <Icon icon='tabler:settings' />
            Settings
          </Box>
        </MenuItemStyled>

        <Divider sx={{ my: theme => `${theme.spacing(2)} !important` }} />
        <MenuItemStyled onClick={handleLogout} sx={{ py: 2, '& svg': { mr: 2, fontSize: '1.375rem' } }}>
          <Icon icon='tabler:logout' />
          Logout
        </MenuItemStyled>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
