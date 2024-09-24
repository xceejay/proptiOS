import { Box, Stack, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import { RichTextReadOnly } from 'mui-tiptap'

const CustomLeasePreview = props => {
  const { defaultLeaseText, formVariables } = props
  const rteRef = useRef(null)

  const [submittedContent, setSubmittedContent] = useState('')

  return (
    <Box width={1}>
      <RichTextReadOnly ref={rteRef} content={defaultLeaseText} />
    </Box>
  )
}

export default CustomLeasePreview
