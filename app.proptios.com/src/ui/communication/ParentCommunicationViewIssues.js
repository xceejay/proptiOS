import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import CustomChip from 'src/@core/components/mui/chip'
import { useCommunication } from 'src/hooks/useCommunication'

const createIssueSchema = yup.object().shape({
  title: yup.string().trim().required('Issue title is required'),
  description: yup.string().trim().required('Issue description is required'),
})

const commentSchema = yup.object().shape({
  comment: yup.string().trim().required('Comment is required'),
})

const statusColors = {
  Open: 'primary',
  'In Progress': 'warning',
  Closed: 'success',
}

const formatReporterMeta = issue => {
  const bits = []

  if (issue?.reporter?.property?.name) {
    bits.push(issue.reporter.property.name)
  }

  if (issue?.reporter?.unit?.name) {
    bits.push(issue.reporter.unit.name)
  }

  return bits.join(', ')
}

const EmptyState = ({ onCreate }) => (
  <Card>
    <CardContent sx={{ py: 12, textAlign: 'center' }}>
      <Typography variant='h6' sx={{ mb: 2 }}>
        No issues yet
      </Typography>
      <Typography color='text.secondary' sx={{ mb: 4 }}>
        Communication issues will appear here once your team starts reporting them.
      </Typography>
      <Button variant='contained' onClick={onCreate}>
        Create Issue
      </Button>
    </CardContent>
  </Card>
)

