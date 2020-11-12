import { TextField, TextFieldProps } from '@material-ui/core'

export default function PasswordInput(props: TextFieldProps) {
  return <TextField type='password' placeholder='Password' {...props} />
}
