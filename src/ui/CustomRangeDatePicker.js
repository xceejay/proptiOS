import { Grid, TextField } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import subDays from 'date-fns/subDays'
import { useState, useCallback, forwardRef } from 'react'

const CustomRangeDatePicker = ({ handleOnChangeRange, startDateRange, endDateRange }) => {
  const CustomInput = forwardRef((props, ref) => {
    const startDate = props.start ? format(props.start, 'MM/dd/yyyy') : ''
    const endDate = props.end ? ` - ${format(props.end, 'MM/dd/yyyy')}` : ''
    const value = `${startDate}${endDate}`

    return <TextField size='small' fullWidth inputRef={ref} label={props.label || ''} {...props} value={value} />
  })

  return (
    <>
      <DatePickerWrapper>
        <DatePicker
          selectsRange
          monthsShown={2}
          endDate={endDateRange}
          selected={startDateRange}
          startDate={startDateRange}
          shouldCloseOnSelect={false}
          id='date-range-picker-months'
          onChange={handleOnChangeRange}
          customInput={<CustomInput label='Select period' end={endDateRange} start={startDateRange} />}
        />
      </DatePickerWrapper>
    </>
  )
}

export default CustomRangeDatePicker
