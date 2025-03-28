import { Box, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
// import SpinnerSvg from '../../../../public/spinner.svg' // ✅ using the correct local path
import SpinnerSvg from 'src/@core/components/spinner/spinner_new.svg'

const FallbackSpinner = ({ sx }) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <div>
        <SpinnerSvg className='flicker' />
      </div>

      <CircularProgress disableShrink sx={{ mt: 6, color: 'black' }} />
    </Box>
  )
}

export default FallbackSpinner
