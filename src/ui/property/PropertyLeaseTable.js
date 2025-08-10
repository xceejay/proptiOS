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
import { DataGrid } from '@mui/x-data-grid'
import Select from '@mui/material/Select'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomNoRowsOverlay from '../CustomNoRowsOverlay'

// ** Hooks Imports
import { useLeases } from 'src/hooks/useLeases'

// ** Components

import CustomLeaseToolbar from 'src/views/table/data-grid/CustomLeaseToolbar'

const RowOptions = ({ id, row, setLeasesData, leasesData, setLoading }) => {
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [editLeaseOpen, setEditLeaseOpen] = useState(false)

  const toggleEditLeaseDrawer = () => setEditLeaseOpen(!editLeaseOpen)

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
    setEditLeaseOpen(true)
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
          href={'/leases/view/' + id}
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View Lease
        </MenuItem>

        {/* <MenuItem onClick={() => handleEdit()} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:pencil' fontSize={20} />
          Edit
        </MenuItem> */}

        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete Lease
        </MenuItem>
      </Menu>
      {/* <EditLeaseDrawer
        setLoading={setLoading}
        leaseData={row}
        setLeasesData={setLeasesData}
        leasesData={leasesData}
        open={editLeaseOpen}
        toggle={toggleEditLeaseDrawer}
      /> */}
    </>
  )
}

const PropertyLeaseTable = ({ setPropertyData, propertyData }) => {
  const columns = [
    {
      flex: 0.25,
      minWidth: 150,
      field: 'name',
      headerName: 'Tenant',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              component={Link}
              href={'/tenants/manage/' + row.id + '/transactions'}
              sx={{
                fontWeight: 500,
                textDecoration: 'none',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {row.tenant?.name}
            </Typography>
            <Typography noWrap variant='body2' sx={{ color: 'text.disabled' }}>
              {row.tenant?.email}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      flex: 0.2,
      minWidth: 150,
      field: 'lease_type',
      headerName: 'Lease Type',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.type}
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
          {row.property_name}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 190,
      field: 'unit',
      headerName: 'Unit',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.unit?.name}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 190,
      field: 'start_date',
      headerName: 'Start Date',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.start_date}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 190,
      field: 'end_date',
      headerName: 'End Date',
      renderCell: ({ row }) => (
        <Typography noWrap sx={{ color: 'text.secondary' }}>
          {row.end_date}
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
          setLeasesData={setLeasesData}
          leasesData={leasesData}
          id={row.id}
          row={row}
        />
      )
    }
  ]

  const leases = useLeases()
  const [loading, setLoading] = useState(true) // New loading state

  const [leasesData, setLeasesData] = useState([])
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [dates, setDates] = useState([])
  const [value, setValue] = useState('')
  // const [endDateRange, setEndDateRange] = useState(null)
  // const [selectedRows, setSelectedRows] = useState([])
  // const [startDateRange, setStartDateRange] = useState(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [statusValue, setStatusValue] = useState('')
  const [statuses, setStatuses] = useState([])

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    if (start !== null && end !== null) {
      setDates(dates)
    }
    setStartDateRange(start)
    setEndDateRange(end)
  }

  useEffect(() => {
    // leases.getAllLeases(
    //   { page: paginationModel.page, limit: paginationModel.pageSize },
    //   responseData => {
    //     const { data } = responseData
    //     setLoading(false)
    //
    // if(data?.status === "NO_RES"){
    //   console.log("NO results")
    // } else if (data?.status === 'FAILED') {
    //       alert(data.message || 'Failed to fetch leases')

    //       return
    //     }

    //     setLeasesData(data)
    //     console.log(leasesData)
    //   },
    //   error => {
    //     setLoading(false)

    //
    // toast.error(error.response?.data?.description || "An error occurred. Please try again or contact support.", {
    //   duration: 5000
    // })
    //   }
    // )
    if (propertyData) {
      const structuredLeases = propertyData.leases.map(lease => {
        const tenant = propertyData.tenants.find(t => t.id === lease.tenant_id)
        const unit = propertyData.units.find(u => u.id === lease.unit_id)

        return {
          ...lease,
          property_name: propertyData.name, // Attach the property name
          tenant: tenant || null, // Attach tenant object or null if not found
          unit: unit || null // Attach unit object or null if not found
        }
      })

      // Final structured leases
      console.log(structuredLeases)

      setLeasesData(structuredLeases)

      // console.log(leasesData)
    }
  }, [propertyData])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)

  // Filter leases based on the search value
  const filteredLeases = leasesData?.filter(
    lease =>
      (lease.tenant?.name?.toLowerCase() || '').includes(value.toLowerCase()) ||
      (lease.property?.name?.toLowerCase() || '').includes(value.toLowerCase()) ||
      (lease.unit?.name?.toLowerCase() || '').includes(value.toLowerCase())
  )

  return (
    <Grid container spacing={6}>
      {/* <Grid size={12}>
        <Card sx={{ p: 0 }}>
          <CardHeader title='Filters' />
          <CardContent>
            <Grid container spacing={6}>
              <Grid size={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id='invoice-status-select'>Invoice Status</InputLabel>

                  <Select
                    fullWidth
                    value={statusValue}
                    sx={{ mr: 4, mb: 2 }}
                    label='Invoice Status'
                    onChange={handleStatusValue}
                    labelId='invoice-status-select'
                  >
                    <MenuItem value=''>none</MenuItem>
                    <MenuItem value='downloaded'>Downloaded</MenuItem>
                    <MenuItem value='draft'>Draft</MenuItem>
                    <MenuItem value='paid'>Paid</MenuItem>
                    <MenuItem value='partial payment'>Partial Payment</MenuItem>
                    <MenuItem value='past due'>Past Due</MenuItem>
                    <MenuItem value='sent'>Sent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={12} sm={6}>
                <DatePicker
                  isClearable
                  selectsRange
                  monthsShown={2}
                  endDate={endDateRange}
                  selected={startDateRange}
                  startDate={startDateRange}
                  shouldCloseOnSelect={false}
                  id='date-range-picker-months'
                  onChange={handleOnChangeRange}
                  customInput={
                    <CustomInput
                      dates={dates}
                      setDates={setDates}
                      label='Invoice Date'
                      end={endDateRange}
                      start={startDateRange}
                    />
                  }
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid> */}
      <Grid size={12}>
        <DataGrid
          loading={false}
          autoHeight
          rowHeight={62}
          rows={filteredLeases || []}
          columns={columns}
          slots={{
            toolbar: CustomLeaseToolbar,
            noRowsOverlay: CustomNoRowsOverlay
          }}
          slotProps={{
            toolbar: {
              searchPlaceholder: 'Quick Search',
              value: value,
              addText: 'Create Lease',
              statusValue: statusValue,
              setStatusValue: setStatusValue,
              statuses: statuses,
              // toggle: toggleAddUserDrawer,
              handleFilter: handleFilter
            }
          }}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
        {/* <AddLeaseDrawer
          leasesData={leasesData}
          setLeasesData={setLeasesData}
          open={addUserOpen}
          toggle={toggleAddUserDrawer}
        /> */}
      </Grid>
    </Grid>
  )
}

export default PropertyLeaseTable
