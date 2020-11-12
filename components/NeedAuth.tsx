import { useAuthState } from 'react-firebase-hooks/auth'
import { FC, useEffect } from 'react'
import useToggler from '@root/hooks/useToggler'
import firebase from 'firebase/app'
import 'firebase/auth'
import router from 'next/router'
import LoadingPage from './LoadingPage'

const NeedAuth: FC = ({ children }) => {
  const [isRedirecting, startRedirect] = useToggler(false)
  const [user, loading] = useAuthState(firebase.auth()) as [
    firebase.User,
    boolean,
    firebase.auth.Error
  ]

  useEffect(() => {
    if (!user && !loading) {
      startRedirect()
      router.replace('/login')
    }
  }, [user, loading])

  return loading ? (
    <LoadingPage />
  ) : isRedirecting ? (
    <LoadingPage>Redirecting...</LoadingPage>
  ) : (
    <>{children}</>
  )
}

export default NeedAuth
