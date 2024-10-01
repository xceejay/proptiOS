// ** MUI Imports
import { Tooltip } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/router'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const ModeToggler = props => {
  // ** Props
  const router = useRouter()
  const handleBack = () => {
    router.back()
  }

  return (
    <Tooltip title='Go back'>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleBack}>
        <Icon fontSize='1.5rem' icon={'tabler:arrow-left'} />
      </IconButton>
    </Tooltip>
  )
}

export default ModeToggler
