// ** React Imports
import { Grid } from '@mui/material'
import { useState } from 'react'

import toast from 'react-hot-toast'
import AuditManageTable from './AuditManageTable'

const ParentAuditViewManageAuditLog = ({ auditData }) => {
  const onSubmit = formData => {
    // If formData should be an array, keep it as is
    // let requestData = [formData]
    let requestData = formData

    setLoading(true)
    audit.Invite(
      requestData,
      responseData => {
        let { data } = responseData

        setLoading(false)

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
          alert(data.description || 'Failed to add tenant')
          setError('email', {
            type: 'manual',
            message: data.description || 'Unknown error occurred'
          })

          return
        }

        toast.success('Invite sent to ' + formData.email, {
          duration: 5000
        })
      },
      error => {
        setLoading(false)

        toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
      }
    )
  }

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <AuditManageTable></AuditManageTable>
      </Grid>
    </Grid>
  );
}

export default ParentAuditViewManageAuditLog
