import firebase from 'firebase'
import 'firebase/auth'

export default function gening() {
  firebase.auth().signOut()
  return <div>mbleh</div>
}
