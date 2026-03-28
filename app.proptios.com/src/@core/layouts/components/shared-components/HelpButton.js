// ** MUI Imports
import { Tooltip } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/router'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const HelpButton = props => {
  // ** Props
  const router = useRouter()
  const handleBack = () => {
    window.open('https://proptios.com', '_blank')
  }

  return (
    <Tooltip title='Help'>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleBack}>
        <Icon fontSize='1.5rem' stroke={1} icon={'tabler:help-circle'} />
      </IconButton>
    </Tooltip>
  )
}

export default HelpButton
