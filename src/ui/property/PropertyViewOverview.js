import { Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, Icon, IconButton } from '@mui/material'
import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import PropertyManagePropertyTable from './PropertyManagePropertyTable'

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

const PropertyViewOverview = ({ invoiceData }) => {
  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12}>
        <PropertyProjectListTable></PropertyProjectListTable>
      </Grid> */}

      <Grid item xs={12}>
        {/* <PropertyInvoiceListTable invoiceData={invoiceData} /> */}
        <Grid container spacing={5} lg={12}>
          <Grid item xs={12} lg={6}>
            <Card>
              <Grid container>
                <Grid item xs={6} lg={6}>
                  <CardHeader title='Units'></CardHeader>
                </Grid>
                <Grid item xs={6} lg={6}>
                  <CardActions sx={{ display: 'flex', justifyContent: 'right', mt: 2 }}>
                    <Button size='small' variant='contained'>
                      Add Unit
                    </Button>
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
              <CardContent>
                <Grid container spacing={6.5}>
                  <Grid item xs={12} sm={6} lg={6}>
                    <CardStatsVertical
                      stats={'128' + ' tenants'}
                      chipText='+2 tenants'
                      avatarColor='warning'
                      chipColor='default'
                      title='Prospects'
                      subtitle='This week'
                      avatarIcon='tabler:user-share'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <CardStatsVertical
                      stats={'4' + ' tenants'}
                      chipText={'+0' + ' tenants'}
                      avatarColor='info'
                      chipColor='default'
                      title='Applicants'
                      subtitle='This week'
                      avatarIcon='tabler:forms'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <CardStatsVertical
                      stats={'4' + ' requests'}
                      chipText={'+0' + ' requests'}
                      avatarColor='success'
                      chipColor='default'
                      title='Maintenance'
                      avatarIcon='tabler:tool'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <CardStatsVertical
                      stats={'4' + ' tenants'}
                      chipText={'+0' + ' tenants'}
                      avatarColor='primary'
                      chipColor='default'
                      title='Tenants'
                      avatarIcon='tabler:friends'
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={12}>
            <Card>
              <CardHeader title='Property Details'></CardHeader>
              <Divider></Divider>
              <CardContent>
                <PropertyManagePropertyTable></PropertyManagePropertyTable>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default PropertyViewOverview
