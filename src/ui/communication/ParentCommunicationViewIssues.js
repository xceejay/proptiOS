import React, { useState, useCallback } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  CardHeader,
  Tooltip,
  Dialog,
  DialogContent
} from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import SendIcon from '@mui/icons-material/Send'
import CloseIcon from '@mui/icons-material/Close'
import PictureAsPdf from '@mui/icons-material/PictureAsPdf'

// Simulated data
const initialIssues = [
  {
    id: 1,
    title: 'Leaky Faucet',
    description: 'The kitchen faucet is leaking constantly.',
    status: 'Open',
    date: '2023-05-01',
    author: 'John Doe',
    attachments: [
      {
        name: 'leak.jpg',
        type: 'image/jpeg',
        url: 'https://plus.unsplash.com/premium_photo-1673967831980-1d377baaded2?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2F0c3xlbnwwfHwwfHx8MA%3D%3D'
      },
      { name: 'plumbing_report.pdf', type: 'application/pdf', url: '#' },
      {
        name: 'broken_window.mp4',
        type: 'video/mp4',
        url: ' https://www.pexels.com/video/creepy-hand-showing-red-balloon-through-broken-window-5427566/'
      }
    ]
  },
  {
    id: 2,
    title: 'Broken Window',
    description: 'The living room window is cracked and needs replacement.',
    status: 'In Progress',
    date: '2023-05-02',
    author: 'Jane Smith',
    attachments: [
      {
        name: 'broken_window.mp4',
        type: 'video/mp4',
        url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      }
    ]
  }
]

const initialComments = [
  {
    id: 1,
    issueId: 1,
    text: "I'll send a plumber tomorrow.",
    author: 'Property Manager',
    timestamp: '2023-05-01T10:00:00Z',
    attachment: { name: 'schedule.pdf', type: 'application/pdf', url: '#' }
  },
  {
    id: 2,
    issueId: 1,
    text: "Thank you, I'll be home after 2 PM.",
    author: 'John Doe',
    timestamp: '2023-05-01T11:30:00Z',
    attachment: null
  }
]

const schema = yup.object().shape({
  comment: yup.string().test('comment-or-file', 'Comment is required when no file is attached', function (value) {
    const { file } = this.parent // Access the sibling value (file)
    if (!file && (!value || value.trim().length === 0)) {
      return false
    }
    return true
  }),
  file: yup
    .mixed()
    .nullable() // To handle null values explicitly
    .test('fileSize', 'File size is too large', value => {
      if (!value) return true // If no file, validation passes
      return value.size <= 10 * 1024 * 1024 // Check if file size is within 10MB
    })
    .test('fileType', 'Unsupported file type', value => {
      if (!value) return true // If no file, validation passes
      return ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4'].includes(value.type) // Check if file type is supported
    })
})

