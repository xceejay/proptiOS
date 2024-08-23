import { useState, useEffect } from 'react'
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, Box } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import PropertyManagePropertyTable from './PropertyManageTenantsTable'
import AddUnitDrawer from './PropertyAddUnitDrawer'
import PropertyTenantManageTable from './PropertyManageTenantsTable'

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

const PropertyViewOverview = ({ setPropertyData, propertyData }) => {
  const [addUnitOpen, setAddUnitOpen] = useState(false)
  const [unitsData, setUnitsData] = useState([])

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

  const toggleAddUnitDrawer = () => setAddUnitOpen(!addUnitOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Grid container spacing={5}>
          <Grid item xs={12} lg={6}>
            <Card>
              <Grid container>
                <Grid item xs={6} lg={6}>
                  <CardHeader title='Units' />
                </Grid>
                <Grid item xs={6} lg={6}>
                  <CardActions sx={{ display: 'flex', justifyContent: 'right', mt: 2 }}>
                    <Button variant='contained' size='small' onClick={toggleAddUnitDrawer}>
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
                      stats={'0 tenants'}
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
                      stats={'0 tenants'}
                      chipText='+0 tenants'
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
                      chipText='+0 requests'
                      avatarColor='success'
                      chipColor='default'
                      title='Maintenance'
                      avatarIcon='tabler:tool'
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={6}>
                    <CardStatsVertical
                      stats={propertyData.tenants.length + ' tenants'}
                      chipText='+0 tenants'
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

          <Grid item xs={12}>
            <PropertyTenantManageTable setPropertyData={setPropertyData} propertyData={propertyData} />
          </Grid>
        </Grid>
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

export default PropertyViewOverview
