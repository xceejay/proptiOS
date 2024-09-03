import { useState, useEffect } from 'react'
import Drawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import { v4 } from 'uuid'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import { CircularProgress, MenuItem } from '@mui/material'
import { TextField, Button, FormControl, FormHelperText } from '@mui/material'
import { MuiFileInput } from 'mui-file-input'
import { useProperties } from 'src/hooks/useProperties'
import { FileUploadOutlined } from '@mui/icons-material'

const PropertyAddMaintenanceRequestDrawer = props => {
  const { setUnitsData, unitsData, setPropertyData, propertyData, open, toggle } = props

  const [requestUUID, setRequestUUID] = useState(v4())
  const [mediaPreview, setMediaPreview] = useState('')
  const [loadingVideo, setLoadingVideo] = useState(false)

  const [file, setFile] = useState(null)

  const handleChange = fileBlob => {
    setLoadingVideo(true)
    setFile(fileBlob) // Update your state with the selected file
    setMediaPreview(fileBlob) // Use the fileBlob directly

    setTimeout(() => {
      setLoadingVideo(false)
    }, 100)
  }

  useEffect(() => {
    console.log('file changed', file)
    setMediaPreview(file)
  }, [file])

  useEffect(() => {
    let request_uuid = v4()
    setRequestUUID(request_uuid)
  }, [open, toggle])

  const Header = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(6),
    justifyContent: 'space-between'
  }))

  //  Constants for file validation
  const FILE_SIZE_LIMIT = 50 * 1024 * 1024 // 50MB
  const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'video/mp4', 'video/mkv']

  const schema = yup.object().shape({
    title: yup.string().required('Title is required').max(50),
    description: yup.string().required('Description is required').max(255),
    request_media: yup
      .mixed()
      .required('Media file is required')
      .test('fileSize', 'File size should be less than 50MB', value => {
        return value && value.size <= FILE_SIZE_LIMIT
      })
      .test('fileFormat', 'Unsupported file format', value => {
        return value && SUPPORTED_FORMATS.includes(value.type)
      })
  })

  const defaultValues = {
    request_media: '',
    request_owner: '',
    site_id: '',
    title: '',
    description: '',
    uuid: requestUUID
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

  const properties = useProperties()

  const onSubmit = formData => {
    console.log('triggered')
    formData.uuid = formData.uuid ? formData.uuid : requestUUID

    // Prepare the requestData with the new schema fields
    const requestData = {
      ...formData,
      property_id: propertyData.id
    }

    console.log('Request Data:', requestData)

    // Simulate API call
    properties.addMaintenanceRequest(
      [requestData],
      responseData => {
        console.log('Add request Drawer Response:', responseData)
        let { data } = responseData

        if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to add unit')
          setError('title', {
            type: 'manual',
            message: data.description || 'Unknown error occurred'
          })

          return
        }

        toast.success('Request has been successfully added', { duration: 5000 })
        setUnitsData(prevData => [...prevData, requestData])

        handleClose()
      },
      error => {
        toast.error('Could not add this request, refresh and try again', { duration: 5000 })
        console.error('Error FROM Request Drawer PAGE:', error)
      }
    )
  }

  const handleClose = () => {
    toggle()
    reset()
    setMediaPreview('')
  }

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
        <Typography variant='h6'>Add Maintenance Request</Typography>
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
                  fullWidth
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='request_media'
              control={control}
              render={({ field, fieldState }) => (
                <MuiFileInput
                  label={'ID card'}
                  InputProps={{
                    inputProps: {
                      accept: 'video/*, image/*'
                    },
                    startAdornment: <FileUploadOutlined />
                  }}
                  placeholder='Upload your ID card'
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

export default PropertyAddMaintenanceRequestDrawer
