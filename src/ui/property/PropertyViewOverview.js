import { Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, Icon, IconButton } from '@mui/material'
import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import PropertyManagePropertyTable from './PropertyManagePropertyTable'

const columns = [
  { flex: 1, field: 'id', headerName: 'Unit Id', width: 90 },
  {
    field: 'tenant_name',
    valueGetter: params => params.row.tenant?.name || '',

    headerName: 'Occupied Tenant',
    flex: 1,
    width: 300

    // editable: true
  }

  // {
  //   field: 'accruedYears',
  //   headerName: 'Accrued Years',
  //   width: 150

  //   // editable: true
  // }
]

const PropertyViewOverview = ({ propertyData }) => {
  const unitsData = propertyData.units.map(unit => {
    // Find the tenant whose ID matches the unit's tenant ID
    const foundTenant = propertyData.tenants.find(tenant => tenant.id === unit.unit_tenant_id)

    // Attach the found tenant to the unit
    return {
      ...unit, // Spread the properties of the unit
      tenant: foundTenant || null // Attach the tenant or set to null if no tenant is found
    }
  })

  return (
    <Grid container spacing={6}>
      {/* <Grid item xs={12}>
        <PropertyProjectListTable></PropertyProjectListTable>
      </Grid> */}

      <Grid item xs={12}>
        {/* <PropertyInvoiceListTable propertyData={propertyData} /> */}
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
                    rows={unitsData}
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
                      stats={'0' + ' tenants'}
                      chipText='+0 tenants'
                      avatarColor='warning'
                      chipColor='default'
                      title='Prospects'
                      subtitle='All time'
                      avatarIcon='tabler:user-share'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <CardStatsVertical
                      stats={'0' + ' tenants'}
                      chipText={'+0' + ' tenants'}
                      avatarColor='info'
                      chipColor='default'
                      title='Applicants'
                      subtitle='All time'
                      avatarIcon='tabler:forms'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <CardStatsVertical
                      stats={propertyData.maintenance_requests.length + ' requests'}
                      chipText={'+0' + ' requests'}
                      avatarColor='success'
                      chipColor='default'
                      title='Maintenance'
                      avatarIcon='tabler:tool'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <CardStatsVertical
                      stats={propertyData.tenants.length + ' tenants'}
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
