// ** Demo Components Imports
import Edit from 'src/views/apps/lease/edit/Edit'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const LeaseEdit = () => {
  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Edit id='4987' />
    </DatePickerWrapper>
  )
}

export default LeaseEdit
