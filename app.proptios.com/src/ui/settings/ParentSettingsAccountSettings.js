import { useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Alert, Button, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'

const schema = yup.object().shape({
  company_name: yup.string().min(3).required('Company Name field is required'),
  company_email: yup.string().email().required('Company Email field is required'),
  company_address: yup.string().required('Company Address field is required'),
  company_tel_number: yup.string().nullable(),
  company_type: yup.string().required('Company type is required')
})

const buildDefaultValues = user => ({
  uuid: user?.site_id || user?.uuid || 'unavailable',
  company_name: user?.site_name || user?.company_name || '',
  company_email: user?.email || user?.company_email || '',
  company_address: user?.company_address || user?.address || '',
  company_tel_number: user?.tel_number || user?.company_tel_number || '',
  company_type: user?.company_type || 'residential'
})

const blockerMessage =
  'Account settings are read-only while we finish setting up the settings infrastructure. Saving will be enabled soon.'

const ParentSettingsAccountSettings = () => {
  const auth = useAuth()
  const defaultValues = useMemo(() => buildDefaultValues(auth.user), [auth.user])

  const {
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <Card>
          <CardHeader title='Settings' sx={{ pb: 1.5 }} />
          <CardContent>
            <Alert severity='warning' sx={{ mb: 4 }}>
              {blockerMessage}
            </Alert>
            <form>
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

              <Button type='button' variant='contained' color='primary' sx={{ mt: 2, width: '100%' }} disabled>
                Save Disabled
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ParentSettingsAccountSettings
