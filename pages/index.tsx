import LoadingPage from '@root/components/LoadingPage'
import { User } from '@root/data/types'
import useToggler from '@root/hooks/useToggler'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import router from 'next/router'
import { FC, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'

const Home: FC = () => {
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

    router.replace(`/${userData.role}`)
  }

  useEffect(() => {
    if (!user && !loading) {
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
  ) : (
    <LoadingPage>Redirecting...</LoadingPage>
  )
}

export default Home
