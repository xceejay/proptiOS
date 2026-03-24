import { useState, useMemo } from 'react'
import Grid from '@mui/material/Grid'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import AddUnitDrawer from './PropertyAddUnitDrawer'
import { buildPropertyOverviewStats, buildPropertyUnitsData } from './propertyOverviewModel'

const PropertyViewOverview = ({ setPropertyData, propertyData }) => {
  const [addUnitOpen, setAddUnitOpen] = useState(false)

  const unitsData = useMemo(() => buildPropertyUnitsData(propertyData), [propertyData])

  const toggleAddUnitDrawer = () => setAddUnitOpen(!addUnitOpen)

  const overviewStats = useMemo(() => buildPropertyOverviewStats(propertyData), [propertyData])

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <Grid container spacing={5}>
          <Grid
            size={{
              xs: 12,
              lg: 6
            }}>
            <Grid container spacing={6.5}>
              {overviewStats.map(stat => (
                <Grid
                  key={stat.title}
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 6
                  }}>
                  <CardStatsVertical chipColor='default' {...stat} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <AddUnitDrawer
        unitsData={unitsData}
        propertyData={propertyData}
        setPropertyData={setPropertyData}
        open={addUnitOpen}
        toggle={toggleAddUnitDrawer}
      />
    </Grid>
  )
}

PropertyViewOverview.acl = { action: 'read', subject: 'properties' }

export default PropertyViewOverview
