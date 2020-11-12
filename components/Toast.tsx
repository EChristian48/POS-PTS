import { Snackbar } from '@material-ui/core'
import { Alert, AlertProps } from '@material-ui/lab'
import { FC } from 'react'

export type ToastProps = {
  open: boolean
  onClose: () => void
} & Pick<AlertProps, 'severity'>

const Toast: FC<ToastProps> = ({ open, children, onClose, severity }) => {
  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={onClose}>
      <Alert onClose={onClose} severity={severity}>
        {children}
      </Alert>
    </Snackbar>
  )
}

export default Toast
