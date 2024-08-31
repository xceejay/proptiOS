// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import AlertTitle from '@mui/material/AlertTitle'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import OutlinedInput from '@mui/material/OutlinedInput'
import DialogContent from '@mui/material/DialogContent'
import InputAdornment from '@mui/material/InputAdornment'
import TableContainer from '@mui/material/TableContainer'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { DataGrid } from '@mui/x-data-grid'
import AddUnitDrawer from './PropertyAddUnitDrawer'
import { CardActions } from '@mui/material'
import CustomTenantToolbar from 'src/views/table/data-grid/CustomTenantToolbar'
import CustomNoRowsOverlay from '../CustomNoRowsOverlay'

const columns = [
  { flex: 1, field: 'id', headerName: 'Unit Id', width: 90 },
  {
    field: 'tenant_name',
    valueGetter: params => params.row.tenant?.name || '',
    headerName: 'Occupied Tenant',
    flex: 1,
    width: 300
  }
]

const PropertyViewUnits = (setPropertyData, propertyData) => {
  const [addUnitOpen, setAddUnitOpen] = useState(false)
  const [unitsData, setUnitsData] = useState([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const [value, setValue] = useState('')

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const toggleAddUnitDrawer = () => setAddUnitOpen(!addUnitOpen)

  useEffect(() => {
    if (propertyData && propertyData.units && propertyData.tenants) {
      const units = propertyData.units.map(unit => {
        const foundTenant = propertyData.tenants.find(tenant => tenant.id === unit.unit_tenant_id)

        return {
          ...unit,
          tenant: foundTenant || null
        }
      })
      setUnitsData(units)
    }
  }, [propertyData])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12} lg={24}>
        <Card>
          <CardHeader title='Units' sx={{ pb: 1.5 }} />
          <Divider></Divider>

          <CardContent>
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ height: 400, width: '100%' }}>
                  <DataGrid
                    autoHeight
                    rowHeight={62}
                    loading={false} // Use the new loading state
                    rows={unitsData || []}
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
                    pageSizeOptions={[10, 25, 50]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                  />
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent></CardContent>
            </Card>
          </CardContent>
        </Card>
      </Grid>

      <AddUnitDrawer
        unitsData={unitsData}
        propertyData={propertyData}
        setPropertyData={setPropertyData}
        setUnitsData={setUnitsData}
        open={addUnitOpen}
        toggle={toggleAddUnitDrawer}
      />
    </Grid>
  )
}

export default PropertyViewUnits
