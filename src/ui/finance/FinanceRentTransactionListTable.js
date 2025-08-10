// ** React Imports
import { useState, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import addDays from 'date-fns/addDays'

import Typography from '@mui/material/Typography'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Component Imports
import CustomAvatar from 'src/@core/components/mui/avatar'
import OptionsMenu from 'src/@core/components/option-menu'
import ServerSideToolbarTenantManage from 'src/views/table/data-grid/ServerSideToolbarTenantManage'
import CustomTenantToolbar from 'src/views/table/data-grid/CustomTenantToolbar'
import { Grid } from '@mui/material'
import CustomFinanceToolbar from 'src/views/table/data-grid/CustomFinanceToolbar'
import CustomRangeDatePicker from '../CustomRangeDatePicker'
import CustomNoRowsOverlay from '../CustomNoRowsOverlay'

const LinkStyled = styled(Link)(({ theme, color }) => ({
  fontSize: '13px',
  textDecoration: 'none',
  color: theme.palette[color] ? theme.palette[color].main : theme.palette.primary.main
}))

// ** Vars
const statusObj = {
  pending: { color: 'secondary', icon: 'tabler:inner-shadow-left-filled' },
  completed: { color: 'success', icon: 'tabler:circle-check' },
  failed: { color: 'error', icon: 'tabler:circle-x' },
  refunded: { color: 'info', icon: 'tabler:arrow-down-circle' }

  // 'Partial Payment': { color: 'warning', icon: 'tabler:chart-pie' },
  // 'Past Due': { color: 'error', icon: 'tabler:alert-circle' },
}

const columns = [
  {
    flex: 0.5,
    field: 'uuid',
    minWidth: 100,
    headerName: 'Transaction ID',
    renderCell: ({ row }) => {
      const { status } = row

      return (
        <LinkStyled
          color={statusObj[status] ? statusObj[status].color : 'primary'}
          href={`/finance/receipt/view/${row.uuid}`}
        >{`${row.uuid}`}</LinkStyled>
      )
    }
  },
  {
    flex: 0.15,
    minWidth: 80,
    field: 'status',
    renderHeader: () => <Icon icon='tabler:trending-up' fontSize='1.125rem' />,
    renderCell: ({ row }) => {
      const { dueDate, balance, status } = row
      const color = statusObj[status] ? statusObj[status].color : 'primary'

      return (
        <Tooltip
          title={
            <>
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                {status}
              </Typography>
              <br />
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                Balance:
              </Typography>{' '}
              {balance}
              <br />
              <Typography variant='caption' sx={{ color: 'common.white', fontWeight: 600 }}>
                Due Date:
              </Typography>{' '}
              {dueDate}
            </>
          }
        >
          <CustomAvatar skin='light' color={color} sx={{ width: 30, height: 30 }}>
            <Icon icon={statusObj[status].icon} />
          </CustomAvatar>
        </Tooltip>
      )
    }
  },
  {
    flex: 0.5,
    minWidth: 150,
    field: 'amount',
    headerName: 'Amount',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>${row.amount || 0}</Typography>
  },
  {
    flex: 0.5,
    minWidth: 150,
    field: 'property_name',
    headerName: 'Property',
    renderCell: ({ row }) => (
      <Typography sx={{ textTransform: 'capitalize', color: 'text.secondary' }}>{row.property_name}</Typography>
    )
  },
  {
    flex: 0.5,
    minWidth: 150,
    field: 'unit_name',
    headerName: 'Unit',
    renderCell: ({ row }) => (
      <Typography sx={{ textTransform: 'capitalize', color: 'text.secondary' }}>{row.unit_name || ''}</Typography>
    )
  },
  {
    flex: 0.5,
    minWidth: 150,
    field: 'tenant',
    headerName: 'Tenant',
    renderCell: ({ row }) => (
      <Typography sx={{ textTransform: 'capitalize', color: 'text.secondary' }}>{row.tenant_name}</Typography>
    )
  },
  {
    flex: 0.5,
    minWidth: 100,
    field: 'payment_method',
    headerName: 'Payment Method',
    renderCell: ({ row }) => (
      <Typography sx={{ textTransform: 'capitalize', color: 'text.secondary' }}>
        {row.payment_method.replace('_', ' ') || 0}
      </Typography>
    )
  },
  {
    flex: 0.5,
    minWidth: 125,
    field: 'created_at',
    headerName: 'Payment Date',
    renderCell: ({ row }) => <Typography sx={{ color: 'text.secondary' }}>{row.created_at}</Typography>
  }

  // {
  // flex: 0.1,
  // minWidth: 130,
  // sortable: false,
  // field: 'actions',
  // headerName: 'Actions',
  // renderCell: ({ row }) => (
  //   <Box sx={{ display: 'flex', alignItems: 'center' }}>
  //     <Tooltip title='Delete Invoice'>
  //       <IconButton size='small' sx={{ color: 'text.secondary' }}>
  //         <Icon icon='tabler:trash' />
  //       </IconButton>
  //     </Tooltip>
  //     <Tooltip title='View'>
  //       <IconButton
  //         size='small'
  //         component={Link}
  //         sx={{ color: 'text.secondary' }}
  //         href={`/apps/invoice/preview/${row.id}`}
  //       >
  //         <Icon icon='tabler:eye' />
  //       </IconButton>
  //     </Tooltip>
  //     <OptionsMenu
  //       iconButtonProps={{ size: 'small' }}
  //       menuProps={{ sx: { '& .MuiMenuItem-root svg': { mr: 2 } } }}
  //       options={[
  //         {
  //           text: 'Download',
  //           icon: <Icon icon='tabler:download' />
  //         },
  //         {
  //           text: 'Edit',
  //           href: `/apps/invoice/edit/${row.id}`,
  //           icon: <Icon icon='tabler:pencil' />
  //         },
  //         {
  //           text: 'Duplicate',
  //           icon: <Icon icon='tabler:copy' />
  //         }
  //       ]}
  //     />
  //   </Box>
  // )
  // }
]

const FinanceRentTransactionListTable = ({ rentTransactions }) => {
  const [startDateRange, setStartDateRange] = useState()
  const [endDateRange, setEndDateRange] = useState()
  const handleOnChangeRange = dates => {
    const [start, end] = dates
    setStartDateRange(start)
    setEndDateRange(end)
  }

  // ** State
  const [anchorEl, setAnchorEl] = useState(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [value, setValue] = useState('')

  const [statusValue, setStatusValue] = useState('')
  const [statuses, setStatuses] = useState([
    { text: 'All', value: '' },
    { text: 'Pending', value: 'pending' },
    { text: 'Completed', value: 'completed' },
    { text: 'Failed', value: 'failed' },
    { text: 'Refunded', value: 'refunded' }
  ])

  const [paymentMethodValue, setPaymentMethodValue] = useState('')

  const [paymentMethods, setPaymentMethods] = useState([
    { text: 'All', value: '' },
    { text: 'Cash', value: 'cash' },
    { text: 'Mobile Money', value: 'mobile_money' },
    { text: 'Bank Transfer', value: 'bank_transfer' },
    { text: 'Check', value: 'check' },
    { text: 'Debit Card', value: 'debit_card' },
    { text: 'Credit Card', value: 'credit_card' }
  ])

  const [paymentTypes, setPaymentTypes] = useState([
    { text: 'All', value: '' },
    { text: 'Rent', value: 'rent' },
    { text: 'Management Fee', value: 'management_fee' },
    { text: 'Maintenance and Repairs', value: 'maintenance_and_repairs' },
    { text: 'Tenant Management', value: 'tenant_management' },
    { text: 'Administrative Cost', value: 'administrative_cost' },
    { text: 'Marketing and Advertising', value: 'marketing_and_advertising' },
    { text: 'Legal and Accounting', value: 'legal_and_accounting' },
    { text: 'Insurance', value: 'insurance' },
    { text: 'Miscellaneous', value: 'miscellaneous' }
  ])

  const [paymentTypeValue, setPaymentTypeValue] = useState('')

  const [filterModel, setFilterModel] = useState({
    items: [
      { field: 'status', operator: 'equals', value: statusValue },
      { field: 'payment_method', operator: 'equals', value: paymentMethodValue },
      { field: 'payment_type', operator: 'equals', value: paymentTypeValue }
    ]
  })

  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  // ** Var
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const filteredRows = rentTransactions
    ? rentTransactions.filter(
        row =>
          (statusValue ? row.status === statusValue : true) &&
          (paymentMethodValue ? row.payment_method === paymentMethodValue : true) &&
          (paymentTypeValue ? row.payment_type === paymentTypeValue : true)
      )
    : []

  return (
    <Grid container spacing={6.5}>
      <Grid
        size={{
          xs: 12,
          lg: 12
        }}>
        <Card>
          {console.log('so the transaction data', rentTransactions)}
          <CardHeader
            title='Rent Transactions'
            sx={{ '& .MuiCardHeader-action': { m: 0 } }}
            action={
              <>
                <Box>
                  <CustomRangeDatePicker
                    startDateRange={startDateRange}
                    endDateRange={endDateRange}
                    handleOnChangeRange={handleOnChangeRange}
                  ></CustomRangeDatePicker>
                </Box>
              </>
            }
          />
          <DataGrid
            autoHeight
            rowHeight={54}
            columns={columns}
            loading={false}
            slots={{ toolbar: CustomFinanceToolbar, noRowsOverlay: CustomNoRowsOverlay }}
            rows={filteredRows}
            disableRowSelectionOnClick
            pageSizeOptions={[7, 10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            filterModel={filterModel} // Track the filterModel state
            onFilterModelChange={newFilterModel => {
              // Update the filterModel state dynamically for any field or operator change
              setFilterModel(newFilterModel)

              // Loop through each filter item and dynamically update values
              newFilterModel.items.forEach(item => {
                switch (item.field) {
                  case 'status':
                    setStatusValue(item.value)
                    break
                  case 'payment_method':
                    setPaymentMethodValue(item.value)
                    break
                  case 'payment_type':
                    setPaymentTypeValue(item.value)
                    break
                  default:
                    // Handle other fields dynamically if needed
                    break
                }
              })
            }}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  status: true,
                  payment_method: true,
                  payment_type: true
                }
              }
            }}
            slotProps={{
              toolbar: {
                statusValue,
                setStatusValue,
                statuses,
                paymentMethodValue,
                setPaymentMethodValue,
                paymentMethods,
                searchPlaceholder: 'Quick Search',
                addText: 'Create Invoice',
                value,
                handleFilter
              }
            }}
          />
        </Card>
      </Grid>
    </Grid>
  );
}

export default FinanceRentTransactionListTable
