// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

const AuditTableHeader = props => {
  // ** Props
  const { handleFilter, toggle, toggleExisting, value } = props

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
      <Box></Box>
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          size='small'
          value={value}
          sx={{ mr: 4 }}
          placeholder='Quick Search'
          onChange={e => handleFilter(e.target.value)}
        />
        <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap' }}>
          <Button
            size='small'
            onClick={toggle}
            variant='contained'
            sx={{ '& svg': { mr: 2 }, mr: 2 }} // Adding margin-right to create space
          >
            <Icon fontSize='14px' icon='tabler:plus' />
            Add New Audit
          </Button>

          <Button
            color='secondary'
            size='small'
            onClick={toggleExisting}
            variant='contained'
            sx={{ '& svg': { mr: 2 } }}
          >
            <Icon fontSize='14px' icon='tabler:plus' />
            Add Existing Audit
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default AuditTableHeader
