// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { GridToolbarExport } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import Link from 'next/link'

import { useState, forwardRef } from 'react'

// ** MUI Imports

// ** Third Party Imports
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'


// ** MUI Imports


// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { Button, CardHeader, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

const CustomStatementsToolbar = props => {
  const {
    title,
    handleFilter,
    toggle,
    value,
    addText,
    setPaymentTypeValue,
    paymentTypeValue,
    paymentTypes,
    setPaymentMethodValue,
    paymentMethodValue,
    paymentMethods,
    setStatusValue,
    statusValue,
    statuses,
    searchPlaceholder
  } = props

  const GridToolbarExportStyled = styled(GridToolbarExport)(({ theme }) => ({
    color: theme.palette.text.primary
  }))

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(addDays(new Date(), 15))
  const [startDateRange, setStartDateRange] = useState(new Date())
  const [endDateRange, setEndDateRange] = useState(addDays(new Date(), 45))
  const [dateExclude, setDateExclude] = useState(new Date())

  const handleOnChange = dates => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const CustomInput = forwardRef((props, ref) => {
    const startDate = format(props.start, 'MM/dd/yyyy')
    const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null
    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return <TextField size='small' inputRef={ref} label={props.label || ''} {...props} value={value} />
  })

  const handleOnChangeRange = dates => {
    const [start, end] = dates
    setStartDateRange(start)
    setEndDateRange(end)
  }

  const handleStatusValue = event => {
    setStatusValue(event.target.value)
  }

  const handlePaymentMethodValue = event => {
    setPaymentMethodValue(event.target.value)
  }

  const handlePaymentTypeValue = event => {
    setPaymentTypeValue(event.target.value)
  }

  return (
    <>
      <Box style={{ width: '100%', display: 'flex', justifyContent: 'left', alignItems: 'start' }}>
        <CardHeader title={title} sx={{ '& .MuiCardHeader-action': { m: 0 } }}></CardHeader>
      </Box>

      <Box
        sx={{
          py: 4,
          px: 6,
          rowGap: 2,
          columnGap: 4,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <GridToolbarExport variant='outlined' printOptions={{ disableToolbarButton: true }} />

        <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          {searchPlaceholder ? (
            <>
              <TextField
                size='small'
                value={value}
                sx={{ mr: 4 }}
                placeholder={searchPlaceholder}
                onChange={e => handleFilter(e.target.value)}
              />
            </>
          ) : (
            <></>
          )}

          {addText ? (
            <>
              <Link href={'/finance/invoice/create'}>
                <Button size='small' onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
                  <Icon fontSize='14px' icon='tabler:plus' />
                  {addText}
                </Button>
              </Link>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          gap: 2,
          display: 'flex',
          flexDirection: 'row-reverse',
          flexWrap: 'wrap',
          alignItems: 'center',
          p: theme => theme.spacing(2, 5, 4, 5)
        }}
      >
        {statuses?.length > 0 ? (
          <>
            <Box>
              <FormControl fullWidth>
                <InputLabel size='small' id='invoice-status-select'>
                  Status
                </InputLabel>

                <Select
                  fullWidth
                  value={statusValue}
                  sx={{ mr: 4 }}
                  size='small'
                  label='Invoice Status'
                  onChange={handleStatusValue}
                  labelId='invoice-status-select'
                >
                  {statuses?.map((status, index) => {
                    return <MenuItem value={status?.value}>{status?.text}</MenuItem>
                  })}
                </Select>
              </FormControl>{' '}
            </Box>
          </>
        ) : (
          <></>
        )}

        {paymentMethods?.length > 0 ? (
          <>
            <Box>
              <FormControl fullWidth>
                <InputLabel size='small' id='invoice-status-select'>
                  Payment Method
                </InputLabel>

                <Select
                  fullWidth
                  value={paymentMethodValue}
                  sx={{ mr: 4 }}
                  size='small'
                  label='Invoice Status'
                  onChange={handlePaymentMethodValue}
                  labelId='invoice-status-select'
                >
                  {paymentMethods?.map((method, index) => {
                    return <MenuItem value={method?.value}>{method?.text}</MenuItem>
                  })}
                </Select>
              </FormControl>{' '}
            </Box>
          </>
        ) : (
          <></>
        )}

        {paymentTypes?.length > 0 ? (
          <>
            <Box>
              <FormControl fullWidth>
                <InputLabel size='small' id='invoice-status-select'>
                  Payment Type
                </InputLabel>

                <Select
                  fullWidth
                  value={paymentTypeValue}
                  sx={{ mr: 4 }}
                  size='small'
                  label='Invoice Status'
                  onChange={handlePaymentTypeValue}
                  labelId='invoice-status-select'
                >
                  {paymentTypes?.map((type, index) => {
                    return <MenuItem value={type?.value}>{type?.text}</MenuItem>
                  })}
                </Select>
              </FormControl>{' '}
            </Box>
          </>
        ) : (
          <></>
        )}
        {/* <Box display={'flex'}>
          <>
            <DatePickerWrapper>
              <DatePicker
                selectsRange
                monthsShown={2}
                endDate={endDateRange}
                selected={startDateRange}
                // excludeDates={[subDays(new Date(), 1), subDays(new Date(), 2)]}
                startDate={startDateRange}
                shouldCloseOnSelect={false}
                id='date-range-picker-months'
                onChange={handleOnChangeRange}
                customInput={<CustomInput label='Choose date range' end={endDateRange} start={startDateRange} />}
              />
            </DatePickerWrapper>
          </>
        </Box> */}
        {/* <Box>
          <Typography variant='subtitle'>Filter By: </Typography>
        </Box> */}
        {/* <Box>
          <FormControl fullWidth>
            <InputLabel size='small' id='invoice-status-select'>
              Invoice Status
            </InputLabel>

            <Select
              fullWidth
              value={statusValue}
              sx={{ mr: 4 }}
              size='small'
              label='Invoice Status'
              onChange={handleStatusValue}
              labelId='invoice-status-select'
            >
              <MenuItem value=''>none</MenuItem>
              <MenuItem value='downloaded'>Downloaded</MenuItem>
              <MenuItem value='draft'>Draft</MenuItem>
              <MenuItem value='paid'>Paid</MenuItem>
              <MenuItem value='partial payment'>Partial Payment</MenuItem>
              <MenuItem value='past due'>Past Due</MenuItem>
              <MenuItem value='sent'>Sent</MenuItem>
            </Select>
          </FormControl>{' '}
        </Box> */}
      </Box>
    </>
  )
}

export default CustomStatementsToolbar
