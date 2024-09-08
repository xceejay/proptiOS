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
import { useLeases } from 'src/hooks/useLeases'
import toast from 'react-hot-toast'

const EditLeaseDrawer = props => {
  const { leaseData, setLeasesData, leasesData, open, toggle, setLoading } = props
  const leases = useLeases()

  // Validation schema for lease-specific fields
  const schema = yup.object().shape({
    lease_type: yup.string().required('Lease Type is required'),
    tenant_id: yup.string().required('Tenant is required'),
    property_id: yup.string().required('Property is required'),
    unit_id: yup.string().required('Unit is required'),
    start_date: yup.date().required('Start Date is required'),
    end_date: yup
      .date()
      .required('End Date is required')
      .min(yup.ref('start_date'), 'End Date must be later than Start Date'),
    rent_amount: yup.number().required('Rent amount is required').positive('Rent amount must be positive')
  })

  const defaultValues = {
    lease_type: leaseData?.lease_type || '',
    tenant_id: leaseData?.tenant?.id || '',
    property_id: leaseData?.property?.id || '',
    unit_id: leaseData?.unit?.id || '',
    start_date: leaseData?.start_date || '',
    end_date: leaseData?.end_date || '',
    rent_amount: leaseData?.rent_amount || ''
  }

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (leaseData) {
      reset({
        lease_type: leaseData?.lease_type || '',
        tenant_id: leaseData?.tenant?.id || '',
        property_id: leaseData?.property?.id || '',
        unit_id: leaseData?.unit?.id || '',
        start_date: leaseData?.start_date || '',
        end_date: leaseData?.end_date || '',
        rent_amount: leaseData?.rent_amount || ''
      })
    }
  }, [leaseData, reset])

  const onSubmit = formData => {
    setLoading(true)
    formData.id = leaseData.id // Ensure the lease ID is included

    let requestData = [formData]

    leases.editLeases(
      requestData,
      responseData => {
        let { data } = responseData

        if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to update lease')

          return
        }

        toast.success('Lease updated successfully', { duration: 3000 })

        const updatedLeases = leasesData.items.map(lease =>
          lease.id === leaseData.id ? { ...lease, ...formData } : lease
        )
        setLeasesData(prevData => ({
          ...prevData,
          items: updatedLeases
        }))
        setLoading(false)
        handleClose()
      },
      error => {
        toast.error('Failed to update lease', { duration: 3000 })
        setLoading(false)
        console.error('Error updating lease:', error)
      }
    )
  }

  const handleClose = () => {
    toggle()
    reset()
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
        <Typography variant='h6'>Edit Lease</Typography>
        <IconButton
          size='small'
          onClick={handleClose}
          sx={{ borderRadius: 1, color: 'text.primary', backgroundColor: 'action.selected' }}
        >
          <Icon icon='tabler:x' fontSize='1.125rem' />
        </IconButton>
      </Header>
      <Box sx={{ p: theme => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='lease_type'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Lease Type'
                  placeholder='Enter Lease Type'
                  error={Boolean(errors.lease_type)}
                />
              )}
            />
            {errors.lease_type && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.lease_type.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='tenant_id'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Tenant ID'
                  placeholder='Enter Tenant ID'
                  error={Boolean(errors.tenant_id)}
                />
              )}
            />
            {errors.tenant_id && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.tenant_id.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='property_id'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Property ID'
                  placeholder='Enter Property ID'
                  error={Boolean(errors.property_id)}
                />
              )}
            />
            {errors.property_id && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.property_id.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='unit_id'
              control={control}
              render={({ field }) => (
                <TextField {...field} label='Unit ID' placeholder='Enter Unit ID' error={Boolean(errors.unit_id)} />
              )}
            />
            {errors.unit_id && <FormHelperText sx={{ color: 'error.main' }}>{errors.unit_id.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='start_date'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type='date'
                  label='Start Date'
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(errors.start_date)}
                />
              )}
            />
            {errors.start_date && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.start_date.message}</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='end_date'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type='date'
                  label='End Date'
                  InputLabelProps={{ shrink: true }}
                  error={Boolean(errors.end_date)}
                />
              )}
            />
            {errors.end_date && <FormHelperText sx={{ color: 'error.main' }}>{errors.end_date.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }}>
            <Controller
              name='rent_amount'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type='number'
                  label='Rent Amount'
                  placeholder='Enter Rent Amount'
                  error={Boolean(errors.rent_amount)}
                />
              )}
            />
            {errors.rent_amount && (
              <FormHelperText sx={{ color: 'error.main' }}>{errors.rent_amount.message}</FormHelperText>
            )}
          </FormControl>

          <Button type='submit' variant='contained' color='warning'>
            Edit Lease
          </Button>
        </form>
      </Box>
    </Drawer>
  )
}

export default EditLeaseDrawer

// Styled Header
const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  borderBottom: `1px solid ${theme.palette.divider}`
}))
