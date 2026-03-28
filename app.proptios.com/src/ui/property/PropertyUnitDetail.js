import { useMemo } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Icon from 'src/@core/components/icon'
import { buildPropertyUnitDetail } from './propertyOverviewModel'

const DetailItem = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, py: 2 }}>
    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
      {label}
    </Typography>
    <Typography variant='body2' sx={{ fontWeight: 500, color: 'text.primary', textAlign: 'right' }}>
      {value}
    </Typography>
  </Box>
)

const formatBoolean = value => (value ? 'Yes' : 'No')

const formatCurrency = (amount, currency) => {
  if (amount == null || amount === '') {
    return 'Not set'
  }

  const numericAmount = Number(amount)

  if (!Number.isFinite(numericAmount)) {
    return String(amount)
  }

  return `${currency || 'USD'} ${numericAmount.toLocaleString()}`
}

const PropertyUnitDetail = ({ propertyData, loading }) => {
  const router = useRouter()
  const { id, unitId } = router.query

  const unitDetail = useMemo(() => buildPropertyUnitDetail(propertyData, unitId), [propertyData, unitId])

  const handleBack = () => {
    router.push(`/properties/manage/${id}/units`)
  }

  if (loading && !propertyData) {
    return (
      <Box sx={{ mt: 12, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading unit details...</Typography>
      </Box>
    )
  }

  if (!unitDetail) {
    return (
      <Grid container spacing={6}>
        <Grid size={12}>
          <Card>
            <CardContent sx={{ p: 8 }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant='h5' sx={{ mb: 2 }}>
                    Unit not found
                  </Typography>
                  <Typography color='text.secondary'>
                    This unit could not be found in the selected property, or it may have been removed.
                  </Typography>
                </Box>

                <Box>
                  <Button variant='outlined' onClick={handleBack} startIcon={<Icon icon='tabler:arrow-left' />}>
                    Back to Property Units
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }

  const { property, unit, tenant, lease } = unitDetail
  const currency = unit.rent_amount_currency || property.currency || 'USD'

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <Button variant='outlined' onClick={handleBack} startIcon={<Icon icon='tabler:arrow-left' />}>
          Back to Property Units
        </Button>
      </Grid>

      <Grid size={12} md={5}>
        <Card>
          <CardContent sx={{ p: 8 }}>
            <Stack spacing={4}>
              <Box>
                <Typography variant='overline' sx={{ color: 'text.secondary' }}>
                  Property Unit
                </Typography>
                <Typography variant='h4' sx={{ mt: 1 }}>
                  {unit.name || `Unit ${unit.id}`}
                </Typography>
                <Typography sx={{ mt: 2, color: 'text.secondary' }}>
                  {property.name}
                </Typography>
              </Box>

              <Stack direction='row' spacing={2} flexWrap='wrap' useFlexGap>
                <Chip
                  label={tenant ? 'Occupied' : 'Vacant'}
                  color={tenant ? 'success' : 'default'}
                  variant={tenant ? 'filled' : 'outlined'}
                />
                <Chip
                  label={lease ? 'Lease Attached' : 'No Lease'}
                  color={lease ? 'primary' : 'default'}
                  variant={lease ? 'filled' : 'outlined'}
                />
              </Stack>

              <Divider />

              <Box>
                <Typography variant='subtitle2' sx={{ mb: 3 }}>
                  Occupancy
                </Typography>
                <DetailItem label='Tenant' value={tenant?.name || 'No tenant assigned'} />
                <DetailItem label='Tenant Email' value={tenant?.email || 'Not available'} />
                <DetailItem label='Lease Title' value={lease?.title || 'No active lease attached'} />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={12} md={7}>
        <Stack spacing={6}>
          <Card>
            <CardContent sx={{ p: 8 }}>
              <Typography variant='h6' sx={{ mb: 4 }}>
                Unit Information
              </Typography>
              <DetailItem label='Unit UUID' value={unit.uuid || 'Not available'} />
              <DetailItem label='Floor Number' value={unit.floor_no || 'Not set'} />
              <DetailItem label='Bedrooms' value={unit.bedrooms || 'Not set'} />
              <DetailItem label='Bathrooms' value={unit.bathrooms || 'Not set'} />
              <DetailItem label='Furnished' value={formatBoolean(Boolean(unit.furnished))} />
              <DetailItem label='Common Area' value={formatBoolean(Boolean(unit.common_area))} />
              <DetailItem label='Monthly Rent' value={formatCurrency(unit.monthly_rent ?? unit.rent_amount, currency)} />
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 8 }}>
              <Typography variant='h6' sx={{ mb: 4 }}>
                Description
              </Typography>
              <Typography color='text.secondary'>
                {unit.description || 'No unit description has been added yet.'}
              </Typography>
            </CardContent>
          </Card>
        </Stack>
      </Grid>
    </Grid>
  )
}

export default PropertyUnitDetail
