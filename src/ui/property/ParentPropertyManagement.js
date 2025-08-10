import { useState } from 'react'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Box
} from '@mui/material'
import PropertyManageTable from './PropertyManageTable'
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import ListOutlinedIcon from '@mui/icons-material/ListOutlined'
import CustomChip from 'src/@core/components/mui/chip'

const ParentPropertyViewManagement = ({
  setPropertyData,
  propertyData,
  setPaginationModel,
  paginationModel,
  loading,
  setLoading,
  setPropertiesData,
  propertiesData
}) => {
  const [isGridView, setIsGridView] = useState(false)

  const handleToggleView = () => {
    setIsGridView(!isGridView)
  }

  return (
    <Grid container spacing={6.5}>
      <Grid size={12}>
        <Card>
          <CardHeader
            title='Properties'
            action={
              <Tooltip title={isGridView ? 'Toggle Table View' : 'Toggle Grid View'}>
                <IconButton onClick={handleToggleView}>
                  {isGridView ? <ListOutlinedIcon /> : <GridViewOutlinedIcon />}
                </IconButton>
              </Tooltip>
            }
          />
          <CardContent>
            {isGridView ? (
              <Grid container spacing={4}>
                {propertiesData.map((property, index) => (
                  <Grid
                    key={index}
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 4,
                      lg: 3
                    }}>
                    <Card
                      sx={{
                        border: theme => `1px solid ${theme.palette.divider}`,
                        borderRadius: '4px',
                        boxShadow: 'none',
                        color: 'text.secondary'
                      }}
                    >
                      <CardHeader title={property.property_name} />
                      <CardContent>
                        {property.property_image_url ? (
                          <>
                            <Box
                              component='img'
                              sx={{
                                borderRadius: '20%',
                                width: '32px',
                                height: '30px',
                                objectFit: 'cover' // Optional: Ensures the image covers the entire area
                              }}
                              src={property.image_url}
                              alt='User'
                            />{' '}
                          </>
                        ) : (
                          <>
                            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 102 100' width='102' height='100'>
                              <rect width='102px' height='100px' fill='#CCCCCC0D'></rect>
                              <text
                                x='50%'
                                y='50%'
                                dominantBaseline='middle'
                                textAnchor='middle'
                                fontSize='10px'
                                fill='#212121'
                              >
                                Property Image
                              </text>
                            </svg>
                          </>
                        )}
                        <Typography sx={{ mt: 1 }} variant='body2' color='textSecondary'>
                          {property.uuid}
                        </Typography>
                        <Typography sx={{ mt: 1 }} variant='body2' color='textSecondary'>
                          {property.description}
                        </Typography>
                        <Typography variant='body2' color='textSecondary'>
                          {property.property_address}
                        </Typography>

                        <Typography variant='body1' sx={{ mt: 1 }}>
                          {property.units}
                        </Typography>
                        <CustomChip
                          rounded
                          skin='light'
                          size='small'
                          label={String(property.property_type).replace(/_/g, ' ')}
                          color={'primary'}
                          sx={{ mt: 1, textTransform: 'capitalize' }}
                        />

                        {/* Additional property details here */}
                      </CardContent>
                      <CardActions>
                        <Button href={'/properties/manage/' + property.id} size='small' color='primary'>
                          Manage
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Grid>
                <PropertyManageTable
                  setPaginationModel={setPaginationModel}
                  paginationModel={paginationModel}
                  loading={loading}
                  setLoading={setLoading}
                  setPropertiesData={setPropertiesData}
                  propertiesData={propertiesData}
                />
              </Grid>
            )}
          </CardContent>
          <Divider sx={{ m: '0 !important' }} />
        </Card>
      </Grid>
    </Grid>
  );
}

export default ParentPropertyViewManagement
