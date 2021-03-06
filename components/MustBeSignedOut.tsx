import useToggler from '@root/hooks/useToggler'
import firebase from 'firebase/app'
import 'firebase/auth'
import router from 'next/router'
import { FC, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import LoadingPage from './LoadingPage'

const MustBeSignedOut: FC = ({ children }) => {
  const [isRedirecting, startRedirect] = useToggler(false)
  const [user, loading] = useAuthState(firebase.auth()) as [
    firebase.User,
    boolean,
    firebase.auth.Error
  ]

  useEffect(() => {
    if (user) {
      startRedirect()
      router.replace('/')
    }
  }, [user])

  return loading ? (
    <LoadingPage />
  ) : isRedirecting ? (
    <LoadingPage>Redirecting...</LoadingPage>
  ) : (
    <>{children}</>
  )
}

export default MustBeSignedOut
