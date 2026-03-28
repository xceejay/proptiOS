// ** React Imports
import { useState, useEffect, useCallback, useMemo } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { DataGrid } from '@mui/x-data-grid'
import AddUnitDrawer from './PropertyAddUnitDrawer'
import { Menu, MenuItem } from '@mui/material'
import CustomTenantToolbar from 'src/views/table/data-grid/CustomTenantToolbar'
import CustomNoRowsOverlay from '../CustomNoRowsOverlay'
import PropertyManageUnitDrawer from './PropertyManageUnitDrawer'

const RowOptions = ({ id, row, setPropertyData, propertyData, setLoading }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const rowOptionsOpen = Boolean(anchorEl)
  const [manageUnitOpen, setManageUnitOpen] = useState(false)
  const toggleManageUnitDrawer = () => setManageUnitOpen(!manageUnitOpen)

  const handleRowOptionsClick = event => {
    event.stopPropagation()
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
        {/* <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          href={'/properties/' + id}
          onClick={handleRowOptionsClose}
        >
          <Icon icon='tabler:eye' fontSize={20} />
          View
        </MenuItem> */}

        <MenuItem
          onClick={event => {
            event.stopPropagation()
            handleManage()
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='tabler:pencil' fontSize={20} />
          Manage
        </MenuItem>
        <MenuItem
          disabled
          onClick={event => {
            event.stopPropagation()
          }}
          sx={{ '& svg': { mr: 2 } }}
        >
          <Icon icon='tabler:trash' fontSize={20} />
          Quick Suspend (Unavailable)
        </MenuItem>
      </Menu>

      <PropertyManageUnitDrawer
        propertyData={propertyData}
        setPropertyData={setPropertyData}
        setLoading={setLoading}
        unitData={row}
        // setUnitsData={setUnitsData}
        open={manageUnitOpen}
        toggle={toggleManageUnitDrawer}
      />
    </>
  )
}

const PropertyViewUnits = ({ setPropertyData, propertyData }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(true) // New loading state

  const [addUnitOpen, setAddUnitOpen] = useState(false)
  // const [unitsData, setUnitsData] = useState([])
  const unitsData = useMemo(() => {
    if (propertyData && propertyData.units && propertyData.tenants) {
      return propertyData.units.map(unit => {
        const foundTenant = propertyData.tenants.find(tenant => tenant.id === unit.tenant_id)

        return {
          ...unit,
          tenant: foundTenant || null
        }
      })
    }

    return []
  }, [propertyData])

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const [value, setValue] = useState('')

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const columns = [
    { flex: 1, field: 'id', headerName: 'Unit Id', width: 90 },
    {
      field: 'unit_name',
      valueGetter: (value, row) => row?.name || '',
      headerName: 'Unit name',
      flex: 1,
      width: 300
    },
    {
      field: 'tenant_name',
      valueGetter: (value, row) => row.tenant?.name || '',
      headerName: 'Occupied Tenant',
      flex: 1,
      width: 300
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
          // setUnitsData={setUnitsData}
          setPropertyData={setPropertyData}
          propertyData={propertyData}
          setLoading={setLoading}
          id={row.id}
        />
      )
    }
  ]

  const [filteredUnits, setFilteredUnits] = useState([])

  useEffect(() => {
    if (unitsData) {
      const updatedFilteredUnits = unitsData.filter(
        unit =>
          (unit.tenant?.name?.toLowerCase() || '').includes(value.toLowerCase()) ||
          (unit?.name?.toLowerCase() || '').includes(value.toLowerCase())

        // tenant.address?.toLowerCase() || '').includes(value.toLowerCase())
      )

      setFilteredUnits(updatedFilteredUnits)
    }
  }, [value, unitsData])

  const toggleAddUnitDrawer = () => setAddUnitOpen(!addUnitOpen)
  const handleUnitClick = row => {
    if (!propertyData?.id || !row?.id) {
      return
    }

    router.push(`/properties/manage/${propertyData.id}/unit/${row.id}`)
  }

  return (
    <Grid container spacing={6}>
      <Grid size={12} lg={12}>
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <DataGrid
              autoHeight
              rowHeight={62}
              loading={false} // Use the new loading state
              rows={filteredUnits || []}
              columns={columns}
              slots={{ toolbar: CustomTenantToolbar, noRowsOverlay: CustomNoRowsOverlay }}
              slotProps={{
                toolbar: {
                  searchPlaceholder: 'Quick Search',
                  value: value,
                  addText: 'Add Unit',

                  // title: '',
                  toggle: toggleAddUnitDrawer,
                  handleFilter: handleFilter
                }
              }}
              disableRowSelectionOnClick
              onRowClick={({ row }) => handleUnitClick(row)}
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </CardContent>
        </Card>

        {/* <Card>
          <CardContent></CardContent>
        </Card> */}
      </Grid>

      <AddUnitDrawer
        unitsData={unitsData}
        propertyData={propertyData}
        setPropertyData={setPropertyData}
        // setUnitsData={setUnitsData}
        open={addUnitOpen}
        toggle={toggleAddUnitDrawer}
      />
    </Grid>
  )
}

export default PropertyViewUnits
