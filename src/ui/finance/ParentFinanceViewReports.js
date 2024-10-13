// ** React Imports
import { useState } from 'react'

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
  DialogContentText,
  Grid
} from '@mui/material'
import { CardActionArea, CardActions, CardHeader } from '@mui/material'
import Icon from 'src/@core/components/icon'

import { useEffect } from 'react'
import toast from 'react-hot-toast'

import { useFinance } from 'src/hooks/useFinance'

const ParentFinanceViewReports = ({ setFinanceData, financeData }) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)

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

  // Function to map through each report category
  const renderReportCategory = (category, reports) => (
    <Card key={category}>
      <CardHeader title={category} />
      <CardContent>
        <Grid gap={2} container justifyContent={'center'}>
          {reports.map((report, index) => (
            <Grid
              key={index}
              xs={12}
              lg={5}
              item
              sx={{
                border: theme => `1px solid ${theme.palette.divider}`,
                borderRadius: '4px',
                color: 'text.secondary'
              }}
            >
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

  const financialReports = {
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
  }

  return (
    <Grid container spacing={6}>
      {/* Dynamically render all report categories */}
      {Object.entries(financialReports).map(([category, reports]) => (
        <Grid item xs={12} key={category}>
          {renderReportCategory(category, reports)}
        </Grid>
      ))}
      {/* Dialog for displaying report details */}
      <Dialog fullWidth open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{selectedReport?.title}</DialogTitle>
        <DialogContent>
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

                {/* You can add more rows here if your report data contains additional details */}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='secondary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>{' '}
    </Grid>
  )
}

export default ParentFinanceViewReports
