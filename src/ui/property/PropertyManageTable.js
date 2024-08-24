// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import AddUserDrawer from './AddPropertyDrawer'

import Select from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Hooks Imports
import { useProperties } from 'src/hooks/useProperties'
import PropertyTableHeader from './PropertyTableHeader'
import ServerSideToolbarPropertyManage from 'src/views/table/data-grid/ServerSideToolbarPropertyManage'
import CustomTenantToolbar from 'src/views/table/data-grid/CustomTenantToolbar'
import CustomNoRowsOverlay from '../CustomNoRowsOverlay'

const RowOptions = ({ id }) => {
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(deleteUser(id))
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='tabler:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href={'/properties/' + id}
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Quick Suspend
        </MenuItem>
      </Menu>
    </>
  )
}

const columns = [
  {
    flex: 0.25,
    minWidth: 280,
    field: 'property_name',
    headerName: 'Property Name',
    renderCell: ({ row }) => {
      const { id, property_name } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              component={Link}
              href={'/properties/' + id + '/overview'}
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {property_name}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {id}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 190,
    field: 'property_address',
    headerName: 'Address',
    renderCell: ({ row }) => (
      <Typography noWrap sx={{ color: 'text.secondary' }}>
        {row.property_address}
      </Typography>
    )
  },
  {
    flex: 0.15,
    minWidth: 190,
    field: 'country',
    headerName: 'Country',
    renderCell: ({ row }) => (
      <Typography noWrap sx={{ color: 'text.secondary' }}>
        {row.country}
      </Typography>
    )
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'active',
    headerName: 'Status',
    renderCell: ({ row }) => {
      const statusLabel = row.active === 1 ? 'Active' : 'Inactive'
      const statusColor = row.active === 1 ? 'success' : 'secondary'

      return (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={statusLabel}
          color={statusColor}
          sx={{ textTransform: 'capitalize' }}
        />
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 100,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions id={row.id} />
  }
]

const PropertyManageTable = () => {
  const properties = useProperties()
  const [propertiesData, setPropertiesData] = useState([])
  const [loading, setLoading] = useState(true) // New loading state
  const [value, setValue] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  useEffect(() => {
    properties.getProperties(
      { page: paginationModel.page, limit: paginationModel.pageSize },
      responseData => {
        const { data } = responseData

        if (data?.status === 'FAILED') {
          alert(response.message || 'Failed to fetch properties')
        } else {
          setPropertiesData(data)
        }

        setLoading(false) // Stop loading when the request completes
      },
      error => {
        console.error('Properties cannot be retrieved:', error)
        setLoading(false) // Stop loading on error
      }
    )
  }, [paginationModel])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  console.log('jigasi', propertiesData)

  // Filter properties based on the search value
  const filteredProperties = propertiesData.filter(
    property =>
      property.property_name.toLowerCase().includes(value.toLowerCase()) ||
      property.property_address.toLowerCase().includes(value.toLowerCase())
  )

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Properties' />
          <CardContent>
            <DataGrid
              autoHeight
              rowHeight={62}
              loading={loading} // Use the new loading state
              rows={filteredProperties || []}
              columns={columns}
              slots={{ toolbar: CustomTenantToolbar, noRowsOverlay: CustomNoRowsOverlay }}
              slotProps={{
                toolbar: {
                  searchPlaceholder: 'Search Properties',
                  value: value,
                  addText: 'Add Property',
                  toggle: toggleAddUserDrawer,
                  handleFilter: handleFilter
                }
              }}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
        </Card>
      </Grid>
      <AddUserDrawer
        propertiesData={propertiesData}
        setPropertiesData={setPropertiesData}
        open={addUserOpen}
        toggle={toggleAddUserDrawer}
      />
    </Grid>
  )
}

export default PropertyManageTable
