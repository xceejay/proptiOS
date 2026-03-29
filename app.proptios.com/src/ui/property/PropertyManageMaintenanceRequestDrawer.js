import { useState, useEffect } from 'react'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'

import { useProperties } from 'src/hooks/useProperties'
import toast from 'react-hot-toast'
import Autocomplete from '@mui/material/Autocomplete'

import { useRouter } from 'next/router'
import { CircularProgress } from '@mui/material'
import { MuiFileInput } from 'mui-file-input'
import { FileUploadOutlined } from '@mui/icons-material'
import Alert from '@mui/material/Alert'
import axios from 'src/pages/middleware/axios'
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
  const [mediaPreview, setMediaPreview] = useState('')
  const [loadingVideo, setLoadingVideo] = useState(false)
  const [file, setFile] = useState(null)
  const FILE_SIZE_LIMIT = 50 * 1024 * 1024 // 50MB
  const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'video/mp4', 'video/mkv']

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
    status: yup.string().required('Status is required'),
    description: yup.string().required('Description is required').max(255),
    request_media: yup
      .mixed()
      .nullable()
      .test('fileSize', 'File size should be less than 50MB', value => {
        if (!value || !value.size) return true

        return value.size <= FILE_SIZE_LIMIT
      })
      .test('fileFormat', 'Unsupported file format', value => {
        if (!value || !value.type) return true

        return SUPPORTED_FORMATS.includes(value.type)
      })
  })

  const defaultValues = {
    request_media: maintenanceRequestData?.request_media,
    request_owner: maintenanceRequestData?.request_owner || 'property',
    tenant_id: maintenanceRequestData?.tenant_id,
    title: maintenanceRequestData?.title,
    description: maintenanceRequestData?.description,
    unit_id: maintenanceRequestData?.unit_id,
    uuid: maintenanceRequestData?.uuid,
    status: maintenanceRequestData?.status || 'pending'
  }

  const {
    reset,
    control,
    setValue,
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
        request_owner: maintenanceRequestData?.request_owner || 'property',
        tenant_id: maintenanceRequestData?.tenant_id,
        title: maintenanceRequestData?.title,
        description: maintenanceRequestData?.description,
        unit_id: maintenanceRequestData?.unit_id,
        uuid: maintenanceRequestData?.uuid,
        status: maintenanceRequestData?.status || 'pending'
      })
    }
  }, [maintenanceRequestData, propertyData, reset])

  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async formData => {
    const propertyId = propertyData?.id
    const requestId = maintenanceRequestData?.id

    if (!propertyId || !requestId) {
      toast.error('Missing property or request ID.')

      return
    }

    setSubmitting(true)
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        request_owner: formData.request_owner,
        unit_id: formData.unit_id || null,
        tenant_id: formData.tenant_id || null,
        status: formData.status
      }

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/maintenance/${propertyId}/maintenance_requests/${requestId}`,
        payload
      )

      if (res.data?.status === 'SUCCESS') {
        toast.success('Maintenance request updated successfully.')
        if (setMaintenanceRequestsData) {
          setMaintenanceRequestsData(prev =>
            (prev || []).map(item => (item.id === requestId ? { ...item, ...payload } : item))
          )
        }
        handleClose()
      } else {
        toast.error(res.data?.description || 'Failed to update maintenance request.')
      }
    } catch (err) {
      toast.error(err.response?.data?.description || 'An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
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
                  options={propertyData?.tenants ?? []}
                  getOptionLabel={tenant => tenant.name + ' (' + tenant.id + ')'}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.id : '')
                  }}
                  value={(propertyData?.tenants ?? []).find(tenant => tenant.id === value) || null}
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
                  options={propertyData?.units ?? []}
                  getOptionLabel={unit => unit?.name + ' (' + unit?.id + ')'}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.id : '')
                  }}
                  value={(propertyData?.units ?? []).find(unit => unit.id === value) || null}
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

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='status'
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label='Status'
                  {...field}
                  error={Boolean(errors.status)}
                  helperText={errors.status ? errors.status.message : ''}
                  fullWidth
                >
                  {['pending', 'in_progress', 'resolved', 'closed'].map(option => (
                    <MenuItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </FormControl>

          <Button size='small' fullWidth type='submit' variant='contained' disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Request'}
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
