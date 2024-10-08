// ** React Imports
import { useEffect, useState, useRef } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Divider from '@mui/material/Divider'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'
import TableContainer from '@mui/material/TableContainer'
import TableCell from '@mui/material/TableCell'
import Icon from '@mui/material/Icon'

// ** Third Party Components
import axios from 'axios'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import { useReactToPrint } from 'react-to-print'
import { useRouter } from 'next/router'

const statusObj = {
  completed: { color: 'success', icon: 'tabler:circle-check' }
}

const CalcWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))

const MUITableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: 0,
  paddingLeft: '0 !important',
  paddingRight: '0 !important',
  paddingTop: `${theme.spacing(1)} !important`,
  paddingBottom: `${theme.spacing(1)} !important`
}))

const ReceiptPrint = ({ receiptData }) => {
  // ** State
  const [error, setError] = useState(false)
  const [data, setData] = useState(null)
  const router = useRouter()
  const contentRef = useRef(null)
  const reactToPrintFn = useReactToPrint({ contentRef })

  useEffect(() => {
    reactToPrintFn()
  }, [])

  // ** Hooks
  const theme = useTheme()

  if (receiptData) {
    return (
      <Box sx={{ p: 12, pb: 6 }}>
        <Card ref={contentRef}>
          {/* Header Section */}
          <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
            <Grid container spacing={6}>
              {/* Company Info */}
              <Grid item sm={6} xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                    <Icon sx={{ fontSize: 34, color: theme.palette.primary.main }}>business</Icon>
                    <Typography
                      variant='h6'
                      sx={{
                        ml: 2.5,
                        fontWeight: 600,
                        lineHeight: '24px',
                        fontSize: '1.375rem !important'
                      }}
                    >
                      {themeConfig.templateName}
                    </Typography>
                  </Box>
                  <div>
                    <Typography sx={{ mb: 2, color: 'text.secondary' }}>
                      Office 149, 450 South Brand Brooklyn
                    </Typography>
                    <Typography sx={{ mb: 2, color: 'text.secondary' }}>San Diego County, CA 91905, USA</Typography>
                    <Typography sx={{ color: 'text.secondary' }}>+1 (123) 456 7891, +44 (876) 543 2198</Typography>
                  </div>
                </Box>
              </Grid>
              {/* Receipt Details */}
              <Grid item sm={6} xs={12}>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                  <Table sx={{ maxWidth: '210px' }}>
                    <TableBody>
                      <TableRow>
                        <MUITableCell>
                          <Typography variant='h6'>Receipt</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography
                            variant='h6'
                            color={statusObj['completed'].color}
                          >{`#${receiptData.id}`}</Typography>
                        </MUITableCell>
                      </TableRow>
                      <TableRow>
                        <MUITableCell>
                          <Typography sx={{ color: 'text.secondary' }}>Issued On:</Typography>
                        </MUITableCell>
                        <MUITableCell>
                          <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>
                            {receiptData.issuedDate}
                          </Typography>
                        </MUITableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
            </Grid>
          </CardContent>

          <Divider />

          {/* Tenant & Property Summary Section */}
          <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
            <Box display={'flex'} justifyContent={'space-between'}>
              <Box>
                <Typography sx={{ fontWeight: 500 }}>Tenant Information</Typography>
                <Typography sx={{ color: 'text.secondary' }}>Name: {receiptData.tenant.name}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>Email: {receiptData.tenant.email}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>Phone: {receiptData.tenant.tel_number}</Typography>
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 500 }}>Property Information</Typography>
                <Typography sx={{ color: 'text.secondary' }}>Property: {receiptData.property.name}</Typography>
                <Typography sx={{ color: 'text.secondary' }}>Unit: {receiptData.unit.name || 'None'}</Typography>
              </Box>
            </Box>
          </CardContent>

          <Divider />

          {/* Transaction Summary Section */}
          <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
            <Grid container>
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: 500 }}>Payment Summary</Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>Transaction ID: </Typography>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        ml: 1,
                        color: theme.palette[statusObj['completed'].color]?.main
                      }}
                    >
                      {`${receiptData.uuid}`}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>Amount Paid: </Typography>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        ml: 1,
                        color: theme.palette[statusObj['completed'].color]?.main
                      }}
                    >
                      {`${receiptData.amount}`} {`${receiptData.currency}`}
                    </Typography>
                  </Box>
                  <Typography sx={{ mb: 1.5, color: 'text.secondary' }}>
                    Status:{' '}
                    <Typography
                      component='span'
                      sx={{
                        textTransform: 'capitalize',
                        fontWeight: 500,
                        color: theme.palette[statusObj['completed'].color]?.main
                      }}
                    >
                      Completed
                    </Typography>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>

          <Divider />

          {/* Summary Section */}
          <CardContent sx={{ p: [`${theme.spacing(6)} !important`, `${theme.spacing(10)} !important`] }}>
            <Grid container>
              <Grid item xs={12} sm={7}>
                <Typography sx={{ color: 'text.secondary' }}>Thank you for your payment!</Typography>
              </Grid>
              <Grid item xs={12} sm={5}>
                <CalcWrapper>
                  <Typography sx={{ color: 'text.secondary' }}>Total Paid:</Typography>
                  <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>{`$${receiptData.total}`}</Typography>
                </CalcWrapper>
              </Grid>
            </Grid>
          </CardContent>

          <Divider />

          {/* Note Section */}
          <CardContent sx={{ px: [6, 10] }}>
            <Typography sx={{ color: 'text.secondary' }}>
              <Typography component='span' sx={{ mr: 1.5, fontWeight: 500, color: 'inherit' }}>
                Note:
              </Typography>
              We appreciate your business. Please retain this receipt for your records.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    )
  } else {
    return null
  }
}
export default ReceiptPrint
