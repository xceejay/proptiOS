// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useState, useEffect } from 'react'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

const series = [{ data: [32, 52, 72, 94, 116, 94, 72] }]

const CrmRevenueGrowth = ({ DashData }) => {
  const [transactionCategories, setTransactionCategories] = useState([])

  useEffect(() => {
    if (transactionCategories.length === 0 && DashData) {
      console.log('data being restructured', DashData.transaction_categories)
      restructureTransactionCategories(DashData?.transaction_categories)
    }
  }, [DashData])

  const restructureTransactionCategories = data => {
    // Helper function to get month from date
    const getMonth = dateString => new Date(dateString).getMonth()

    // Function to aggregate payments by month for a given type
    const aggregateByMonth = paymentArray => {
      const monthlyTotals = Array(12).fill(0) // Create an array of 12 months
      paymentArray?.forEach(payment => {
        const month = getMonth(payment.created_at)
        monthlyTotals[month] += parseFloat(payment.amount)
      })

      return monthlyTotals
    }

    // Aggregate your payments
    const revenueData = aggregateByMonth(data?.rent)

    // Map to the structure you want
    const tabData = [
      {
        data: [...revenueData] // Replace with actual expense types
      }
    ]

    console.log('tabsdata rev', tabData)
    setTransactionCategories(tabData)
  }

  // ** Hook
  const theme = useTheme()

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '42%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: { enabled: false },
    colors: [
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 1),
      hexToRGBA(theme.palette.success.main, 0.16),
      hexToRGBA(theme.palette.success.main, 0.16)
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      show: false,
      padding: {
        top: -4,
        left: -9,
        right: -5,
        bottom: -12
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisTicks: { show: false },
      axisBorder: { show: false },
      tickPlacement: 'on',
      labels: {
        style: {
          fontSize: '12px',
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    yaxis: { show: false }
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ gap: 2, display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>
          <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Typography variant='h6' sx={{ mb: 1.5 }}>
                Revenue Growth
                {/* <a href='/api/auth/login'>Login</a> */}
              </Typography>
              <Typography variant='body2'>{new Date().getFullYear()} Report</Typography>
            </div>
            <div>
              <Typography variant='h5' sx={{ mb: 2 }}>
                $4,673
              </Typography>
              <CustomChip rounded size='small' skin='light' color='success' label='+15.2%' />
            </div>
          </Box>
          <ReactApexcharts type='bar' width={500} height={178} series={transactionCategories} options={options} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default CrmRevenueGrowth
