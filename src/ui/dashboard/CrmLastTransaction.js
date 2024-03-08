// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import TableContainer from '@mui/material/TableContainer'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import OptionsMenu from 'src/@core/components/option-menu'

const data = [
  {
    property: 'Sunset Apartments',
    units: 24,
    description: 'Luxury apartments with ocean view',
    status: 'occupied'
  },
  {
    property: 'Pinecrest Estates',
    units: 48,
    description: 'Family-friendly townhomes in a quiet neighborhood',
    status: 'available'
  },
  {
    property: 'Maple Grove Condos',
    units: 32,
    description: 'Modern condos with amenities like pool and gym',
    status: 'maintenance'
  },
  {
    property: 'Riverfront Lofts',
    units: 16,
    description: 'Historic loft apartments along the riverfront',
    status: 'occupied'
  },
  {
    property: 'Hilltop Villas',
    units: 12,
    description: 'Exclusive villas with private gardens and views',
    status: 'available'
  }
]

const statusObj = {
  maintenance: { text: 'Maintenance', color: 'error' },
  available: { text: 'Available', color: 'secondary' },
  occupied: { text: 'Occupied', color: 'warning' },
  verified: { text: 'Verified', color: 'success' }
}

const CrmLastTransaction = () => {
  return (
    <Card>
      <CardHeader
        title='Maintenance'
        action={
          <OptionsMenu
            options={['Show all entries', 'Refresh', 'Download']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow
              sx={{ '& .MuiTableCell-root': { py: 2, borderTop: theme => `1px solid ${theme.palette.divider}` } }}
            >
              <TableCell>Property</TableCell>
              <TableCell>Units</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => {
              return (
                <TableRow
                  key={row.cardNumber}
                  sx={{
                    '&:last-child .MuiTableCell-root': { pb: theme => `${theme.spacing(6)} !important` },
                    '& .MuiTableCell-root': { border: 0, py: theme => `${theme.spacing(2.25)} !important` },
                    '&:first-of-type .MuiTableCell-root': { pt: theme => `${theme.spacing(4.5)} !important` }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', '& img': { mr: 4 } }}>
                      <img width={50} alt={row.imgName} src={`/images/cards/${row.imgName}.png`} />
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                          {row.cardNumber}
                        </Typography>
                        <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                          {row.cardType}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        Sent
                      </Typography>
                      <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                        {row.date}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <CustomChip
                      rounded
                      size='small'
                      skin='light'
                      label={statusObj[row.status].text}
                      color={statusObj[row.status].color}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      {row.trend}
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}

export default CrmLastTransaction
