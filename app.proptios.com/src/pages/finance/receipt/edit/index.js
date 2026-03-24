// ** Demo Components Imports
import Edit from 'src/views/apps/receipt/edit/Edit'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const ReceiptEdit = () => {
  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Edit id='4987' />
    </DatePickerWrapper>
  )
}

export default ReceiptEdit
