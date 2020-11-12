import { Backdrop, BackdropProps, CircularProgress } from '@material-ui/core'
import utils from '@root/styles/utils.module.css'

export default function LoadingBackdrop(props: BackdropProps) {
  return (
    <Backdrop className={utils.lolz} {...props}>
      <CircularProgress />
    </Backdrop>
  )
}
