// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import { useState, useEffect } from 'react'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const series = [
  { name: 'Rent Paid', data: [32, 27, 27, 30, 25, 25] },
  { name: 'Rent Due', data: [25, 35, 20, 20, 20, 20] }
]

const CrmSalesWithRadarChart = ({ DashData }) => {
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
    const rentData = aggregateByMonth(data?.rent)
    const administrativeCostData = aggregateByMonth(data?.administrative_cost)

    // Map to the structure you want
    const tabData = [
      {
        name: 'Rent',
        data: [...rentData] // Assuming rent counts as revenue
      },
      {
        name: 'Administrative Cost',
        data: [...administrativeCostData] // Replace with actual expense types
      }
    ]

    console.log('tabsdata', tabData)
    setTransactionCategories(tabData)
  }

  // ** Hook
  const theme = useTheme()

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: true }
    },
    colors: [theme.palette.primary.main, theme.palette.error.main],
    plotOptions: {
      radar: {
        size: 110,
        polygons: {
          strokeColors: theme.palette.divider,
          connectorColors: theme.palette.divider
        }
      }
    },
    stroke: { width: 2 }, // Adjust stroke width for visibility
    fill: {
      opacity: [0.7, 0.4] // Adjust fill opacity for better visibility
    },
    markers: { size: 4 }, // Add visible markers
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    grid: {
      show: true, // Show grid lines to visualize radar structure
      padding: {
        top: 10
      }
    },
    xaxis: {
      labels: {
        show: true,
        style: {
          fontSize: '12px',
          colors: [
            theme.palette.text.primary,
            theme.palette.text.primary,
            theme.palette.text.primary,
            theme.palette.text.primary,
            theme.palette.text.primary,
            theme.palette.text.primary,
            theme.palette.text.primary,
            theme.palette.text.primary,
            theme.palette.text.primary,
            theme.palette.text.primary,
            theme.palette.text.primary,
            theme.palette.text.primary
          ]
        }
      }
    },
    yaxis: {
      show: false,
      min: 0
    },
    legend: {
      fontSize: '12px',
      fontFamily: theme.typography.fontFamily,
      labels: { colors: theme.palette.text.secondary },
      itemMargin: {
        vertical: 4,
        horizontal: 10
      },
      markers: {
        width: 12,
        height: 12,
        radius: 10,
        offsetY: 1,
        offsetX: theme.direction === 'ltr' ? -4 : 5
      }
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.lg,
        options: {
          chart: { height: 342 }
        }
      }
    ]
  }

  return (
    <Card>
      <CardHeader
        title='Rent Payments'
        subheader={'Year ' + new Date().getFullYear()}
        subheaderTypographyProps={{ sx: { mt: '0 !important' } }}
        action={
          <OptionsMenu
            options={['Last Month', 'Last 6 months', 'Last Year']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <CardContent>
        <ReactApexcharts type='radar' height={352} series={transactionCategories} options={options} />
      </CardContent>
    </Card>
  )
}

export default CrmSalesWithRadarChart
