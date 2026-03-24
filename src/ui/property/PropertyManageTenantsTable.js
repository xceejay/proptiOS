// ** React Imports
import { useState, useEffect, useCallback, useMemo } from 'react'

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
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import CustomNoRowsOverlay from '../CustomNoRowsOverlay'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Hooks Imports
import TenantTableHeader from '../tenant/TenantTableHeader'
import ServerSideToolbarTenantManage from 'src/views/table/data-grid/ServerSideToolbarTenantManage'
import PropertyAddTenantDrawer from './PropertyAddTenantDrawer'
import PropertyAddExistingTenantDrawer from './PropertyAddExistingTenantDrawer'
import EditPropertyTenantDrawer from './EditPropertyTenantDrawer'

const RowOptions = ({ id, row, setPropertyData, propertyData, setLoading }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const [editTenantOpen, setEditTenantOpen] = useState(false)
  const toggleEditTenantDrawer = () => setEditTenantOpen(!editTenantOpen)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    handleRowOptionsClose()
  }

  const handleEdit = () => {
    setEditTenantOpen(true)
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
          href={'/tenants/manage/' + id + '/summary'}
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={handleEdit} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:pencil' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem disabled sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Quick Suspend (Unavailable)
        </MenuItem>
      </Menu>
      <EditPropertyTenantDrawer
        propertyData={propertyData}
        setPropertyData={setPropertyData}
        setLoading={setLoading}
        tenantData={row}
        // setTenantsData={setTenantsData}
        open={editTenantOpen}
        toggle={toggleEditTenantDrawer}
      />
    </>
  )
}

const PropertyTenantManageTable = ({ setPropertyData, propertyData }) => {
  // const [tenantsData, setTenantsData] = useState([])
  const tenantsData = useMemo(() => {
    if (propertyData?.tenants) {
      return propertyData?.tenants.map(tenant => {
        // Find units that belong to the current tenant
        const tenantUnits = (propertyData?.units ?? []).filter(unit => unit.tenant_id === tenant.id)

        // Attach the units array to the tenant data
        return { ...tenant, units: tenantUnits }
      })
    }

    return []
  }, [propertyData?.tenants, propertyData?.units])
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(true) // New loading state
  const [existingTenantOpen, setExistingTenantOpen] = useState(false)

  const [addUserOpen, setAddUserOpen] = useState(false)

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })

  const columns = [
    {
      flex: 0.25,
      minWidth: 280,
      field: 'name',
      headerName: 'Name',
      renderCell: ({ row }) => {
        const { id, name, email } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography
                noWrap
                component={Link}
                href={'/tenants/manage/' + id + '/summary'}
                sx={{
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                {name}
              </Typography>
              <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
                {email}
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0.15,
      minWidth: 190,
      field: 'address',
      headerName: 'Address',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.address}
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
      flex: 0.15,
      minWidth: 190,
      field: 'units',
      headerName: 'Units',
      renderCell: ({ row }) => {
        // Check if the tenant has any units assigned
        if (row.units && row.units.length > 0) {
          return (
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              {row.units.map(unit => unit.name).join(', ')} {/* Assuming each unit has a 'name' property */}
            </Typography>
          )
        } else {
          return (
            <Typography noWrap sx={{ color: 'text.secondary' }}>
              No units assigned
            </Typography>
          )
        }
      }
    },
    {
      flex: 0.15,
      minWidth: 190,
      field: 'tel_number',
      headerName: 'Phone Number',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.tel_number}
        </Typography>
      )
    },

    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: 'Status',
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
          row={row}
          // setTenantsData={setTenantsData}
          setPropertyData={setPropertyData}
          propertyData={propertyData}
          setLoading={setLoading}
          id={row.id}
        />
      )
    }
  ]

  useEffect(() => {
    // setLoading(true)
    if (propertyData) {
      setLoading(false)
    }
  }, [propertyData])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  const toggleExistingTenantDrawer = () => setExistingTenantOpen(!existingTenantOpen)

  const [filteredTenants, setFilteredTenants] = useState([])

  useEffect(() => {
    if (tenantsData) {
      const updatedFilteredTenants = tenantsData.filter(
        tenant =>
          (tenant.name?.toLowerCase() || '').includes(value.toLowerCase()) ||
          (tenant.email?.toLowerCase() || '').includes(value.toLowerCase())
      )

      console.log('are you triggering')

      setFilteredTenants(updatedFilteredTenants)
    }
  }, [value, tenantsData])

  return (
    <Grid container spacing={6.5}>
      <Grid size={12}>
        <Card>
          <CardHeader title='Tenants' />
          <CardContent>
            {console.log('rendered again')}
            <TenantTableHeader
              rows={filteredTenants}
              columns={columns}
              value={value}
              handleFilter={handleFilter}
              toggle={toggleAddUserDrawer}
              toggleExisting={toggleExistingTenantDrawer}
            />
            <DataGrid
              loading={loading}
              autoHeight
              rowHeight={62}
              rows={filteredTenants || []}
              columns={columns}
              slots={{
                toolbar: ServerSideToolbarTenantManage,
                noRowsOverlay: CustomNoRowsOverlay

                // loadingOverlay: {
                //   variant: 'skeleton',
                //   noRowsVariant: 'skeleton'
                // }
              }}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    // Hide columns status and traderName, the other columns will remain visible
                    country: false,
                    units: true,
                    address: false
                  }
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
      <PropertyAddTenantDrawer
        propertyData={propertyData}
        setPropertyData={setPropertyData}
        open={addUserOpen}
        toggle={toggleAddUserDrawer}
      />

      <PropertyAddExistingTenantDrawer
        propertyData={propertyData}
        setPropertyData={setPropertyData}
        open={existingTenantOpen}
        toggle={toggleExistingTenantDrawer}
      />
    </Grid>
  )
}

// export const getServerSideProps = async () => {}

export default PropertyTenantManageTable
