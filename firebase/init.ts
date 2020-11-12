import firebase from 'firebase/app'

if (!firebase.apps.length)
  firebase.initializeApp({
    apiKey: 'AIzaSyBK9ty-Ew9pRZ0G7zmal-zREbacuKgJC3c',
    authDomain: 'point-of-sales-pts.firebaseapp.com',
    databaseURL: 'https://point-of-sales-pts.firebaseio.com',
    projectId: 'point-of-sales-pts',
    storageBucket: 'point-of-sales-pts.appspot.com',
    messagingSenderId: '611913690529',
    appId: '1:611913690529:web:2cd3966728f53071436fe0',
    measurementId: 'G-V0E6EG8MVM',
  })
