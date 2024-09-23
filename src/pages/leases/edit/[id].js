// ** Third Party Imports
import axios from 'axios'

// ** Demo Components Imports
import Edit from 'src/views/apps/lease/edit/Edit'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const LeaseEdit = ({ id }) => {
  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Edit id={id} />
    </DatePickerWrapper>
  )
}

export default LeaseEdit
