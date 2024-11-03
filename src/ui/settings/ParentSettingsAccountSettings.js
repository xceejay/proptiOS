import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { toast } from 'react-hot-toast'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { useUsers } from 'src/hooks/useUsers'

const schema = yup.object().shape({
  company_name: yup.string().min(3).required('Company Name field is required'),
  company_email: yup.string().email().required('Company Email field is required'),
  company_address: yup.string().required('Company Address field is required'),
  company_tel_number: yup.string().nullable('Phone number is required'),
  company_type: yup.string().required('Company type is required')
})

const ParentSettingsAccountSettings = props => {
  const [defaultValues, setDefaultValues] = useState({
    uuid: '123456',
    company_name: 'Test Company',
    company_email: 'test@example.com',
    company_address: '123 Test Street',
    company_tel_number: '123-456-7890',
    company_type: 'residential'
  })

  const users = useUsers()

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const onSubmit = formData => {
    const uuid = defaultValues.uuid
    let requestData = [{ ...formData, uuid }]
    users.editUser(
      requestData,
      responseData => {
        let { data } = responseData

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to edit site settings')
          setError('company_email', {
            type: 'manual',
            message: data.description || 'Unknown error occurred'
          })

          return
        }

        const updatedRequestData = requestData.map(site => {
          const matchingSite = data.find(response => response.uuid === site.uuid)

          if (matchingSite) {
            return {
              ...defaultValues,
              company_name: matchingSite.company_name || defaultValues.company_name,
              company_email: matchingSite.company_email || defaultValues.company_email,
              company_address: matchingSite.company_address || defaultValues.company_address,
              company_tel_number: matchingSite.company_tel_number || defaultValues.company_tel_number,
              company_type: matchingSite.company_type || defaultValues.company_type
            }
          }

          return site
        })

        toast.success('Site settings updated successfully', { duration: 5000 })
        console.log('datada:', data)
        console.log('upreqdata:', updatedRequestData)

        setDefaultValues(updatedRequestData[0])
        // alert(JSON.stringify(updatedRequestData[0]))
      },
      error => {
        toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
      }
    )
  }

  return (
    <Grid container spacing={6}>
      {/* Connected Accounts Cards */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Settings' sx={{ pb: 1.5 }} />
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
              <Controller
                name='company_name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Company Name'
                    error={!!errors.company_name}
                    helperText={errors.company_name?.message}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Controller
                name='company_email'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Company Email'
                    error={!!errors.company_email}
                    helperText={errors.company_email?.message}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Controller
                name='company_address'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Company Address'
                    error={!!errors.company_address}
                    helperText={errors.company_address?.message}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
              />
              <Controller
                name='company_tel_number'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label='Phone Number'
                    error={!!errors.company_tel_number}
                    helperText={errors.company_tel_number?.message}
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
              />

              <Button
                type='submit'
                variant='contained'
                color='primary'
                sx={{ mt: 2, width: '100%' }}
                disabled={!isDirty}
              >
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
export default ParentSettingsAccountSettings
