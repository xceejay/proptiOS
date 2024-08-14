import { MuiFileInput } from 'mui-file-input'

const RegisterFileUploader = ({ field, file, setFile, fieldState }) => {
  const handleChange = newFile => {
    console.log('new file', newFile)
    setFile(newFile)
  }

  return (
    <MuiFileInput
      {...field}
      helperText={fieldState.invalid ? 'File is invalid' : ''}
      error={fieldState.invalid}
      value={file}
      onChange={handleChange}
    />
  )
}

export default RegisterFileUploader
