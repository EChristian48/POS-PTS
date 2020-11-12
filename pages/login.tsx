import { Button, Grid, Typography } from '@material-ui/core'
import EmailInput from '@root/components/EmailInput'
import LoadingBackdrop from '@root/components/LoadingBackdrop'
import MustBeSignedOut from '@root/components/MustBeSignedOut'
import PasswordInput from '@root/components/PasswordInput'
import Toast from '@root/components/Toast'
import useControlledInput from '@root/hooks/useControlledInput'
import useLoading from '@root/hooks/useLoading'
import useToggler from '@root/hooks/useToggler'
import classes from '@root/styles/Login.module.css'
import utils from '@root/styles/utils.module.css'
import firebase from 'firebase/app'
import 'firebase/auth'
import { NextPage } from 'next'
import { FormEvent, useState } from 'react'

const Login: NextPage = () => {
  const [isToastOpen, openToast, closeToast] = useToggler(false)
  const { isLoading, startLoading, stopLoading } = useLoading()

  const [emailValue, emailHandler] = useControlledInput()
  const [passValue, passHandler] = useControlledInput()

  const [errorMsg, setErrorMsg] = useState('')

  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    startLoading()

    try {
      await firebase.auth().signInWithEmailAndPassword(emailValue, passValue)
    } catch (e) {
      setErrorMsg((e as firebase.auth.AuthError).message)
      openToast()
    } finally {
      stopLoading()
    }
  }

  return (
    <MustBeSignedOut>
      <LoadingBackdrop open={isLoading} />

      <Toast onClose={closeToast} open={isToastOpen} severity='error'>
        {errorMsg}
      </Toast>

      <Grid
        container
        className={classes.loginPage}
        justify='center'
        alignItems='center'
      >
        <form className={classes.loginForm} onSubmit={login}>
          <Typography variant='h3' className={classes.heading}>
            Login
          </Typography>
          <EmailInput
            variant='outlined'
            size='small'
            className={utils.marginBot2}
            required
            value={emailValue}
            onChange={emailHandler}
          />
          <PasswordInput
            variant='outlined'
            size='small'
            className={utils.marginBot2}
            required
            value={passValue}
            onChange={passHandler}
          />

          <Button variant='contained' type='submit'>
            Login
          </Button>
        </form>
      </Grid>
    </MustBeSignedOut>
  )
}

export default Login
