// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import CardContent from '@mui/material/CardContent'
import { Box, Stack, Typography } from '@mui/material'
import { useRef, useState, useEffect } from 'react'
import { RichTextReadOnly } from 'mui-tiptap'
import { styled, useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import { useRouter } from 'next/router'
import useExtensions from 'src/views/editor/useExtensions'

const PreviewCardById = ({ setLeaseData, leaseData }) => {
  const extensions = useExtensions({
    placeholder: 'Add your own content here...'
  })

  // ** Hook
  const theme = useTheme()
  return (
    <Card>
      <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
        {leaseData ? (
          <>
            <Box mt={3}>
              <RichTextReadOnly content={leaseData.html} extensions={extensions} />
            </Box>
          </>
        ) : (
          <></>
        )}
      </CardContent>

      <Divider />
      <CardContent sx={{ px: [6, 10] }}>
        <Typography sx={{ color: 'text.secondary' }}>
          <Typography component='span' sx={{ mr: 1.5, fontWeight: 500, color: 'inherit' }}>
            Note:
          </Typography>
          Thank you
        </Typography>
      </CardContent>
    </Card>
  )
}

export default PreviewCardById
