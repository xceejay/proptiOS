// ** Third Party Imports
import axios from 'axios'

// ** Demo Components Imports
import Edit from 'src/views/apps/receipt/edit/Edit'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const ReceiptEdit = ({ id }) => {
  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Edit id={id} />
    </DatePickerWrapper>
  )
}

export default ReceiptEdit