const ParentCommunicationViewIssues = ({ communicationData }) => {
  const [issues, setIssues] = useState(initialIssues)
  const [comments, setComments] = useState(initialComments)
  const [selectedIssue, setSelectedIssue] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      comment: '',
      file: null
    }
  })

  const handleIssueClick = useCallback(
    issueId => {
      setSelectedIssue(issueId)
      reset({ comment: '', file: null })
    },
    [reset]
  )

  const handleCloseIssueDetails = useCallback(() => {
    setSelectedIssue(null)
    reset({ comment: '', file: null })
  }, [reset])

  const handleOpenVideoDialog = url => {
    setVideoUrl(url)
    setVideoDialogOpen(true)
  }

  const handleCloseVideoDialog = () => {
    setVideoDialogOpen(false)
    setVideoUrl('')
  }

  const onSubmit = async data => {
    if (!selectedIssue) return // Ensure an issue is selected
    setIsLoading(true)
    try {
      const newComment = {
        id: comments.length + 1,
        issueId: selectedIssue,
        text: data.comment,
        author: 'Current User',
        timestamp: new Date().toISOString(),
        attachment: data.file
          ? { name: data.file.name, type: data.file.type, url: URL.createObjectURL(data.file) }
          : null
      }
      setComments(prevComments => [...prevComments, newComment])
      reset({ comment: '', file: null })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Card sx={{ width: '30%', overflowY: 'auto' }}>
        <CardHeader title='Issues' />
        <List>
          {issues.map(issue => (
            <ListItem
              key={issue.id}
              button
              onClick={() => handleIssueClick(issue.id)}
              selected={selectedIssue === issue.id}
            >
              <ListItemText primary={issue.title} secondary={`${issue.description.substring(0, 50)}...`} />
            </ListItem>
          ))}
        </List>
      </Card>
      <Box sx={{ width: '70%', pl: 2, overflowY: 'auto' }}>
        {selectedIssue ? (
          <Card>
            <CardContent>
              <IconButton onClick={handleCloseIssueDetails} sx={{ float: 'right' }}>
                <CloseIcon />
              </IconButton>
              <Typography variant='h5' gutterBottom>
                {issues.find(i => i.id === selectedIssue)?.title}
              </Typography>
              <Typography variant='body1' paragraph>
                {issues.find(i => i.id === selectedIssue)?.description}
              </Typography>
              <Typography variant='h6' gutterBottom>
                Attachments
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: 2,
                  mb: 2
                }}
              >
                {issues
                  .find(i => i.id === selectedIssue)
                  ?.attachments.map((attachment, index) => (
                    <Card
                      key={index}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '150px'
                      }}
                      onClick={() => {
                        if (attachment.type.startsWith('video/')) {
                          handleOpenVideoDialog(attachment.url)
                        } else {
                          const link = document.createElement('a')
                          link.href = attachment.url
                          link.setAttribute('download', attachment.name)
                          link.setAttribute('target', '_blank')
                          link.style.display = 'none'
                          document.body.appendChild(link)
                          link.click()
                          document.body.removeChild(link)
                        }
                      }}
                    >
                      <Tooltip title={attachment.name}>
                        {attachment.type.startsWith('image/') ? (
                          <img
                            src={attachment.url}
                            alt={attachment.name}
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                          />
                        ) : attachment.type === 'application/pdf' ? (
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: '100px',
                              height: '100px'
                            }}
                          >
                            <PictureAsPdf sx={{ fontSize: 50 }} />
                          </Box>
                        ) : attachment.type.startsWith('video/') ? (
                          <video controls style={{ width: '100px', height: '100px' }}>
                            <source src={attachment.url} type={attachment.type} />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <AttachFileIcon sx={{ fontSize: 20 }} />
                        )}
                      </Tooltip>
                    </Card>
                  ))}
              </Box>
              <Typography variant='h6' gutterBottom>
                Comments
              </Typography>
              <List>
                {comments
                  .filter(comment => comment.issueId === selectedIssue)
                  .map(comment => (
                    <ListItem key={comment.id} alignItems='flex-start'>
                      <ListItemText
                        primary={
                          <>
                            <Typography component='span' variant='subtitle2'>
                              {comment.author}
                            </Typography>{' '}
                            •{' '}
                            <Typography component='span' variant='caption'>
                              {new Date(comment.timestamp).toLocaleString()}
                            </Typography>
                          </>
                        }
                        secondary={
                          <>
                            {comment.text}
                            {comment.attachment && (
                              <div style={{ marginTop: '8px' }}>
                                {comment.attachment.type.startsWith('image/') ? (
                                  <img
                                    src={comment.attachment.url}
                                    alt={comment.attachment.name}
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                  />
                                ) : comment.attachment.type === 'application/pdf' ? (
                                  <a href={comment.attachment.url} target='_blank' rel='noopener noreferrer'>
                                    <PictureAsPdf sx={{ fontSize: 50 }} />
                                    <Typography>{comment.attachment.name}</Typography>
                                  </a>
                                ) : comment.attachment.type.startsWith('video/') ? (
                                  <video controls style={{ maxWidth: '100%' }}>
                                    <source src={comment.attachment.url} type={comment.attachment.type} />
                                    Your browser does not support the video tag.
                                  </video>
                                ) : (
                                  <a href={comment.attachment.url} download>
                                    Download {comment.attachment.name}
                                  </a>
                                )}
                              </div>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                  ))}
              </List>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                  {...register('comment')}
                  fullWidth
                  multiline
                  rows={2}
                  placeholder='Add a comment...'
                  error={!!errors.comment}
                  helperText={errors.comment?.message}
                  sx={{ mb: 2 }}
                />
                <Controller
                  name='file'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <>
                      <input
                        type='file'
                        id='file-upload'
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files?.[0] || null
                          onChange(file)
                        }}
                        accept='image/*,application/pdf,video/mp4'
                      />
                      <label htmlFor='file-upload'>
                        <Button component='span' startIcon={<AttachFileIcon />}>
                          Attach File
                        </Button>
                      </label>
                      {value && <Typography>{value.name}</Typography>}
                    </>
                  )}
                />
                <Button type='submit' variant='contained' endIcon={<SendIcon />} disabled={isLoading}>
                  {isLoading ? <CircularProgress size={24} /> : 'Send'}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Box sx={{ display: 'flex', pl: 2, overflowY: 'auto' }}>
            <Typography variant='h6'>Select an issue to view details</Typography>
          </Box>
        )}
      </Box>
      {/* <Dialog open={videoDialogOpen} onClose={handleCloseVideoDialog} maxWidth='md' fullWidth>
        <DialogContent>
          <video controls style={{ width: '100%' }}>
            <source src={videoUrl} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog> */}
    </Box>
  )
}

export default ParentCommunicationViewIssues
