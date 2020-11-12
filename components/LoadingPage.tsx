import { CircularProgress, Grid } from '@material-ui/core'
import classes from '@root/styles/Login.module.css'
import utils from '@root/styles/utils.module.css'
import { FC } from 'react'

const LoadingPage: FC = ({ children }) => {
  return (
    <Grid
      container
      className={classes.loginPage}
      justify='center'
      alignItems='center'
      direction='column'
    >
      <CircularProgress className={utils.marginBot4} />
      {children}
    </Grid>
  )
}

export default LoadingPage
