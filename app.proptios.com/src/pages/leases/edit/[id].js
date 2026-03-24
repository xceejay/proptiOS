import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import toast from 'react-hot-toast'
import { useLeases } from 'src/hooks/useLeases'

const LeaseEdit = () => {
  const router = useRouter()
  const { id } = router.query
  const leases = useLeases()
  const [leaseData, setLeaseData] = useState(null)

  useEffect(() => {
    if (!id) {
      return
    }

    leases.getLease(
      id,
      responseData => {
        setLeaseData(responseData.data)
      },
      error => {
        toast.error(error.response?.data?.description || 'Failed to load lease', {
          duration: 5000
        })
      }
    )
  }, [id])

  return (
    <Grid container spacing={6}>
      <Grid size={12}>
        <Alert severity='warning'>
          Lease editing is not wired as a standalone page yet. The previous page loaded an invoice editor stub; this route
          now shows the live lease id and waits for a dedicated edit experience.
        </Alert>
      </Grid>
      <Grid size={12}>
        <Typography variant='h6'>Lease {id || '...'}</Typography>
        <Typography color='text.secondary'>
          {leaseData?.title || leaseData?.type || 'Lease data loaded for this route, but editing controls are intentionally blocked.'}
        </Typography>
      </Grid>
    </Grid>
  )
}

export default LeaseEdit
