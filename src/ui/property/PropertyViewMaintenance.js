// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Import

// ** MUI Imports

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import IconButton from '@mui/material/IconButton'

import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { DataGrid } from '@mui/x-data-grid'
import { Menu, MenuItem } from '@mui/material'
import CustomNoRowsOverlay from '../CustomNoRowsOverlay'
import PropertyAddMaintenanceRequestDrawer from './PropertyAddMaintenanceRequestDrawer'
import CustomStatusToolbar from 'src/views/table/data-grid/CustomStatusToolbar'
import PropertyManageMaintenanceRequestDrawer from './PropertyManageMaintenanceRequestDrawer'
import CustomChip from 'src/@core/components/mui/chip'
import { buildMaintenanceRequests, filterMaintenanceRequests } from './propertyMaintenanceModel'
const RowOptions = ({
  id,
  row,
  setPropertyData,
  propertyData,
  setMaintenanceRequestsData,
  maintenanceRequestsData
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [loading, setLoading] = useState(false)

  const rowOptionsOpen = Boolean(anchorEl)

  const [manageUnitOpen, setManageUnitOpen] = useState(false)
  const toggleManageUnitDrawer = () => setManageUnitOpen(!manageUnitOpen)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleManage = () => {
    setManageUnitOpen(true)
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
        <MenuItem onClick={handleManage} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:pencil' fontSize={20} />
          Manage
        </MenuItem>
        <MenuItem disabled sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Quick Suspend (Unavailable)
        </MenuItem>
      </Menu>

      <PropertyManageMaintenanceRequestDrawer
        propertyData={propertyData}
        setPropertyData={setPropertyData}
        setLoading={setLoading}
        maintenanceRequestData={row}
        setMaintenanceRequestsData={setMaintenanceRequestsData}
        open={manageUnitOpen}
        toggle={toggleManageUnitDrawer}
      />
    </>
  )
}

const PropertyViewMaintenance = ({ setPropertyData, propertyData }) => {
  const StyledDataGrid = styled(DataGrid)({
    '@media (hover: none)': {
      '&& .MuiDataGrid-menuIcon': {
        width: 0,
        visibility: 'hidden'
      },
      '&& .MuiDataGrid-sortIcon': {
        width: 0,
        visibility: 'hidden'
      }
    },
    '&& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-menuIcon': {
      width: 'auto',
      visibility: 'visible'
    },
    '&& .MuiDataGrid-columnHeader--sorted .MuiDataGrid-sortIcon': {
      width: 'auto',
      visibility: 'visible'
    }
  })

  const columns = [
    { flex: 0.5, field: 'id', headerName: 'Id', width: 90 },

    {
      field: 'maintenance_request_title',
      valueGetter: (value, row) => row?.title || '',
      headerName: 'Title',
      width: 300,
      flex: 2
    },

    {
      field: 'description',
      valueGetter: (value, row) => row?.description || '',
      headerName: 'Description',
      flex: 1
    },
    {
      field: 'media_evidence',
      valueGetter: (value, row) => (row?.media_url ? ' ✅' : '❌'),
      headerName: 'Media Evidence',
      flex: 1,
      width: 90
    },

    {
      field: 'unit',
      valueGetter: (value, row) => (row?.unit?.name && row?.unit?.id ? `${row.unit.name} (${row.unit.id})` : 'None'),
      headerName: 'Unit',
      flex: 1
    },
    {
      field: 'tenant',
      valueGetter: (value, row) =>
        row?.tenant?.name && row?.tenant?.id
          ? `${row.tenant.name} (${row.tenant.id})`
          : 'None',
      headerName: 'Tenant',
      flex: 1
    },
    {
      field: 'assignee',
      valueGetter: (value, row) =>
        row?.internal_assignee?.name
          ? row.internal_assignee.name + ' (Internal)'
          : row?.external_assignee
          ? row.external_assignee + ' (External)'
          : '',
      headerName: 'Assignee',
      flex: 1
    },
    {
      field: 'requester',
      valueGetter: (value, row) => {
        return row?.requester?.name || ''
      },
      headerName: 'Requested By',
      flex: 1
    },
    {
      field: 'status',
      renderCell: ({ row }) => {
        let statusLabel
        let statusColor

        // alert(JSON.stringify(row))

        switch (row?.status) {
          case 'active':
            statusLabel = 'Active'
            statusColor = 'success'
            break
          case 'pending':
            statusLabel = 'Pending'
            statusColor = 'warning' // or another color that represents pending status
            break
          case 'disabled':
            statusLabel = 'Disabled'
            statusColor = 'secondary'
            break
          default:
            statusLabel = 'Unknown'
            statusColor = 'secondary' // fallback color
        }

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
      },
      headerName: 'Status',
      flex: 1.2
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <RowOptions
          row={row}
          id={row.id}
          setPropertyData={setPropertyData}
          propertyData={propertyData}
          setMaintenanceRequestsData={setMaintenanceRequestsData}
          maintenanceRequestsData={maintenanceRequestsData}
        />
      )
    }
  ]

  const [addMaintenanceRequestOpen, setAddMaintenanceRequestOpen] = useState(false)
  const [maintenanceRequestsData, setMaintenanceRequestsData] = useState([])
  const [loading, setLoading] = useState(true)

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const [value, setValue] = useState('')
  const [statusValue, setStatusValue] = useState('')
  const [statuses, setStatuses] = useState([{ text: 'All', value: '' }])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const searchFiltered = filterMaintenanceRequests(maintenanceRequestsData, value)
  const filteredMaintenanceRequests = statusValue
    ? searchFiltered.filter(r => r.status === statusValue)
    : searchFiltered
  const toggleAddMaintenanceRequestDrawer = () => setAddMaintenanceRequestOpen(!addMaintenanceRequestOpen)

  useEffect(() => {
    if (propertyData && propertyData.maintenance_requests) {
      const built = buildMaintenanceRequests(propertyData)
      setMaintenanceRequestsData(built)
      setStatuses([
        { text: 'All', value: '' },
        ...Array.from(new Set(built.map(r => r.status).filter(Boolean))).map(status => ({
          text: status.charAt(0).toUpperCase() + status.slice(1),
          value: status
        }))
      ])
      setLoading(false)
    }
  }, [propertyData])

  return (
    <Grid container spacing={6}>
      <Grid size={12} lg={12}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <StyledDataGrid
              autoHeight
              rowHeight={62}
              loading={loading}
              rows={filteredMaintenanceRequests || []}
              columns={columns}
              slots={{ toolbar: CustomStatusToolbar, noRowsOverlay: CustomNoRowsOverlay }}
              slotProps={{
                toolbar: {
                  searchPlaceholder: 'Quick Search',
                  value: value,
                  addText: 'Add Maintenance Request',
                  statusValue: statusValue,
                  setStatusValue: setStatusValue,
                  statuses: statuses,
                  toggle: toggleAddMaintenanceRequestDrawer,
                  handleFilter: handleFilter
                }
              }}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    description: false
                  }
                }
              }}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </CardContent>
        </Card>
      </Grid>

      <PropertyAddMaintenanceRequestDrawer
        maintenanceRequestsData={maintenanceRequestsData}
        propertyData={propertyData}
        setPropertyData={setPropertyData}
        setMaintenanceRequestsData={setMaintenanceRequestsData}
        open={addMaintenanceRequestOpen}
        toggle={toggleAddMaintenanceRequestDrawer}
      />
    </Grid>
  )
}

export default PropertyViewMaintenance
