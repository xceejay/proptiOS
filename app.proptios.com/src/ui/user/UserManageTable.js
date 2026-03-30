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
import AddUserDrawer from './AddUserDrawer'
import CustomNoRowsOverlay from '../CustomNoRowsOverlay'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Hooks Imports
import { useUsers } from 'src/hooks/useUsers'
import { useAuth } from 'src/hooks/useAuth'
import EditUserDrawer from './EditUserDrawer'
import toast from 'react-hot-toast'
import CustomUsersToolbar from 'src/views/table/data-grid/CustomUsersToolbar'
import { filterUsers } from './userManageFilters'

const RowOptions = ({ id, row, setUsersData, usersData, setLoading, currentUserEmail }) => {
  const isSelf = row.email === currentUserEmail
  const [anchorEl, setAnchorEl] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const rowOptionsOpen = Boolean(anchorEl)

  const [editUserOpen, setEditUserOpen] = useState(false)
  const toggleEditUserDrawer = () => setEditUserOpen(!editUserOpen)

  const users = useUsers()

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDisable = () => {
    if (actionLoading) return
    setActionLoading(true)
    setLoading(true)
    users.DisableUser(
      { email: row.email },
      responseData => {
        let { data } = responseData
        setLoading(false)
        setActionLoading(false)

        if (data?.status === 'NO_RES') { /* no action needed */ } else if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to disable user')

          return
        }

        toast.success('Disabled ' + row.email, {
          duration: 5000
        })

        setUsersData(prevData => {
          const updatedItems = prevData.items.map(user =>
            user.email === row.email ? { ...user, status: 'disabled' } : user
          )

          return { ...prevData, items: updatedItems }
        })
      },
      error => {
        setLoading(false)
        setActionLoading(false)
        toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
      }
    )
    handleRowOptionsClose()
  }

  const handleEnable = () => {
    if (actionLoading) return
    setActionLoading(true)
    setLoading(true)
    users.EnableUser(
      { email: row.email },
      responseData => {
        let { data } = responseData
        setLoading(false)
        setActionLoading(false)

        if (data?.status === 'NO_RES') { /* no action needed */ } else if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to enable user')

          return
        }

        toast.success('Activated ' + row.email, {
          duration: 5000
        })

        setUsersData(prevData => {
          const updatedItems = prevData.items.map(user =>
            user.email === row.email ? { ...user, status: 'active' } : user
          )

          return { ...prevData, items: updatedItems }
        })
      },
      error => {
        setLoading(false)
        setActionLoading(false)
        toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
      }
    )
    handleRowOptionsClose()
  }
  const handleEdit = () => {
    setEditUserOpen(true)
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='medium' onClick={handleRowOptionsClick}>
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
          href={'/users/manage/' + id + '/transactions'}
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

        {!isSelf && (
          <MenuItem onClick={handleEnable} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='tabler:user-check' fontSize={20} />
            Enable Account
          </MenuItem>
        )}
        {!isSelf && (
          <MenuItem onClick={handleDisable} sx={{ '& svg': { mr: 2 } }}>
            <Icon icon='tabler:user-x' fontSize={20} />
            Disable Account
          </MenuItem>
        )}
      </Menu>
      <EditUserDrawer
        setLoading={setLoading}
        userData={row}
        setUsersData={setUsersData}
        usersData={usersData}
        open={editUserOpen}
        toggle={toggleEditUserDrawer}
      />
    </>
  )
}

