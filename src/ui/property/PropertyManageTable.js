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
import Select from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatsHorizontalWithDetails from 'src/@core/components/card-statistics/card-stats-horizontal-with-details'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser } from 'src/store/apps/user'
import { fetchProperties, addProperty } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from './TableHeader'
import AddUserDrawer from './AddPropertyDrawer'
import ServerSideToolbar from 'src/views/table/data-grid/ServerSideToolbar'
import ServerSideToolbarPropertyManage from 'src/views/table/data-grid/ServerSideToolbarPropertyManage'

// ** renders client column
const userRoleObj = {
  admin: { icon: 'tabler:device-laptop', color: 'secondary' },
  author: { icon: 'tabler:circle-check', color: 'success' },
  editor: { icon: 'tabler:edit', color: 'info' },
  maintainer: { icon: 'tabler:chart-pie-2', color: 'primary' },
  subscriber: { icon: 'tabler:user', color: 'warning' }
}

const userStatusObj = {
  active: 'success',
  pending: 'warning',
  inactive: 'secondary'
}

const properties = {
  statsHorizontalWithDetails: [
    {
      stats: '21,459',
      title: 'Session',
      trendDiff: '+29',
      icon: 'tabler:user',
      subtitle: 'Total Users'
    },
    {
      stats: '4,567',
      trendDiff: '+18',
      title: 'Paid Users',
      avatarColor: 'error',
      icon: 'tabler:user-plus',
      subtitle: 'Last week analytics'
    },
    {
      stats: '19,860',
      trendDiff: '-14',
      trend: 'negative',
      title: 'Active Users',
      avatarColor: 'success',
      icon: 'tabler:user-check',
      subtitle: 'Last week analytics'
    },
    {
      stats: '237',
      trendDiff: '+42',
      title: 'Pending Users',
      avatarColor: 'warning',
      icon: 'tabler:user-exclamation',
      subtitle: 'Last week analytics'
    }
  ]
}

const propertyData = {
  properties: [
    {
      id: 1,
      propertyName: 'Cozy Apartments',
      dateAdded: '2024-03-12',
      occupationStatus: 'Available',
      leaseAmount: 1200,
      amenities: ['Swimming Pool', 'Gym', 'Parking'],
      units: 10,
      tenantsPerUnit: 2,
      propertyLocation: '123 Main St, Anytown, USA',
      maintenanceStatus: 'Good',
      listingUrl: 'https://example.com/cozy-apartments',
      imageUrl: 'https://example.com/images/cozy-apartments.jpg'
    },
    {
      id: 2,
      propertyName: 'Downtown Lofts',
      dateAdded: '2024-03-10',
      occupationStatus: 'Occupied',
      leaseAmount: 2000,
      amenities: ['Rooftop Deck', 'Fitness Center', 'Pet Friendly'],
      units: 20,
      tenantsPerUnit: 1,
      propertyLocation: '456 Elm St, Cityville, USA',
      maintenanceStatus: 'Excellent',
      listingUrl: 'https://example.com/downtown-lofts',
      imageUrl: 'https://example.com/images/downtown-lofts.jpg'
    },
    {
      id: 3,
      propertyName: 'Seaside Condos',
      dateAdded: '2024-03-08',
      occupationStatus: 'Available',
      leaseAmount: 1800,
      amenities: ['Beach Access', 'Tennis Courts', 'Ocean View'],
      units: 15,
      tenantsPerUnit: 3,
      propertyLocation: '789 Ocean Ave, Beachtown, USA',
      maintenanceStatus: 'Fair',
      listingUrl: 'https://example.com/seaside-condos',
      imageUrl: 'https://example.com/images/seaside-condos.jpg'
    }
  ]
}

// ** renders client column
const renderClient = row => {
  if (row?.imageUrl?.length) {
    return <CustomAvatar src={row.imageUrl} sx={{ mr: 2.5, width: 38, height: 38 }} />
  } else {
    return (
      <CustomAvatar
        skin='light'
        color={row.avatarColor}
        sx={{ mr: 2.5, width: 38, height: 38, fontSize: '1rem', fontWeight: 500 }}
      >
        {getInitials(row.propertyName ? row.propertyName : 'No Property Name')}
      </CustomAvatar>
    )
  }
}

const RowOptions = ({ id }) => {
  // ** Hooks
  const dispatch = useDispatch()

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(deleteProperty(id))
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
        <MenuItem component={Link} sx={{ '& svg': { mr: 2 } }} href='/properties/id' onClick={handleRowOptionsClose}>
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem>
        {/* <MenuItem onClick={handleRowOptionsClose} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:edit' fontSize={20} />
          Edit
        </MenuItem> */}
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
    </>
  )
}

const columns = [
  {
    flex: 0.25,
    minWidth: 280,
    field: 'propertyName',
    headerName: 'Property Name',
    renderCell: ({ row }) => {
      const { propertyName, propertyLocation } = row

      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {renderClient(row)}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              component={Link}
              href='/properties/id'
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {propertyName}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {propertyLocation}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    field: 'type',
    minWidth: 170,
    headerName: 'Type',
    renderCell: ({ row }) => {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar
            skin='light'
            sx={{ mr: 4, width: 30, height: 30 }}
            color={userRoleObj[row.role]?.color || 'primary'}
          >
            <Icon icon={userRoleObj[row.role]?.icon} />
          </CustomAvatar>
          <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {row.role}
          </Typography>
        </Box>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 120,
    headerName: 'prospects',
    field: 'prospects',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
          {row.currentPlan}
        </Typography>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 190,
    field: 'tenants',
    headerName: 'tenants',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.billing}
        </Typography>
      )
    }
  },
  {
    flex: 0.1,
    minWidth: 110,
    field: 'maintenance',
    headerName: 'Maintenance',
    renderCell: ({ row }) => {
      return (
        <CustomChip
          rounded
          skin='light'
          size='small'
          label={row.status}
          color={userStatusObj[row.status]}
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

const PropertyManageTable = ({ apiData }) => {
  // ** State
  const [role, setRole] = useState('')
  const [plan, setPlan] = useState('')
  const [value, setValue] = useState('')
  const [status, setStatus] = useState('')
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch()
  const store = useSelector(state => state.propertyData)
  useEffect(() => {
    dispatch(
      fetchProperties({
        // role,
        // status,
        q: value

        // currentPlan: plan
      })
    )
  }, [dispatch, plan, role, status, value])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const handleRoleChange = useCallback(e => {
    setRole(e.target.value)
  }, [])

  const handlePlanChange = useCallback(e => {
    setPlan(e.target.value)
  }, [])

  const handleStatusChange = useCallback(e => {
    setStatus(e.target.value)
  }, [])
  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        {apiData && (
          <Grid container spacing={6}>
            {apiData.statsHorizontalWithDetails.map((item, index) => {
              return (
                <Grid item xs={12} md={3} sm={6} key={index}>
                  <CardStatsHorizontalWithDetails {...item} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Search Properties' />
          <CardContent></CardContent>
          <Divider sx={{ m: '0 !important' }} />
          <TableHeader
            rows={propertyData.properties}
            columns={columns}
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddUserDrawer}
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={propertyData.properties}
            columns={columns}
            slots={{ toolbar: ServerSideToolbarPropertyManage }}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
          />
        </Card>
      </Grid>

      <addProperty open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('/properties')
  const apiData = res.data

  return {
    props: {
      apiData
    }
  }
}

export default PropertyManageTable
