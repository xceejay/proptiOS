// ** React Imports
import { useState, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import toast from 'react-hot-toast'

import AddUserDrawer from './AddPropertyDrawer'


// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Hooks Imports
import { useProperties } from 'src/hooks/useProperties'
import CustomTenantToolbar from 'src/views/table/data-grid/CustomTenantToolbar'
import CustomNoRowsOverlay from '../CustomNoRowsOverlay'
import EditPropertyDrawer from './EditPropertyDrawer'
import { removePropertyById } from './propertyManageModel'

const RowOptions = ({ id, row, stopPropagation, setPropertiesData, propertiesData, deleteProperties }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [editDrawerOpen, setEditDrawerOpen] = useState(false)

  const handleRowOptionsClick = event => {
    stopPropagation(event)
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = async () => {
    deleteProperties(
      id,
      () => {
        setPropertiesData(prevProperties => removePropertyById(prevProperties || propertiesData, id))
        toast.success('Property deleted successfully')
      },
      error => {
        console.error(error)
        toast.error('Error deleting property')
      }
    )
    handleRowOptionsClose()
  }

  const handleEdit = () => {
    setEditDrawerOpen(true)
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
        onClick={e => stopPropagation(e)}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href={'/properties/manage/' + id}
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleEdit} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:pencil' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>

      <EditPropertyDrawer
        setPropertiesData={setPropertiesData}
        propertiesData={propertiesData}
        open={editDrawerOpen}
        row={row}
        toggle={() => setEditDrawerOpen(!editDrawerOpen)}
      />
    </>
  )
}

const PropertyManageTable = ({
  paginationModel,
  setPaginationModel,
  propertiesData,
  loading,
  setLoading,
  setPropertiesData
}) => {
  const properties = useProperties()
  const columns = [
    {
      flex: 0.25,
      minWidth: 280,
      field: 'property_name',
      headerName: 'Property Name',
      renderCell: ({ row }) => {
        const { id, property_name, property_address, property_type } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                sx={{
                  fontWeight: 500,
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {property_name}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {property_address || property_type}
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
      field: 'property_type',
      headerName: 'Type',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.property_type.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 190,
      field: 'units',
      headerName: 'Allocated Units',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.units}
        </Typography>
      )
    },
    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: 'Status',
      type: 'boolean',
      renderCell: ({ row }) => {
        const statusLabel = row.status === 'active' ? 'Active' : 'Inactive'
        const statusColor = row.status === 'active' ? 'success' : 'secondary'

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
      renderCell: ({ row }) => (
        <RowOptions
          id={row.id}
          stopPropagation={e => e.stopPropagation()}
          row={row}
          setPropertiesData={setPropertiesData}
          propertiesData={propertiesData}
          deleteProperties={properties.deleteProperties}
        />
      )
    }
  ]

  const router = useRouter()
  const [value, setValue] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  // Filter properties based on the search value
  const filteredProperties = propertiesData.filter(
    property =>
      (property.property_name?.toLowerCase() || '').includes(value.toLowerCase()) ||
      (property.property_address?.toLowerCase() || '').includes(value.toLowerCase())
  )

  return (
    <>
      <DataGrid
        autoHeight
        rowHeight={62}
        loading={loading}
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
        onRowClick={params => router.push(`/properties/manage/${params.id}/`)}
        sx={{
          '& .MuiDataGrid-row': {
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover'
            }
          }
        }}
      />

      <AddUserDrawer
        propertiesData={propertiesData}
        setPropertiesData={setPropertiesData}
        open={addUserOpen}
        toggle={toggleAddUserDrawer}
      />
    </>
  )
}

export default PropertyManageTable