const UserManageTable = () => {
  const roleLabels = {
    property_manager: 'Property Manager',
    property_coordinator: 'Property Coordinator',
    maintenance_worker: 'Maintenance Worker',
    finance_staff: 'Finance Staff',
    vendor: 'Vendor',
    inspector: 'Inspector'
  }
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
                href={'/users/manage/' + id + '/transactions'}
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

    // {
    //   flex: 0.15,
    //   minWidth: 190,
    //   field: 'address',
    //   headerName: 'Address',
    //   renderCell: ({ row }) => (
    //     <Typography noWrap sx={{ color: 'text.secondary' }}>
    //       {row.address}
    //     </Typography>
    //   )
    // },
    {
      flex: 0.15,
      minWidth: 190,
      field: 'role',
      headerName: 'Role',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {roleLabels[row.user_type] || 'Unknown Role'}
        </Typography>
      )
    },
    // {
    //   flex: 0.15,
    //   minWidth: 190,
    //   field: 'property',
    //   headerName: 'Properties Created',
    //   renderCell: ({ row }) => (
    //     <Typography noWrap sx={{ color: 'text.secondary' }}>
    //       {row.properties.length}
    //     </Typography>
    //   )
    // },

    {
      flex: 0.15,
      minWidth: 190,
      field: 'invitation_status',
      headerName: 'Invitation Status',
      renderCell: ({ row }) => {
        let statusLabel
        let statusColor

        switch (row?.invitation_status) {
          case 'pending':
            statusLabel = 'Pending'
            statusColor = 'warning' // pending status color
            break
          case 'expired':
            statusLabel = 'Expired'
            statusColor = 'error' // color representing expired
            break
          case 'accepted':
            statusLabel = 'Accepted'
            statusColor = 'primary' // color representing accepted
            break
          case 'resent':
            statusLabel = 'Resent'
            statusColor = 'info' // color representing resent status
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
      }
    },

    {
      flex: 0.1,
      minWidth: 110,
      field: 'status',
      headerName: 'Account Status',
      renderCell: ({ row }) => {
        let statusLabel
        let statusColor

        switch (row.status) {
          case 'active':
            statusLabel = 'Active'
            statusColor = 'success'
            break
          case 'inactive':
            statusLabel = 'Inactive'
            statusColor = 'secondary'
            break
          case 'disabled':
            statusLabel = 'Disabled'
            statusColor = 'error'
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
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        <RowOptions setLoading={setLoading} setUsersData={setUsersData} usersData={usersData} id={row.id} row={row} currentUserEmail={currentUserEmail} />
      )
    }
  ]

  const users = useUsers()
  const auth = useAuth()
  const currentUserEmail = auth.user?.email
  const [loading, setLoading] = useState(true) // New loading state

  const [usersData, setUsersData] = useState({ items: [] })
  const [value, setValue] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 25 })
  const [statusValue, setStatusValue] = useState('')
  const [invitationStatusValue, setInvitationStatusValue] = useState('')

  const invitationStatuses = [
    { text: 'All', value: '' },
    { text: 'Pending', value: 'pending' },
    { text: 'Expired', value: 'expired' },
    { text: 'Accepted', value: 'accepted' },
    { text: 'Resent', value: 'resent' }
  ]

  const statuses = [
    { text: 'All', value: '' },
    { text: 'Active', value: 'active' },
    { text: 'Inactive', value: 'inactive' },
    { text: 'Disabled', value: 'disabled' }
  ]

  useEffect(() => {
    users.getUsers(
      { page: paginationModel.page, limit: paginationModel.pageSize },
      responseData => {
        const { data } = responseData
        setLoading(false)

        if (data?.status === 'NO_RES') { /* no action needed */ } else if (data?.status === 'FAILED') {
          alert(data.message || 'Failed to fetch users')

          return
        }

        setUsersData(data)
        console.log(usersData)
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

  const filteredUsers = useMemo(() => {
    return filterUsers({
      users: usersData?.items || [],
      search: value,
      status: statusValue,
      invitationStatus: invitationStatusValue
    })
  }, [invitationStatusValue, statusValue, usersData, value])

  return (
    <Grid container spacing={6.5}>
      <Grid size={12}>
        <Card>
          <CardHeader title='Manage Users' />
          <CardContent>
            {/* <UserTableHeader
              rows={filteredUsers}
              columns={columns}
              value={value}
              handleFilter={handleFilter}
              toggle={toggleAddUserDrawer}
            /> */}
            <DataGrid
              loading={false}
              autoHeight
              rowHeight={62}
              rows={filteredUsers || []}
              columns={columns}
              slots={{
                toolbar: CustomUsersToolbar,
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
                  // addText: 'Add User',
                  statusValue: statusValue,
                  setStatusValue: setStatusValue,
                  invitationStatusValue: invitationStatusValue,
                  setInvitationStatusValue: setInvitationStatusValue,
                  statuses: statuses,
                  invitationStatuses: invitationStatuses,

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
        usersData={usersData}
        setUsersData={setUsersData}
        open={addUserOpen}
        toggle={toggleAddUserDrawer}
      />
    </Grid>
  )
}

// export const getServerSideProps = async () => {}

export default UserManageTable
