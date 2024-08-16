// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const TenantTableHeader = props => {
  // ** Props
  const { handleFilter, toggle, value } = props

  return (
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
      {/* <Button color='secondary' variant='outlined' startIcon={<Icon icon='tabler:upload' />}>
        Export
      </Button> */}
      <Box></Box>
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={value}
          sx={{ mr: 4 }}
          placeholder='Quick Search'
          onChange={e => handleFilter(e.target.value)}
        />

        <Button size='small' onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
          <Icon fontSize='14px' icon='tabler:plus' />
          Add New Tenant
        </Button>
      </Box>
    </Box>
  )
}

export default TenantTableHeader
