// ** MUI Imports
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'
import { Box, Typography } from '@mui/material'
import { RichTextReadOnly } from 'mui-tiptap'
import { useTheme } from '@mui/material/styles'

// ** Configs
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
              <RichTextReadOnly content={leaseData.lease_html} extensions={extensions} />
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
