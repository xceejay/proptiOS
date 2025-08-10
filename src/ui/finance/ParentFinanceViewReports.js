// ** React Imports
import { useState, useRef } from 'react'

// ** MUI Imports
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  Tooltip,
  IconButton,
  CircularProgress
} from '@mui/material'
import { CardHeader } from '@mui/material'
import Icon from 'src/@core/components/icon'

import { useEffect } from 'react'
import toast from 'react-hot-toast'

import { useFinance } from 'src/hooks/useFinance'
import { RefreshRounded } from '@mui/icons-material'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
const ParentFinanceViewReports = ({ setFinanceData, financeData }) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const finance = useFinance()

  const [allFinancialReports, setAllFinancialReports] = useState({
    Income: [
      { title: 'Net Income (Profit & Loss)', description: 'Revenue minus expenses, highlighting profitability.' },
      { title: 'Net Income By Property', description: 'Summary of your profitability for each property.' },
      { title: 'Owner Statement', description: "Summarizes your rental property's income, expenses, and net profit." },
      {
        title: 'Rent Roll',
        description:
          'Lists all tenants, rental units, and lease details, providing a snapshot of rental income and occupancy status.'
      }
    ],
    'Cash Flow': [
      { title: 'Operating Cash Flow', description: 'Tracks cash generated or used in daily operations.' },
      { title: 'Operating Cash Flow By Property', description: 'The cash generated or used for each property.' },
      { title: 'Cash Flow Statement', description: 'Shows all incoming and outgoing cash.' },
      { title: 'Cash Flows By Property', description: 'Shows all incoming and outgoing cash for each property.' }
    ],
    Performance: [
      { title: 'Net Operating Income (NOI)', description: 'Helps show profitability before financing and taxes.' },
      {
        title: 'Cash on Cash',
        description: 'Compares the cash earned from your rental property to the cash invested.'
      },
      {
        title: 'Cap Rate',
        description:
          'Calculates the rate of return on your rental property by comparing its net operating income to its market value.'
      },
      {
        title: 'Operating Expense Ratio',
        description: 'Shows the percentage of your rental income spent on operating expenses.'
      }
    ]
  })

  useEffect(() => {
    finance.getAllReports(
      responseData => {
        const { data } = responseData

        if (data?.status === 'NO_RES') {
          console.log('NO results')
        } else if (data?.status === 'FAILED') {
          alert(response.message || 'Failed to fetch transactions')
        } else {
          console.log(' data has been fetched in reports', data)
          setAllFinancialReports(data)
        }

        setLoading(false) // Stop loading when the request completes
      },
      error => {
        console.log(error)
        toast.error(error.response?.data?.description || 'An error occurred. Please try again or contact support.', {
          duration: 5000
        })
        setLoading(false) // Stop loading on error
      }
    )
  }, [])

  // Helper function to handle opening the dialog
  const handleOpenDialog = report => {
    setSelectedReport(report)
    setOpenDialog(true)
  }

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedReport(null)
  }

  const contentRef = useRef(null)

  const handleExportPdf = () => {
    const input = contentRef.current
    html2canvas(input, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4') // 'p' for portrait, 'a4' for standard size
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width // Maintain aspect ratio
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${selectedReport?.title || 'report'}.pdf`)
    })
  }

  // Function to map through each report category
  const renderReportCategory = (category, reports) => (
    <Card key={category}>
      <CardHeader title={category} />
      <CardContent>
        <Grid gap={2} container justifyContent={'center'}>
          {reports.map((report, index) => (
            <Grid
              key={index}
              sx={{
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: '4px',
                color: 'text.secondary'
              }}
              size={{
                xs: 12,
                lg: 5
              }}>
              <Button
                color='secondary'
                onClick={() => handleOpenDialog(report)}
                sx={{ justifyContent: 'flex-start', width: '100%', textTransform: 'none' }}
              >
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                  <Box>
                    <Icon icon='tabler:report' fontSize={40} />
                  </Box>
                  <Box sx={{ p: 5 }} display={'flex'} flexDirection={'column'} alignItems={'flex-start'}>
                    <Box>
                      <Typography fontWeight={'bold'}>{report.title}</Typography>
                    </Box>
                    <Box textAlign={'left'}>
                      <Typography>{report.description}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Button>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )

  // Map of financial reports categories and their respective data
  // const financialReports = {
  //   Income: [
  //     { title: 'Net Income (Profit & Loss)', description: 'Revenue minus expenses, highlighting profitability.' },
  //     { title: 'Net Income By Property', description: 'Summary of your profitability for each property.' },
  //     { title: 'Owner Statement', description: "Summarizes your rental property's income, expenses, and net profit." },
  //     {
  //       title: 'Rent Roll',
  //       description:
  //         'Lists all tenants, rental units, and lease details, providing a snapshot of rental income and occupancy status.'
  //     }
  //   ],
  //   'Cash Flow': [
  //     { title: 'Operating Cash Flow', description: 'Tracks cash generated or used in daily operations.' },
  //     { title: 'Operating Cash Flow By Property', description: 'The cash generated or used for each property.' },
  //     { title: 'Cash Flow Statement', description: 'Shows all incoming and outgoing cash.' },
  //     { title: 'Cash Flows By Property', description: 'Shows all incoming and outgoing cash for each property.' }
  //   ],
  //   Performance: [
  //     { title: 'Net Operating Income (NOI)', description: 'Helps show profitability before financing and taxes.' },
  //     {
  //       title: 'Cash on Cash',
  //       description: 'Compares the cash earned from your rental property to the cash invested.'
  //     },
  //     {
  //       title: 'Cap Rate',
  //       description:
  //         'Calculates the rate of return on your rental property by comparing its net operating income to its market value.'
  //     },
  //     {
  //       title: 'Operating Expense Ratio',
  //       description: 'Shows the percentage of your rental income spent on operating expenses.'
  //     }
  //   ],
  //   Assets: [
  //     { title: 'Portfolio Value By Property', description: 'Tracks the value of each property within a portfolio.' },
  //     {
  //       title: 'Balance Sheet',
  //       description: 'Snapshot of assets, liabilities, and equity at a specific point in time.'
  //     }
  //   ],
  //   Taxes: [
  //     { title: 'Tax Packet Export', description: 'A comprehensive export of tax-related documents and data.' },
  //     { title: 'Tax Review', description: 'Reviews tax-related information for accuracy and compliance.' },
  //     {
  //       title: 'Schedule E',
  //       description: 'Details income and expenses for rental properties and real estate investments.'
  //     },
  //     {
  //       title: 'Form 8825',
  //       description: 'Reports income and expenses for rental real estate activities required by Form 8825.'
  //     }
  //   ]
  // }

  return (
    <Grid container spacing={5}>
      <Grid>
        {!loading ? (
          <>
            {' '}
            <Tooltip title='Refresh Reports'>
              <IconButton onClick={() => console.log('refresh')}>
                <RefreshRounded color='primary'></RefreshRounded>
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <>
            {' '}
            <CircularProgress size={20} disableShrink color='primary'></CircularProgress>{' '}
          </>
        )}
      </Grid>
      {/* Dynamically render all report categories */}
      {Object.entries(allFinancialReports).map(([category, reports]) => (
        <Grid key={category} size={12}>
          {renderReportCategory(category, reports)}
        </Grid>
      ))}
      {/* Dialog for displaying report details */}
      <Dialog fullWidth maxWidth='lg' open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedReport?.title}</DialogTitle>
        <DialogContent>
          {/* Ref to capture only the dialog content, excluding the buttons */}
          <div ref={contentRef}>
            <TableContainer component={Paper}>
              <Table aria-label='report details table'>
                <TableBody>
                  {/* Title Row */}
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      <strong>Title</strong>
                    </TableCell>
                    <TableCell>{selectedReport?.title}</TableCell>
                  </TableRow>

                  {/* Description Row */}
                  <TableRow>
                    <TableCell component='th' scope='row'>
                      <strong>Description</strong>
                    </TableCell>
                    <TableCell>{selectedReport?.description}</TableCell>
                  </TableRow>

                  {/* Breakdown for Revenues, Expenses, and Net Income */}
                  {selectedReport?.breakdown && (
                    <>
                      {/* Revenues Section */}
                      {selectedReport.breakdown.revenues && (
                        <>
                          <TableRow>
                            <TableCell colSpan={2}>
                              <strong>{selectedReport.breakdown.revenues.title}</strong>
                            </TableCell>
                          </TableRow>
                          {selectedReport.breakdown.revenues.transactions?.map((transaction, index) => (
                            <TableRow key={index}>
                              <TableCell component='th' scope='row'>
                                Transaction ID: {transaction.uuid}
                              </TableCell>
                              <TableCell>
                                Amount: {transaction.amount} {transaction.currency} <br />
                                Payment Method: {transaction.payment_method} <br />
                                Date: {new Date(transaction.created_at).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={2}>
                              <strong>Total: {selectedReport.breakdown.revenues.amount}</strong>
                            </TableCell>
                          </TableRow>
                        </>
                      )}

                      {/* Expenses Section */}
                      {selectedReport.breakdown.expenses && (
                        <>
                          <TableRow>
                            <TableCell colSpan={2}>
                              <strong>{selectedReport.breakdown.expenses.title}</strong>
                            </TableCell>
                          </TableRow>
                          {selectedReport.breakdown.expenses.transactions?.map((transaction, index) => (
                            <TableRow key={index}>
                              <TableCell component='th' scope='row'>
                                Transaction ID: {transaction.uuid}
                              </TableCell>
                              <TableCell>
                                Amount: {transaction.amount} {transaction.currency} <br />
                                Payment Method: {transaction.payment_method} <br />
                                Date: {new Date(transaction.created_at).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow>
                            <TableCell colSpan={2}>
                              <strong>Total: {selectedReport.breakdown.expenses.amount}</strong>
                            </TableCell>
                          </TableRow>
                        </>
                      )}

                      {/* Net Income / Net Operating Income Section */}
                      {selectedReport.breakdown.net_income || selectedReport.breakdown.net_operating_income ? (
                        <TableRow>
                          <TableCell colSpan={2}>
                            <strong>
                              {selectedReport.breakdown.net_income?.title ||
                                selectedReport.breakdown.net_operating_income?.title}
                            </strong>
                          </TableCell>
                          <TableCell>
                            {selectedReport.breakdown.net_income?.amount ||
                              selectedReport.breakdown.net_operating_income?.amount}
                          </TableCell>
                        </TableRow>
                      ) : null}

                      {/* Property Breakdown */}
                      {Array.isArray(selectedReport?.breakdown) &&
                        selectedReport.breakdown.map((propertyBreakdown, index) => (
                          <TableRow key={index}>
                            <TableCell colSpan={2}>
                              <strong>Property: {propertyBreakdown?.property_name || 'N/A'}</strong>
                            </TableCell>
                            <TableCell>
                              Revenues: {propertyBreakdown?.net_income?.revenues || '0.00'} <br />
                              Expenses: {propertyBreakdown?.net_income?.expenses || '0.00'} <br />
                              Net Income: {propertyBreakdown?.net_income?.net_income || '0.00'}
                            </TableCell>
                          </TableRow>
                        ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='secondary'>
            Close
          </Button>
          <Button onClick={handleExportPdf} color='primary'>
            Export to PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default ParentFinanceViewReports
