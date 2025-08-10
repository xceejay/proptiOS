// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

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
import AddUserDrawer from './AddTenantDrawer'
import CustomNoRowsOverlay from '../CustomNoRowsOverlay'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Hooks Imports
import { useTenants } from 'src/hooks/useTenants'
import EditTenantDrawer from './EditTenantDrawer'
import CustomStatusToolbar from 'src/views/table/data-grid/CustomStatusToolbar'

const RowOptions = ({ id, row, stopPropagation, setTenantsData, tenantsData, setLoading }) => {
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [editTenantOpen, setEditTenantOpen] = useState(false)
  const toggleEditTenantDrawer = () => setEditTenantOpen(!editTenantOpen)

  const handleRowOptionsClick = event => {
    stopPropagation(event)

    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDisable = () => {
    setLoading(true)
    users.DisableUser(
      { email: row.email },
      responseData => {
        let { data } = responseData
        setLoading(false)

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to disable user')
          setError('email', {
            type: 'manual',
            message: data.description || 'Unknown error occurred'
          })
          return
        }

        toast.success('Disabled ' + row.email, {
          duration: 5000
        })

        // Update usersData with the new status
        setUsersData(prevData => {
          const updatedItems = prevData.items.map(user =>
            user.email === row.email ? { ...user, status: 'disabled' } : user
          )

          return { ...prevData, items: updatedItems }
        })
      },
      error => {
        toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
      }
    )
    handleRowOptionsClose()
  }

  const handleEnable = () => {
    setLoading(true)
    users.EnableUser(
      { email: row.email },
      responseData => {
        let { data } = responseData
        setLoading(false)

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to disable user')
          setError('email', {
            type: 'manual',
            message: data.description || 'Unknown error occurred'
          })
          return
        }

        toast.success('Activated ' + row.email, {
          duration: 5000
        })

        // Update usersData with the new status
        setUsersData(prevData => {
          const updatedItems = prevData.items.map(user =>
            user.email === row.email ? { ...user, status: 'active' } : user
          )

          return { ...prevData, items: updatedItems }
        })
      },
      error => {
        toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
      }
    )
    handleRowOptionsClose()
  }

  const handleDelete = () => {
    dispatch(deleteUser(id))
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
        onClick={e => stopPropagation(e)}
      >
        <MenuItem
          href={'/tenants/manage/' + id + '/transactions'}
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>

        <MenuItem onClick={() => handleEdit()} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:pencil' fontSize={20} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleEnable} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:user-check' fontSize={20} />
          Enable Account
        </MenuItem>
        <MenuItem onClick={handleDisable} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:user-x' fontSize={20} />
          Disable Account
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete Account
        </MenuItem>
      </Menu>
      <EditTenantDrawer
        setLoading={setLoading}
        tenantData={row}
        setTenantsData={setTenantsData}
        tenantsData={tenantsData}
        open={editTenantOpen}
        toggle={toggleEditTenantDrawer}
      />
    </>
  )
}

const TenantManageTable = () => {
  const router = useRouter()
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
                href={'/tenants/manage/' + id + '/transactions'}
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
      field: 'property',
      headerName: 'Property',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.property?.name}
        </Typography>
      )
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
          stopPropagation={e => e.stopPropagation()}
          setLoading={setLoading}
          setTenantsData={setTenantsData}
          tenantsData={tenantsData}
          id={row.id}
          row={row}
        />
      )
    }
  ]

  const tenants = useTenants()
  const [loading, setLoading] = useState(true) // New loading state

  const [tenantsData, setTenantsData] = useState({ items: [] })
  const [value, setValue] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })
  const [statusValue, setStatusValue] = useState('')
  const [statuses, setStatuses] = useState([
    { text: 'All', value: '' },

    { text: 'Active', value: 'active' },
    { text: 'Inactive', value: 'inactive' }
  ])

  useEffect(() => {
    tenants.getTenants(
      { page: paginationModel.page, limit: paginationModel.pageSize },
      responseData => {
        const { data } = responseData
        setLoading(false)

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
          alert(data.message || 'Failed to fetch tenants')

          return
        }

        setTenantsData(data)
        console.log(tenantsData)
      },
      error => {
        setLoading(false)

        toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
      }
    )
  }, [paginationModel])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  // Filter tenants based on the search value
  const filteredTenants = tenantsData.items.filter(
    tenant =>
      (tenant.name?.toLowerCase() || '').includes(value.toLowerCase()) ||
      (tenant.email?.toLowerCase() || '').includes(value.toLowerCase()) ||
      (tenant.address?.toLowerCase() || '').includes(value.toLowerCase())
  )

  return (
    <Grid container spacing={6.5}>
      <Grid size={12}>
        <Card>
          <CardHeader title='Tenants' />
          <CardContent>
            {/* <TenantTableHeader
              rows={filteredTenants}
              columns={columns}
              value={value}
              handleFilter={handleFilter}
              toggle={toggleAddUserDrawer}
            /> */}
            <DataGrid
              loading={loading}
              autoHeight
              rowHeight={62}
              rows={filteredTenants || []}
              columns={columns}
              slots={{
                toolbar: CustomStatusToolbar,
                noRowsOverlay: CustomNoRowsOverlay

                // loadingOverlay: {
                //   variant: 'skeleton',
                //   noRowsVariant: 'skeleton'
                // }
              }}
              filterModel={{
                items: [{ field: 'status', operator: 'equals', value: statusValue }]
              }}
              slotProps={{
                toolbar: {
                  searchPlaceholder: 'Quick Search',
                  value: value,
                  addText: 'Add Tenant',
                  statusValue: statusValue,
                  setStatusValue: setStatusValue,
                  statuses: statuses,
                  toggle: toggleAddUserDrawer,
                  handleFilter: handleFilter
                }
              }}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onRowClick={params => router.push(`/tenants/manage/${params.id}/`)}
              sx={{
                '& .MuiDataGrid-row': {
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }
              }}
            />
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
        </Card>
      </Grid>
      <AddUserDrawer
        tenantsData={tenantsData}
        setTenantsData={setTenantsData}
        open={addUserOpen}
        toggle={toggleAddUserDrawer}
      />
    </Grid>
  )
}

// export const getServerSideProps = async () => {}

export default TenantManageTable
