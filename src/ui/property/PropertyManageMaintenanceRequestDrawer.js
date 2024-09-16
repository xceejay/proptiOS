import { useState, useEffect } from 'react'
import Drawer from '@mui/material/Drawer'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'

import { addUser } from 'src/store/apps/user'
import { useProperties } from 'src/hooks/useProperties'
import toast from 'react-hot-toast'
import Autocomplete from '@mui/material/Autocomplete'
import CustomChip from 'src/@core/components/mui/chip'

import { useTenants } from 'src/hooks/useTenants'
import { useRouter } from 'next/router'
import { CircularProgress, InputAdornment, OutlinedInput } from '@mui/material'
import { MuiFileInput } from 'mui-file-input'
import { FileUploadOutlined } from '@mui/icons-material'

const PropertyManageMaintenanceRequestDrawer = props => {
  const {
    maintenanceRequestData,
    setMaintenanceRequestsData,
    propertyData,
    setPropertyData,
    open,
    toggle,
    setLoading
  } = props
  const properties = useProperties()
  const router = useRouter()
  const { id } = router.query

  const [mediaPreview, setMediaPreview] = useState('')
  const [loadingVideo, setLoadingVideo] = useState(false)

  const handleChange = fileBlob => {
    setLoadingVideo(true)
    setFile(fileBlob) // Update your state with the selected file
    setMediaPreview(fileBlob) // Use the fileBlob directly

    if (fileBlob) {
      console.log('File Size:', fileBlob.size)
      console.log('File Type:', fileBlob.type)
      setValue('request_media', fileBlob) // Assuming the form field is named 'request_media'
    }

    setTimeout(() => {
      setLoadingVideo(false)
    }, 100)
  }

  // Updated validation schema to include unit-specific fields
  const schema = yup.object().shape({
    title: yup.string().required('Title is required').max(50),
    tenant_id: yup.string().nullable(),
    unit_id: yup.string().nullable(),
    description: yup.string().required('Description is required').max(255),
    request_media: yup
      .mixed()
      .nullable()
      .test('fileSize', 'File size should be less than 50MB', value => {
        return value && value.size <= FILE_SIZE_LIMIT
      })
      .test('fileFormat', 'Unsupported file format', value => {
        return value && SUPPORTED_FORMATS.includes(value.type)
      })
  })

  const blockedUnit = () => {
    let unit_id = propertyData.units.find(unit => unit.unit_unit_id == maintenanceRequestData.id)?.id || ''

    console.log('found unit', unit_id)

    return unit_id
  }

  const defaultValues = {
    request_media: maintenanceRequestData?.request_media,
    request_owner: maintenanceRequestData?.request_owner,
    tenant_id: maintenanceRequestData?.tenant_id,
    title: maintenanceRequestData?.title,
    description: maintenanceRequestData?.description,
    unit_id: maintenanceRequestData?.unit_id,
    uuid: maintenanceRequestData?.uuid
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

  useEffect(() => {
    if (maintenanceRequestData) {
      console.log('resenting default values')

      reset({
        request_media: maintenanceRequestData?.request_media,
        request_owner: maintenanceRequestData?.request_owner,
        tenant_id: maintenanceRequestData?.tenant_id,
        title: maintenanceRequestData?.title,
        description: maintenanceRequestData?.description,
        unit_id: maintenanceRequestData?.unit_id,
        uuid: maintenanceRequestData?.uuid
      })
    }
  }, [maintenanceRequestData, propertyData, reset])

  const refreshPropertyData = () => {
    if (id) {
      // Ensure id is defined before making the API call
      properties.getProperty(
        id,
        responseData => {
          console.log('refreshed data')
          let { data } = responseData
          setPropertyData(data)
          console.log('FROM Edit unit PAGE: refreshing property Data', responseData)

          if (responseData?.status === 'FAILED') {
            alert(responseData.message || 'Failed to fetch properties')
          }

          setMaintenanceRequestsData([...propertyData?.units])
          setLoading(false)
        },
        error => {
          console.log(id)
          console.error('FROM refresh btn PAGE:', error)
        }
      )
    }
  }

  useEffect(() => {
    refreshPropertyData()
  }, [open])

  const onSubmit = formData => {
    console.log('triggered')
    setLoading(true)
    formData.property_id = propertyData.id
    formData.id = maintenanceRequestData.id

    let requestData = [formData]

    console.log('maintenanceRequestData', maintenanceRequestData)

    console.log('reqdata', requestData)

    properties.editUnits(
      requestData,
      responseData => {
        let { data } = responseData

        if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to add unit')
          setError('email', {
            type: 'manual',
            message: data.description || 'Unknown error occurred'
          })

          return
        }

        const updatedRequestData = requestData.map(unit => {
          const matchingUnit = data.find(response => response.uuid === unit.uuid)

          if (matchingUnit) {
            return {
              ...unit,
              id: matchingUnit.id
            }
          }

          return unit
        })

        toast.success('Change applied', { duration: 3000 })

        handleClose()
      },
      error => {
        toast.error('Failed to edit unit', { duration: 3000 })
        setLoading(false)

        console.error('Error from Add Unit Drawer:', error)
      }
    )
  }

  const handleClose = () => {
    toggle()
    reset()
  }

  const statusLabel = maintenanceRequestData?.status === 'active' ? 'Active' : 'Inactive'
  const statusColor = maintenanceRequestData?.status === 'active' ? 'success' : 'secondary'

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant='h6'>Manage Maintenance Request</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='title'
              control={control}
              render={({ field }) => (
                <TextField
                  label='Title'
                  placeholder='Enter title'
                  {...field}
                  error={Boolean(errors.title)}
                  helperText={errors.title ? errors.title.message : ''}
                  fullWidth
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <TextField
                  label='Description'
                  placeholder='Enter description'
                  {...field}
                  error={Boolean(errors.description)}
                  helperText={errors.description ? errors.description.message : ''}
                  multiline
                  rows={4}
                  fullWidth
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='tenant_id'
              control={control}
              defaultValue=''
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Autocomplete
                  options={propertyData.tenants}
                  getOptionLabel={tenant => tenant.name + ' (' + tenant.id + ')'}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.id : '')
                  }}
                  value={propertyData.tenants.find(tenant => tenant.id === value) || null}
                  renderInput={params => <TextField {...params} label='Tenant Attached' />}
                  isOptionEqualToValue={(option, value) => option.id === value}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='unit_id'
              control={control}
              defaultValue=''
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Autocomplete
                  options={propertyData.units}
                  getOptionLabel={unit => unit?.name + ' (' + unit?.id + ')'}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.id : '')
                  }}
                  value={propertyData.units.find(unit => unit.id === value) || null}
                  renderInput={params => <TextField {...params} label='Unit Related' />}
                  isOptionEqualToValue={(option, value) => option.id === value}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='request_owner'
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label='Request Owner'
                  {...field}
                  error={Boolean(errors.request_owner)}
                  helperText={errors.request_owner ? errors.request_owner.message : ''}
                  fullWidth
                >
                  {['property', 'unit'].map(option => (
                    <MenuItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='request_media'
              control={control}
              render={({ field, fieldState }) => (
                <MuiFileInput
                  label='Request Media'
                  InputProps={{
                    inputProps: {
                      accept: 'video/*, image/*'
                    },
                    startAdornment: <FileUploadOutlined />
                  }}
                  placeholder='Upload request evidence'
                  {...field}
                  onChange={handleChange}
                  helperText={fieldState.invalid ? errors.request_media.message : ''}
                  error={Boolean(errors.request_media)}
                />
              )}
            />
          </FormControl>

          {/* Media Preview */}
          {mediaPreview && (
            <Box sx={{ mb: 4 }}>
              {['image/jpeg', 'image/png', 'image/gif'].includes(mediaPreview.type) ? (
                <img
                  src={URL.createObjectURL(mediaPreview)}
                  alt='Preview'
                  style={{ width: '100%', maxHeight: '400px' }}
                  key={mediaPreview.name || mediaPreview.lastModified} // Force re-render
                />
              ) : ['video/mp4', 'video/webm', 'video/ogg'].includes(mediaPreview.type) ? (
                <video
                  controls
                  style={{ width: '100%', maxHeight: '400px' }}
                  key={mediaPreview.name || mediaPreview.lastModified} // Force re-render
                >
                  <source src={URL.createObjectURL(mediaPreview)} type={mediaPreview.type} />
                  Your browser does not support the video tag.
                </video>
              ) : loadingVideo ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '400px',
                    width: '100%'
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <></>
              )}
            </Box>
          )}

          <Button size='small' fullWidth type='submit' variant='contained'>
            Submit
          </Button>
        </form>
      </Box>
    </Drawer>
  )
}

export default PropertyManageMaintenanceRequestDrawer

// Styled Header
const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  borderBottom: `1px solid ${theme.palette.divider}`
}))
