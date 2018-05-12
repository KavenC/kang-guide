import * as firebase from 'firebase'
import 'firebase/firestore'

// Initialize Firebase
let config = {
  authDomain: 'kang-guide.kavenc.site',
  databaseURL: 'https://kang-guide.firebaseio.com',
  projectId: 'kang-guide',
  storageBucket: 'kang-guide.appspot.com',
  messagingSenderId: '57157364599 '
}

if (process.env.NODE_ENV === 'development') {
  config.apiKey = process.env.FIREBASE_API_KEY
} else {
  config.apiKey = 'AIzaSyDJMhdsiYlcmO_DT1rOd9_dt9OV7njZaPg'
}

firebase.initializeApp(config)

export const firestore = firebase.firestore()
