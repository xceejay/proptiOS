// ** MUI Imports
import Grid from '@mui/material/Grid'

const PageHeader = props => {
  // ** Props
  const { title, subtitle } = props

  return (
    <Grid size={12}>
      {title}
      {subtitle || null}
    </Grid>
  )
}

export default PageHeader
