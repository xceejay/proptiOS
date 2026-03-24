// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomNoRowsOverlay from '../CustomNoRowsOverlay'

// ** Components
import CustomLeaseToolbar from 'src/views/table/data-grid/CustomLeaseToolbar'

const RowOptions = ({ id, row, setLeasesData, leasesData, setLoading }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
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

        <MenuItem
          href={'/leases/edit/' + id}
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:pencil' fontSize={20} />
          Edit Lease
        </MenuItem>

        <MenuItem disabled sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='tabler:trash' fontSize={20} />
          Delete Lease (Unavailable)
        </MenuItem>
      </Menu>
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
      valueGetter: (value, row) => row?.tenant?.name || '',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
            <Typography
              noWrap
              component={Link}
              href={row.tenant?.id ? '/tenants/manage/' + row.tenant.id + '/summary' : '#'}
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
      valueGetter: (value, row) => row?.type || '',
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
      valueGetter: (value, row) => row?.property_name || '',
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
      valueGetter: (value, row) => row?.unit?.name || '',
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

  const [loading, setLoading] = useState(true)

  const [leasesData, setLeasesData] = useState([])
  const [value, setValue] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [statusValue, setStatusValue] = useState('')
  const [statuses, setStatuses] = useState([{ text: 'All', value: '' }])

  useEffect(() => {
    if (propertyData) {
      const structuredLeases = (propertyData?.leases ?? []).map(lease => {
        const tenant = (propertyData?.tenants ?? []).find(t => t.id === lease.tenant_id)
        const unit = (propertyData?.units ?? []).find(u => u.id === lease.unit_id)

        return {
          ...lease,
          property_name: propertyData.name,
          tenant: tenant || null,
          unit: unit || null
        }
      })

      setLeasesData(structuredLeases)
      setStatuses([
        { text: 'All', value: '' },
        ...Array.from(new Set(structuredLeases.map(lease => lease.status).filter(Boolean))).map(status => ({
          text: status.charAt(0).toUpperCase() + status.slice(1),
          value: status
        }))
      ])
      setLoading(false)
    }
  }, [propertyData])

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  // Filter leases based on the search value
  const filteredLeases = leasesData?.filter(
    lease =>
      ((lease.tenant?.name?.toLowerCase() || '').includes(value.toLowerCase()) ||
        (lease.property_name?.toLowerCase() || '').includes(value.toLowerCase()) ||
        (lease.unit?.name?.toLowerCase() || '').includes(value.toLowerCase())) &&
      (!statusValue || lease.status === statusValue)
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
          loading={loading}
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
              handleFilter: handleFilter
            }
          }}
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
      </Grid>
    </Grid>
  )
}

export default PropertyLeaseTable
