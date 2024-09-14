// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Avatar from '@mui/material/Avatar'
import TabContext from '@mui/lab/TabContext'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// ** Custom Components Import
import Icon from 'src/@core/components/icon'
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Util Import
import { useMediaQuery } from '@mui/material'

import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useAccounting } from 'src/hooks/useAccounting'

const renderTabs = (value, theme, transactionCategories) => {
  return transactionCategories.map((item, index) => {
    const RenderAvatar = item.type === value ? CustomAvatar : Avatar

    return (
      <Tab
        key={index}
        value={item.type}
        label={
          <Box
            sx={{
              width: 110,
              height: 94,
              borderWidth: 1,
              display: 'flex',
              alignItems: 'center',
              borderRadius: '10px',
              flexDirection: 'column',
              justifyContent: 'center',
              bpropertiestyle: item.type === value ? 'solid' : 'dashed',
              borderColor: item.type === value ? theme.palette.primary.main : theme.palette.divider
            }}
          >
            <RenderAvatar
              variant='rounded'
              {...(item.type === value && { skin: 'light' })}
              sx={{ mb: 2, width: 34, height: 34, ...(item.type !== value && { backgroundColor: 'action.selected' }) }}
            >
              <Icon icon={item.avatarIcon} />
            </RenderAvatar>
            <Typography sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
              {item.type}
            </Typography>
          </Box>
        }
      />
    )
  })
}

const renderTabPanels = (value, theme, options, colors, transactionCategories) => {
  return transactionCategories.map((item, index) => {
    const max = Math.max(...item.series[0].data)
    const seriesIndex = item.series[0].data.indexOf(max)
    const finalColors = colors.map((color, i) => (seriesIndex === i ? hexToRGBA(theme.palette.primary.main, 1) : color))

    return (
      <TabPanel key={index} value={item.type}>
        <ReactApexcharts type='bar' height={258} options={{ ...options, colors: finalColors }} series={item.series} />
      </TabPanel>
    )
  })
}

const CrmEarningReportsWithTabs = ({ DashData }) => {
  const tabData = [
    {
      type: 'revenue',
      avatarIcon: 'tabler:shopping-cart',
      series: [{ data: [28, 10, 45, 38, 15, 30, 35, 28, 8] }]
    },
    {
      type: 'expenses',
      avatarIcon: 'tabler:chart-bar',
      series: [{ data: [35, 25, 15, 40, 42, 25, 48, 8, 30] }]
    },

    {
      type: 'income',
      avatarIcon: 'tabler:currency-dollar',
      series: [{ data: [10, 22, 27, 33, 42, 32, 27, 22, 8] }]
    },
    {
      type: 'maintenance',
      avatarIcon: 'tabler:chart-pie-2',
      series: [{ data: [5, 9, 12, 18, 20, 25, 30, 36, 48] }]
    }
  ]

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

    // Map to the structure you want
    const tabData = [
      {
        type: 'revenue',
        avatarIcon: 'tabler:shopping-cart',
        series: [{ data: rentData }] // Assuming rent counts as revenue
      },
      {
        type: 'expenses',
        avatarIcon: 'tabler:chart-bar',
        series: [{ data: aggregateByMonth(data?.administrative_cost) }] // Replace with actual expense types
      },
      {
        type: 'income',
        avatarIcon: 'tabler:currency-dollar',
        series: [{ data: rentData }] // Assuming rent is a major income source
      },
      {
        type: 'maintenance',
        avatarIcon: 'tabler:chart-pie-2',
        series: [{ data: aggregateByMonth(data?.maintenance_and_repairs) }]
      }
    ]

    setTransactionCategories(tabData)
  }

  // ** State

  // ** Hook

  // ** State
  const [value, setValue] = useState('revenue')
  const [transactionCategories, setTransactionCategories] = useState([])

  // ** Hook
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')) // Add this

  useEffect(() => {
    if (DashData) {
      restructureTransactionCategories(DashData?.transaction_categories)
    }
  }, [DashData, value])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const colors = Array(12).fill(hexToRGBA(theme.palette.primary.main, 0.16))

  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: true }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: isMobile ? '45%' : '35%', // Adjust column width for mobile
        startingShape: 'rounded',
        dataLabels: { position: 'top' }
      }
    },
    legend: { show: false },
    tooltip: { enabled: true },
    dataLabels: {
      offsetY: -15,
      formatter: val => `${val}k`,
      style: {
        fontWeight: 500,
        fontSize: '1rem',
        colors: [theme.palette.text.secondary]
      }
    },
    colors,
    grid: {
      show: false,
      padding: {
        top: 20,
        left: isMobile ? 15 : -5, // Adjust padding for mobile
        right: isMobile ? 15 : -8,
        bottom: -12
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { color: theme.palette.divider },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          fontSize: '12px',
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -15,
        formatter: val => `$${val}k`,
        style: {
          fontSize: '12px',
          colors: theme.palette.text.disabled,
          fontFamily: theme.typography.fontFamily
        }
      }
    }
  }

  // responsive: [
  //   {
  //     breakpoint: theme.breakpoints.values.sm,
  //     options: {
  //       plotOptions: {
  //         bar: { columnWidth: '30%' }
  //       },
  //       grid: {
  //         padding: { right: 20 }
  //       }
  //     }
  //   }
  // ]
  return (
    <Card>
      <CardHeader
        title='Earning Reports'
        subheader='Yearly Earnings Overview'
        subheaderTypographyProps={{ sx: { mt: '0 !important' } }}
        action={
          <OptionsMenu
            options={['Last Week', 'Last Month', 'Last Year']}
            iconButtonProps={{ size: 'small', sx: { color: 'text.disabled' } }}
          />
        }
      />
      <CardContent sx={{ '& .MuiTabPanel-root': { p: 0 } }}>
        <TabContext value={value}>
          <TabList
            variant='scrollable'
            scrollButtons='auto'
            onChange={handleChange}
            aria-label='earning report tabs'
            sx={{
              border: '0 !important',
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': {
                p: 0,
                minWidth: isMobile ? 60 : 110, // Adjust tab size for mobile
                borderRadius: '10px',
                '&:not(:last-child)': { mr: isMobile ? 2 : 4 } // Adjust margin for mobile
              }
            }}
          >
            {renderTabs(value, theme, transactionCategories)}
          </TabList>
          {renderTabPanels(value, theme, options, colors, transactionCategories)}
        </TabContext>
      </CardContent>
    </Card>
  )
}

export default CrmEarningReportsWithTabs
