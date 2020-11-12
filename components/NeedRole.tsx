import { useAuthState } from 'react-firebase-hooks/auth'
import { FC, useEffect } from 'react'
import useToggler from '@root/hooks/useToggler'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import router from 'next/router'
import LoadingPage from './LoadingPage'
import { Role, User } from '@root/data/types'

const NeedRole: FC<{ role: Role }> = ({ children, role }) => {
  const [isRedirecting, startRedirect] = useToggler(false)
  const [isLoadingRole, startLoadingRole, stopLoadingRole] = useToggler()
  const [user, loading] = useAuthState(firebase.auth()) as [
    firebase.User,
    boolean,
    firebase.auth.Error
  ]

  async function checkRole(user: firebase.User) {
    const userDoc = await firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .get()

    const userData = userDoc.data() as User
    stopLoadingRole()

    if (userData.role !== role) {
      startRedirect()
      router.replace('/')
    }
  }

  useEffect(() => {
    if (!user && !loading) {
      startRedirect()
      router.replace('/login')
    } else if (user) {
      startLoadingRole()
      checkRole(user)
    }
  }, [user, loading])

  return loading ? (
    <LoadingPage />
  ) : isLoadingRole ? (
    <LoadingPage>Getting user role...</LoadingPage>
  ) : isRedirecting ? (
    <LoadingPage>Redirecting...</LoadingPage>
  ) : (
    <>{children}</>
  )
}

export default NeedRole
