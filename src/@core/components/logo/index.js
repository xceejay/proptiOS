import { Box, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
// import SpinnerSvg from '../../../../public/spinner.svg' // ✅ using the correct local path
import LogoSvg from 'src/@core/components/logo/logo.svg'

const Logo = ({ sx }) => {
  const theme = useTheme()

  return (
    <Box sx={{ transform: 'scale(0.7)', transformOrigin: 'center' }}>
      <LogoSvg />
    </Box>
  )
}

export default Logo
