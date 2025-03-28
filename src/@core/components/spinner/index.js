import { Box, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
// import SpinnerSvg from '../../../../public/spinner.svg' // ✅ using the correct local path
import SpinnerSvgLight from 'src/@core/components/spinner/spinner_light.svg'
import SpinnerSvgDark from 'src/@core/components/spinner/spinner_dark.svg'

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
      {theme.palette.mode === 'light' ? (
        <Box sx={{ transform: 'scale(0.5)', transformOrigin: 'center' }}>
          <SpinnerSvgLight className='flicker' />
        </Box>
      ) : (
        <>
          <Box sx={{ transform: 'scale(0.5)', transformOrigin: 'center' }}>
            <SpinnerSvgDark class name='flicker-dark' />
          </Box>
        </>
      )}

      {/* <CircularProgress disableShrink sx={{ mt: 6, color: 'black' }} /> */}
    </Box>
  )
}

export default FallbackSpinner
