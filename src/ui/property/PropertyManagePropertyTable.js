import { Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, Icon, IconButton } from '@mui/material'
import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

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
  return <Grid container spacing={5} lg={12}></Grid>
}

export default PropertyManagePropertyTable
