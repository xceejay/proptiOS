// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { GridToolbarExport } from '@mui/x-data-grid'
import { useTheme, styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const CustomTenantToolbar = props => {
  const GridToolbarExportStyled = styled(GridToolbarExport)(({ theme }) => ({
    color: theme.palette.text.primary
  }))

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
        <GridToolbarExportStyled printOptions={{ disableToolbarButton: false }} />
      </Box>
    </Box>
  )
}

export default CustomTenantToolbar
