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
import AddTransaction from './AddTransactionDrawer'
import CustomNoRowsOverlay from '../CustomNoRowsOverlay'
import Select from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Hooks Imports
import { useTenants } from 'src/hooks/useTenants'
import AccountingTableHeader from './AccountingTableHeader'
import ServerSideToolbarTenantManage from 'src/views/table/data-grid/ServerSideToolbarTenantManage'
import CustomTenantToolbar from 'src/views/table/data-grid/CustomTenantToolbar'
import EditPropertyTenantDrawer from '../property/EditPropertyTenantDrawer'
import EditTransactionDrawer from './EditTransactionDrawer'

const RowOptions = ({ id, row, setTenantsData, tenantsData, setLoading }) => {
  const dispatch = useDispatch()
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
      >
        <MenuItem
          href={'/tenants/manage/' + id + '/account'}
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

        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Quick Suspend
        </MenuItem>
      </Menu>
      <EditTransactionDrawer
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

const AccountingTable = () => {
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
                href={'/tenants/manage/' + id + '/account'}
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
  const [paginationModel, setPaginationModel] = useState({ page: 1, pageSize: 25 })

  useEffect(() => {
    tenants.getTenants(
      { page: paginationModel.page, limit: paginationModel.pageSize },
      responseData => {
        const { data } = responseData
        setLoading(false)
        if (data?.status === 'FAILED') {
          alert(data.message || 'Failed to fetch tenants')

          return
        }

        setTenantsData(data)
        console.log(tenantsData)
      },
      error => {
        setLoading(false)

        console.error('Tenants Cannot be retrieved:', error)
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
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Transactions' />
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
                toolbar: CustomTenantToolbar,
                noRowsOverlay: CustomNoRowsOverlay

                // loadingOverlay: {
                //   variant: 'skeleton',
                //   noRowsVariant: 'skeleton'
                // }
              }}
              slotProps={{
                toolbar: {
                  searchPlaceholder: 'Quick Search',
                  value: value,
                  addText: 'Add Tenant',
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
      <AddTransaction
        tenantsData={tenantsData}
        setTenantsData={setTenantsData}
        open={addUserOpen}
        toggle={toggleAddUserDrawer}
      />
    </Grid>
  )
}

// export const getServerSideProps = async () => {}

export default AccountingTable
