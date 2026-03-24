// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { GridToolbarExport } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Button, CardHeader } from '@mui/material'

const CustomTenantToolbar = props => {
  const { title, handleFilter, toggle, value, addText, searchPlaceholder } = props

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
          py: 4,
          px: 6,
          rowGap: 2,
          columnGap: 4,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <GridToolbarExport variant='outlined' printOptions={{ disableToolbarButton: true }} />

        <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          {searchPlaceholder ? (
            <>
              <TextField
                size='small'
                value={value}
                sx={{ mr: 4 }}
                placeholder={searchPlaceholder}
                onChange={e => handleFilter(e.target.value)}
              />
            </>
          ) : (
            <></>
          )}

          {addText ? (
            <>
              <Button size='small' onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                <Icon fontSize='14px' icon='tabler:plus' />
                {addText}
              </Button>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Box>

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
        {/* <Box>
          <GridToolbarExport printOptions={{ disableToolbarButton: false }} />
        </Box> */}
      </Box>
    </>
  )
}

export default CustomTenantToolbar