const IssueDetail = ({
  commentErrors,
  commentLoading,
  commentRegister,
  handleClose,
  handleCommentSubmit,
  handleStatusChange,
  issue,
}) => (
  <Card>
    <CardContent>
      <IconButton onClick={handleClose} sx={{ float: 'right' }}>
        <CloseIcon />
      </IconButton>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, mb: 2 }}>
        <Box>
          <Typography variant='h5' gutterBottom>
            {issue.title}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Reported by {issue.reporter?.name || 'Unknown'} ({issue.reporter?.user_type || 'pm_user'}) on{' '}
            {new Date(issue.date || issue.created_at).toLocaleString()}
          </Typography>
          {formatReporterMeta(issue) ? (
            <Typography variant='body2' color='text.secondary'>
              {formatReporterMeta(issue)}
            </Typography>
          ) : null}
        </Box>
        <FormControl variant='outlined' sx={{ minWidth: 160 }}>
          <Select
            aria-label='Issue Status'
            size='small'
            value={issue.status || 'Open'}
            onChange={event => handleStatusChange(issue.id, event.target.value)}
          >
            <MenuItem value='Open'>Open</MenuItem>
            <MenuItem value='In Progress'>In Progress</MenuItem>
            <MenuItem value='Closed'>Closed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography sx={{ mb: 4 }}>{issue.description}</Typography>

      <Typography variant='h6' gutterBottom>
        Attachments
      </Typography>
      {issue.attachments?.length ? (
        <Stack spacing={2} sx={{ mb: 4 }}>
          {issue.attachments.map(attachment => (
            <Button
              key={attachment.id}
              component='a'
              href={attachment.url}
              target='_blank'
              rel='noreferrer'
              variant='outlined'
              sx={{ justifyContent: 'flex-start' }}
            >
              {attachment.name}
            </Button>
          ))}
        </Stack>
      ) : (
        <Typography color='text.secondary' sx={{ mb: 4 }}>
          No attachments have been added to this issue yet.
        </Typography>
      )}

      <Typography variant='h6' gutterBottom>
        Comments
      </Typography>
      {issue.comments?.length ? (
        <List sx={{ mb: 3 }}>
          {issue.comments.map(comment => (
            <ListItem key={comment.id} sx={{ px: 0, display: 'block' }}>
              <Typography variant='subtitle2'>
                {comment.commenter?.name || 'Unknown'} ({comment.commenter?.user_type || 'pm_user'})
              </Typography>
              <Typography variant='caption' color='text.secondary'>
                {new Date(comment.timestamp || comment.created_at).toLocaleString()}
              </Typography>
              <Typography sx={{ mt: 1 }}>{comment.text}</Typography>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography color='text.secondary' sx={{ mb: 3 }}>
          No comments yet.
        </Typography>
      )}

      <form onSubmit={handleCommentSubmit}>
        <TextField
          {...commentRegister('comment')}
          fullWidth
          multiline
          rows={2}
          placeholder='Add a comment...'
          error={Boolean(commentErrors.comment)}
          helperText={commentErrors.comment?.message}
          sx={{ mb: 2 }}
        />
        {commentErrors.comment ? <FormHelperText error sx={{ mb: 2 }}>{commentErrors.comment.message}</FormHelperText> : null}
        <Button type='submit' variant='contained' endIcon={<SendIcon />} disabled={commentLoading}>
          {commentLoading ? <CircularProgress size={24} /> : 'Send'}
        </Button>
      </form>
    </CardContent>
  </Card>
)

const ParentCommunicationViewIssues = () => {
  const communication = useCommunication()
  const isMobile = useMediaQuery('(max-width:600px)')
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedIssueId, setSelectedIssueId] = useState(null)
  const [createIssueOpen, setCreateIssueOpen] = useState(false)
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [commentLoading, setCommentLoading] = useState(false)
  const [statusLoadingId, setStatusLoadingId] = useState(null)

  const {
    register: registerIssue,
    handleSubmit: handleCreateIssueSubmit,
    reset: resetCreateIssue,
    formState: { errors: createIssueErrors },
  } = useForm({
    resolver: yupResolver(createIssueSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  })

  const {
    register: registerComment,
    handleSubmit: handleCommentSubmit,
    reset: resetComment,
    formState: { errors: commentErrors },
  } = useForm({
    resolver: yupResolver(commentSchema),
    defaultValues: {
      comment: '',
    },
  })

  const selectedIssue = useMemo(
    () => issues.find(issue => issue.id === selectedIssueId) || null,
    [issues, selectedIssueId]
  )

  const syncSelectedIssue = useCallback(nextIssues => {
    if (!nextIssues.length) {
      setSelectedIssueId(null)
      return
    }

    setSelectedIssueId(prevSelected =>
      nextIssues.some(issue => issue.id === prevSelected) ? prevSelected : nextIssues[0].id
    )
  }, [])

  const loadIssues = useCallback(() => {
    setLoading(true)
    communication.getIssues(
      responseData => {
        const nextIssues = Array.isArray(responseData?.data) ? responseData.data : []
        setIssues(nextIssues)
        syncSelectedIssue(nextIssues)
        setLoading(false)
      },
      error => {
        setLoading(false)
        toast.error(error.response?.data?.description || 'Failed to load communication issues.', {
          duration: 5000,
        })
      }
    )
  }, [communication, syncSelectedIssue])

  useEffect(() => {
    loadIssues()
  }, [loadIssues])

  const handleOpenCreateIssue = () => {
    setCreateIssueOpen(true)
  }

  const handleCloseCreateIssue = () => {
    setCreateIssueOpen(false)
    resetCreateIssue()
  }

  const handleCreateIssue = data => {
    setCreateLoading(true)
    communication.addIssue(
      data,
      responseData => {
        const createdIssue = responseData?.data
        setCreateLoading(false)

        if (!createdIssue?.id) {
          toast.error('The issue was created but the response was incomplete.', { duration: 5000 })
          loadIssues()
          handleCloseCreateIssue()
          return
        }

        setIssues(prevIssues => [createdIssue, ...prevIssues])
        setSelectedIssueId(createdIssue.id)
        setDrawerOpen(isMobile)
        handleCloseCreateIssue()
        toast.success('Issue created successfully', { duration: 5000 })
      },
      error => {
        setCreateLoading(false)
        toast.error(error.response?.data?.description || 'Failed to create issue.', {
          duration: 5000,
        })
      }
    )
  }

  const handleIssueSelect = issueId => {
    setSelectedIssueId(issueId)
    resetComment()

    if (isMobile) {
      setDrawerOpen(true)
    }
  }

  const handleCloseIssueDetails = () => {
    setDrawerOpen(false)
  }

  const submitComment = data => {
    if (!selectedIssue) return

    setCommentLoading(true)
    communication.addIssueComment(
      selectedIssue.id,
      { text: data.comment },
      responseData => {
        const newComment = responseData?.data
        setCommentLoading(false)

        if (!newComment?.id) {
          toast.error('The comment was saved but the response was incomplete.', { duration: 5000 })
          loadIssues()
          resetComment()
          return
        }

        setIssues(prevIssues =>
          prevIssues.map(issue =>
            issue.id === selectedIssue.id
              ? {
                  ...issue,
                  comments: [...(issue.comments || []), newComment],
                }
              : issue
          )
        )
        resetComment()
        toast.success('Comment added successfully', { duration: 5000 })
      },
      error => {
        setCommentLoading(false)
        toast.error(error.response?.data?.description || 'Failed to add comment.', {
          duration: 5000,
        })
      }
    )
  }

  const handleStatusChange = (issueId, status) => {
    setStatusLoadingId(issueId)
    communication.updateIssueStatus(
      issueId,
      { status },
      responseData => {
        const updatedIssue = responseData?.data
        setStatusLoadingId(null)

        if (!updatedIssue?.id) {
          toast.error('The issue status changed but the response was incomplete.', { duration: 5000 })
          loadIssues()
          return
        }

        setIssues(prevIssues => prevIssues.map(issue => (issue.id === issueId ? updatedIssue : issue)))
        toast.success('Issue status updated', { duration: 4000 })
      },
      error => {
        setStatusLoadingId(null)
        toast.error(error.response?.data?.description || 'Failed to update issue status.', {
          duration: 5000,
        })
      }
    )
  }

  const detailPanel = selectedIssue ? (
    <IssueDetail
      commentErrors={commentErrors}
      commentLoading={commentLoading}
      commentRegister={registerComment}
      handleClose={handleCloseIssueDetails}
      handleCommentSubmit={handleCommentSubmit(submitComment)}
      handleStatusChange={handleStatusChange}
      issue={selectedIssue}
    />
  ) : (
    <Card>
      <CardContent sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant='h6'>Select an issue to view details</Typography>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <CircularProgress sx={{ mb: 4 }} />
        <Typography>Loading issues...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, minHeight: '70vh' }}>
      <Card sx={{ width: isMobile ? '100%' : '32%', overflowY: 'auto' }}>
        <CardHeader
          title='Issues'
          action={
            <Tooltip title='Create new Issue'>
              <IconButton aria-label='Create new Issue' onClick={handleOpenCreateIssue}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          }
        />
        {!issues.length ? (
          <CardContent>
            <Typography color='text.secondary'>No communication issues have been created for this site yet.</Typography>
          </CardContent>
        ) : (
          <Stack spacing={1} sx={{ px: 2, pb: 2 }}>
            {issues.map(issue => (
              <ListItem
                key={issue.id}
                button
                onClick={() => handleIssueSelect(issue.id)}
                selected={selectedIssueId === issue.id}
                sx={{
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  transition: 'all 0.2s ease-in-out',
                  bgcolor: selectedIssueId === issue.id ? 'action.selected' : 'background.paper',
                  borderRadius: 1,
                  boxShadow: selectedIssueId === issue.id ? 2 : 0,
                  px: 2,
                  py: 1.5,
                  flexDirection: 'row-reverse',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CustomChip label={issue.status} color={statusColors[issue.status] || 'secondary'} />
                  {statusLoadingId === issue.id ? <CircularProgress size={18} /> : null}
                </Box>
                <Box>
                  <Typography variant='subtitle2' sx={{ mb: 0.5, fontWeight: 500 }}>
                    {issue.title}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    Reporter: {issue.reporter?.name || 'Unknown'} ({issue.reporter?.user_type || 'pm_user'})
                  </Typography>
                  {formatReporterMeta(issue) ? (
                    <Typography variant='body2' color='text.secondary'>
                      {formatReporterMeta(issue)}
                    </Typography>
                  ) : null}
                </Box>
              </ListItem>
            ))}
          </Stack>
        )}
      </Card>

      {!issues.length ? (
        <Box sx={{ width: isMobile ? '100%' : '68%' }}>
          <EmptyState onCreate={handleOpenCreateIssue} />
        </Box>
      ) : !isMobile ? (
        <Box sx={{ width: '68%' }}>{detailPanel}</Box>
      ) : (
        <Drawer anchor='right' open={isDrawerOpen} onClose={handleCloseIssueDetails}>
          <Box sx={{ width: '100vw', maxWidth: 520, p: 2 }}>{detailPanel}</Box>
        </Drawer>
      )}

      <Dialog open={createIssueOpen} onClose={handleCloseCreateIssue} fullWidth maxWidth='sm'>
        <form onSubmit={handleCreateIssueSubmit(handleCreateIssue)}>
          <DialogTitle>Create new Issue</DialogTitle>
          <DialogContent>
            <Stack spacing={4} sx={{ pt: 1 }}>
              <TextField
                label='Issue title'
                {...registerIssue('title')}
                error={Boolean(createIssueErrors.title)}
                helperText={createIssueErrors.title?.message}
              />
              <TextField
                label='Issue description'
                multiline
                minRows={4}
                {...registerIssue('description')}
                error={Boolean(createIssueErrors.description)}
                helperText={createIssueErrors.description?.message}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCreateIssue}>Cancel</Button>
            <Button type='submit' variant='contained' disabled={createLoading}>
              {createLoading ? <CircularProgress size={22} /> : 'Create Issue'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default ParentCommunicationViewIssues
