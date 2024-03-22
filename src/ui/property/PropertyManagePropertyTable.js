import { Button, Card, CardActions, CardContent, CardHeader, Grid, Icon, IconButton } from '@mui/material'
import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'

const rows = [
  { id: 1, occupiedTenant: 'Jon', accruedYears: 14 },
  { id: 2, occupiedTenant: 'Cersei', accruedYears: 31 },
  { id: 3, occupiedTenant: 'Jaime', accruedYears: 31 },
  { id: 4, occupiedTenant: 'Arya', accruedYears: 11 },
  { id: 5, occupiedTenant: 'Daenerys', accruedYears: null },
  { id: 6, occupiedTenant: 'Joel Amoako', accruedYears: 150 },
  { id: 7, occupiedTenant: 'Ferrara', accruedYears: 44 },
  { id: 8, occupiedTenant: 'Rossini', accruedYears: 36 },
  { id: 9, occupiedTenant: 'Harvey', accruedYears: 65 }
]

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'occupiedTenant',
    headerName: 'Occupied Tenant',
    width: 150

    // editable: true
  },
  {
    field: 'accruedYears',
    headerName: 'Accrued Years',
    width: 150

    // editable: true
  }
]

const PropertyManagePropertyTable = () => {
  return (
    <Grid container spacing={5} lg={12}>
      <Grid item xs={12} lg={6}>
        <Card>
          <Grid container>
            <Grid item xs={6} lg={6}>
              <CardHeader title='Units'></CardHeader>
            </Grid>
            <Grid item xs={6} lg={6}>
              <CardActions sx={{ display: 'flex', justifyContent: 'right', mt: 2 }}>
                <Button variant='contained'>Add Unit</Button>
              </CardActions>
            </Grid>
          </Grid>

          <CardContent sx={{ pt: 0 }}>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5
                    }
                  }
                }}
                pageSizeOptions={[5]}
                checkboxSelection={false}
                disableRowSelectionOnClick
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} lg={6}>
        <Card>
          <CardContent></CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} lg={12}>
        <Card>
          <CardContent></CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default PropertyManagePropertyTable
