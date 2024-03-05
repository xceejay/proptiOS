// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { GridToolbarExport } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const ServerSideToolbarTenantManage = props => {
  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: theme => theme.spacing(2, 5, 4, 5)
      }}
    >
      <Box></Box>
      <Box>
        <GridToolbarExport printOptions={{ disableToolbarButton: true }} />
      </Box>
    </Box>
  )
}

export default ServerSideToolbarTenantManage
