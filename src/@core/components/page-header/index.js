// ** MUI Imports
import { GridLegacy as Grid } from '@mui/material'

const PageHeader = props => {
  // ** Props
  const { title, subtitle } = props

  return (
    <Grid item xs={12}>
      {title}
      {subtitle || null}
    </Grid>
  )
}

export default PageHeader
