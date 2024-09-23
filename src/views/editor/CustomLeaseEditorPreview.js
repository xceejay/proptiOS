import { Box, Stack, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import { RichTextReadOnly } from 'mui-tiptap'

const CustomLeasePreview = props => {
  const { defaultLeaseText, formVariables } = props
  const rteRef = useRef(null)

  const [submittedContent, setSubmittedContent] = useState('')

  const handleReplaceVars = htmlContent => {
    if (!rteRef.current?.editor || !htmlContent) {
      return
    }

    const variableMap = {
      tenant_name: formVariables.tenant?.name || '{{tenant_name}}',
      landlord_name: formVariables.landlord?.name || '{{landlord_name}}',
      currency: formVariables.currency || '{{currency}}',
      rent_amount: formVariables.rent_amount || '{{rent_amount}}',
      payment_frequency: formVariables.payment_frequency || '{{payment_frequency}}',
      lease_start_date: formVariables.lease_start_date || '{{lease_start_date}}',
      lease_end_date: formVariables.lease_end_date || '{{lease_end_date}}',
      title: formVariables.title || '{{title}}',
      unit_name: formVariables.unit_name || '{{unit_name}}',
      property_name: formVariables.property_name || '{{property_name}}'
    }

    const updatedContent = htmlContent.replace(/{{(\w+)}}/g, (match, variableName) => {
      return variableMap[variableName] || match
    })

    rteRef.current.editor.commands.setContent(updatedContent)
  }

  return (
    <Box width={1}>
      <RichTextReadOnly ref={rteRef} content={defaultLeaseText} />
    </Box>
  )
}

export default CustomLeasePreview
