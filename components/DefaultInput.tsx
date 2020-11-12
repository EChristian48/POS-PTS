import { TextField, TextFieldProps } from '@material-ui/core'

export default function DefaultInput(props: TextFieldProps) {
  return <TextField type='text' variant='outlined' size='small' {...props} />
}
