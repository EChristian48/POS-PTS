import { TextField, TextFieldProps } from '@material-ui/core'

export default function EmailInput(props: TextFieldProps) {
  return <TextField type='email' placeholder='E-Mail' {...props} />
}
