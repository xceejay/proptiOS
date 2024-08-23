import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Icon,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  TextField,
  Typography
} from '@mui/material'
import * as React from 'react'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import CardStatsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import PropertyManagePropertyTable from './PropertyManagePropertyTable'
import Select from 'src/@core/theme/overrides/select'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import PropertyAddUnitStepper from './PropertyAddUnitStepper'

const defaultValues = {
  name: '',
  email: '',
  address: '',
  country: '',
  tel_number: '',
  user_type: 'tenant'
}

const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const schema = yup.object().shape({
  name: yup
    .string()
    .min(3, obj => showErrors('name', obj.value.length, obj.min))
    .required(),
  email: yup.string().email().required(),
  address: yup.string(),
  tel_number: yup.string(),
  user_type: yup.string()
})

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 1,
  boxShadow: 24,
  p: 20
}

const countries = [
  { name: 'Algeria', code: 'DZA' },
  { name: 'Angola', code: 'AGO' },
  { name: 'Benin', code: 'BEN' },
  { name: 'Botswana', code: 'BWA' },
  { name: 'Burkina Faso', code: 'BFA' },
  { name: 'Burundi', code: 'BDI' },
  { name: 'Cabo Verde', code: 'CPV' },
  { name: 'Cameroon', code: 'CMR' },
  { name: 'Central African Republic', code: 'CAF' },
  { name: 'Chad', code: 'TCD' },
  { name: 'Comoros', code: 'COM' },
  { name: 'Democratic Republic of the Congo', code: 'COD' },
  { name: 'Republic of the Congo', code: 'COG' },
  { name: 'Djibouti', code: 'DJI' },
  { name: 'Egypt', code: 'EGY' },
  { name: 'Equatorial Guinea', code: 'GNQ' },
  { name: 'Eritrea', code: 'ERI' },
  { name: 'Eswatini', code: 'SWZ' },
  { name: 'Ethiopia', code: 'ETH' },
  { name: 'Gabon', code: 'GAB' },
  { name: 'Gambia', code: 'GMB' },
  { name: 'Ghana', code: 'GHA' },
  { name: 'Guinea', code: 'GIN' },
  { name: 'Guinea-Bissau', code: 'GNB' },
  { name: 'Ivory Coast', code: 'CIV' },
  { name: 'Kenya', code: 'KEN' },
  { name: 'Lesotho', code: 'LSO' },
  { name: 'Liberia', code: 'LBR' },
  { name: 'Libya', code: 'LBY' },
  { name: 'Madagascar', code: 'MDG' },
  { name: 'Malawi', code: 'MWI' },
  { name: 'Mali', code: 'MLI' },
  { name: 'Mauritania', code: 'MRT' },
  { name: 'Mauritius', code: 'MUS' },
  { name: 'Morocco', code: 'MAR' },
  { name: 'Mozambique', code: 'MOZ' },
  { name: 'Namibia', code: 'NAM' },
  { name: 'Niger', code: 'NER' },
  { name: 'Nigeria', code: 'NGA' },
  { name: 'Rwanda', code: 'RWA' },
  { name: 'Sao Tome and Principe', code: 'STP' },
  { name: 'Senegal', code: 'SEN' },
  { name: 'Seychelles', code: 'SYC' },
  { name: 'Sierra Leone', code: 'SLE' },
  { name: 'Somalia', code: 'SOM' },
  { name: 'South Africa', code: 'ZAF' },
  { name: 'South Sudan', code: 'SSD' },
  { name: 'Sudan', code: 'SDN' },
  { name: 'Tanzania', code: 'TZA' },
  { name: 'Togo', code: 'TGO' },
  { name: 'Tunisia', code: 'TUN' },
  { name: 'Uganda', code: 'UGA' },
  { name: 'Zambia', code: 'ZMB' },
  { name: 'Zimbabwe', code: 'ZWE' }
]

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
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())

  const isStepOptional = step => {
    return step === 1
  }

  const isStepSkipped = step => {
    return skipped.has(step)
  }

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1)
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)

      return newSkipped
    })
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  const {
    reset,
    control,
    setValue,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = formData => {
    // If formData should be an array, keep it as is
    let requestData = [formData]

    tenants.addTenants(
      requestData,
      responseData => {
        console.log('Add Tenant Drawer')
        let { data } = responseData

        if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to add tenant')
          setError('email', {
            type: 'manual',
            message: data.description || 'Unknown error occurred'
          })

          return
        }

        const updatedRequestData = requestData.map(tenant => {
          const matchingTenant = data.find(response => response.email === tenant.email)

          if (matchingTenant) {
            return {
              ...tenant,
              id: matchingTenant.id
            }
          }

          return tenant
        })

        toast.success('Invitation email has been sent to ' + updatedRequestData[0].email, {
          duration: 5000
        })

        setTenantsData(prevData => ({
          ...prevData,
          items: [...prevData.items, ...updatedRequestData]
        }))

        // Close the drawer
        handleClose()
      },
      error => {
        console.error('error FROM Tenant drawer PAGE:', error)
      }
    )
  }

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
                    <Button variant='contained' size='small' onClick={handleOpen}>
                      Add Unit
                    </Button>
                    <Dialog
                      open={open}
                      onClose={handleClose}
                      PaperProps={{
                        component: 'form',
                        onSubmit: event => {
                          event.preventDefault()
                          const formData = new FormData(event.currentTarget)
                          const formJson = Object.fromEntries(formData.entries())
                          const email = formJson.email
                          console.log(email)
                          handleClose()
                        }
                      }}
                    >
                      <DialogTitle>Add Unit</DialogTitle>
                      <DialogContent>
                        {/* <DialogContentText>
                          To subscribe to this website, please enter your email address here. We will send updates
                          occasionally.
                        </DialogContentText> */}
                        <PropertyAddUnitStepper></PropertyAddUnitStepper>
                      </DialogContent>

                      <DialogActions>
                        {/* <Button onClick={handleClose}>Cancel</Button> */}
                        {/* <Button type='submit'>Add</Button> */}
                      </DialogActions>
                    </Dialog>
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
