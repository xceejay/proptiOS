import { MuiFileInput } from 'mui-file-input'
import { useState } from 'react'

const RegisterFileUploader = ({ field, file, setFile, fieldState }) => {
  const [errorText, setErrorText] = useState('')

  const handleChange = newFile => {
    const fileSizeLimit = 20 * 1024 * 1024 // 5MB limit

    if (newFile && newFile.size > fileSizeLimit) {
      setErrorText('File size exceeds 20MB')
      setFile(null) // or handle it as needed
    } else {
      setErrorText('')
      setFile(newFile)
    }

    console.log('new file', newFile)
  }

  return (
    <MuiFileInput
      {...field}
      helperText={errorText || (fieldState.invalid ? 'File is invalid' : '')}
      error={!!errorText || fieldState.invalid}
      value={file}
      onChange={handleChange}
    />
  )
}

export default RegisterFileUploader
