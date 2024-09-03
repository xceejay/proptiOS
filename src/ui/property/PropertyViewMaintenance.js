// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'

import IconButton from '@mui/material/IconButton'

import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { DataGrid } from '@mui/x-data-grid'
import { CardActions, Menu, MenuItem } from '@mui/material'
import CustomNoRowsOverlay from '../CustomNoRowsOverlay'
import { useDispatch } from 'react-redux'
import PropertyAddMaintenanceRequestDrawer from './PropertyAddMaintenanceRequestDrawer'
import CustomTenantToolbar from 'src/views/table/data-grid/CustomTenantToolbar'

const RowOptions = ({ id, row, setPropertyData, propertyData }) => {
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
          <Icon icon='tabler:pencil' fontSize={20} />
          Modify MaintenanceRequest
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Quick Suspend
        </MenuItem>
      </Menu>
    </>
  )
}

const PropertyViewMaintenance = ({ setPropertyData, propertyData }) => {
  const columns = [
    { flex: 1, field: 'id', headerName: 'Request Id', width: 90 },

    // {
    //   field: 'maintenance_request_title',
    //   valueGetter: params => params.row?.title || '',
    //   headerName: 'Title',
    //   flex: 1,
    //   width: 300
    // },

    // {
    //   field: 'tenant_name',
    //   valueGetter: params => params.row.tenant?.name || '',
    //   headerName: 'Description',
    //   flex: 1,
    //   width: 300
    // },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <RowOptions row={row} id={row.id} setPropertyData={propertyData} propertyData={propertyData} />
      )
    }
  ]

  const [addMaintenanceRequestOpen, setAddMaintenanceRequestOpen] = useState(false)
  const [maintenance_requestsData, setMaintenanceRequestsData] = useState([])

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const [value, setValue] = useState('')

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const filteredMaintenanceRequests = maintenance_requestsData.filter(
    maintenance_request =>
      // maintenance_request.tenant?.name.toLowerCase().includes(value.toLowerCase()) ||
      maintenance_request?.title?.toLowerCase().includes(value.toLowerCase())

    // tenant.address.toLowerCase().includes(value.toLowerCase())
  )
  const toggleAddMaintenanceRequestDrawer = () => setAddMaintenanceRequestOpen(!addMaintenanceRequestOpen)

  useEffect(() => {
    if (propertyData && propertyData.maintenance_requests) {
      const maintenance_requests = propertyData.maintenance_requests.map(maintenance_request => {
        const foundMaintenanceRequest = propertyData.maintenance_requests.find(
          request => request.id === maintenance_request.id
        )

        return {
          ...maintenance_request,
          tenant: foundMaintenanceRequest || null
        }
      })

      setMaintenanceRequestsData(maintenance_requests)
    }
  }, [propertyData])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={24}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <DataGrid
              autoHeight
              rowHeight={62}
              loading={false} // Use the new loading state
              rows={filteredMaintenanceRequests || []}
              columns={columns}
              slots={{ toolbar: CustomTenantToolbar, noRowsOverlay: CustomNoRowsOverlay }}
              slotProps={{
                toolbar: {
                  searchPlaceholder: 'Quick Search',
                  value: value,
                  addText: 'Add Maintenance Request',

                  // title: '',
                  toggle: toggleAddMaintenanceRequestDrawer,
                  handleFilter: handleFilter
                }
              }}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent></CardContent>
        </Card>
      </Grid>

      <PropertyAddMaintenanceRequestDrawer
        maintenance_requestsData={maintenance_requestsData}
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
