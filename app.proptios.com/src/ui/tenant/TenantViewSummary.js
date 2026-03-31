// ** React Imports
import { useState, useEffect } from 'react'
import axios from 'src/pages/middleware/axios'
import { getStoredAccessToken } from 'src/utils/authStorage'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { DataGrid } from '@mui/x-data-grid'
import CustomNoRowsOverlay from 'src/ui/CustomNoRowsOverlay'

const TenantViewSummary = ({ tenantData }) => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (tenantData && (tenantData.property_id || tenantData.property?.id)) {
      const propertyId = tenantData.property_id || tenantData.property?.id
      const token = getStoredAccessToken()

      if (!token) {
          // Fallback if no token
           if (tenantData.units) setUnits(tenantData.units)

           return
      }

      setLoading(true)

      axios.get(process.env.NEXT_PUBLIC_API_BASE_URL + `/properties/${propertyId}/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
           setLoading(false)
            if (response.data && response.data.data && response.data.data.units) {
                 // Filter units for this tenant
                 const tenantUnits = response.data.data.units.filter(u => u.tenant_id === tenantData.id)
                 setUnits(tenantUnits)
            } else {
                 setUnits([])
            }
      })
      .catch(error => {
            console.error('Failed to fetch property units', error)
            setLoading(false)
             // Fallback
             if (tenantData.units) setUnits(tenantData.units)
      })

    } else if (tenantData && Array.isArray(tenantData.units)) {
        setUnits(tenantData.units)
    }
  }, [tenantData?.property?.id, tenantData?.property_id])

  if (!tenantData) {
    return null
  }

  const columns = [
    {
      flex: 0.2,
      minWidth: 150,
      field: 'name',
      headerName: 'Unit Name',
      renderCell: ({ row }) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {row.unit_name || row.name || `Unit ${row.id}`}
        </Typography>
      )
    },
    {
      flex: 0.25,
      minWidth: 200,
      field: 'property',
      headerName: 'Property',
      renderCell: ({ row }) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {row.property_name || tenantData.property?.name || 'N/A'}
        </Typography>
      )
    },
    {
      flex: 0.3,
      minWidth: 250,
      field: 'address',
      headerName: 'Property Address',
      renderCell: ({ row }) => (
        <Typography variant='body2' sx={{ color: 'text.secondary' }}>
          {row.property_address || tenantData.property?.address || 'N/A'}
        </Typography>
      )
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'status',
      headerName: 'Status',
      renderCell: ({ row }) => (
        <Chip
          label={row.status || 'Active'}
          color={row.status === 'vacant' ? 'secondary' : 'success'}
          size='small'
          skin='light'
        />
      )
    }
  ]

  return (
    <Card>
      <CardHeader title='Assigned Units Summary' />
      <CardContent>
        <DataGrid
          autoHeight
          rows={units || []}
          loading={loading}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          disableRowSelectionOnClick
          slots={{ noRowsOverlay: CustomNoRowsOverlay }}
        />
      </CardContent>
    </Card>
  )
}

export default TenantViewSummary
