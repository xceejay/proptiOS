// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import { GridToolbarExport } from '@mui/x-data-grid'
import { useTheme, styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { CardHeader, Typography } from '@mui/material'

const CustomTenantToolbar = props => {
  const { title } = props

  const GridToolbarExportStyled = styled(GridToolbarExport)(({ theme }) => ({
    color: theme.palette.text.primary
  }))

  return (
    <>
      <Box style={{ width: '100%', display: 'flex', justifyContent: 'left', alignItems: 'start' }}>
        <CardHeader title={title} sx={{ '& .MuiCardHeader-action': { m: 0 } }}></CardHeader>
      </Box>
      <Box></Box>
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'right',
          justifyContent: 'right',
          p: theme => theme.spacing(2, 5, 4, 5)
        }}
      >
        <GridToolbarExportStyled printOptions={{ disableToolbarButton: false }} />
      </Box>
    </>
  )
}

export default CustomTenantToolbar
