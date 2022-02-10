import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA8YRIZlAFhBebG08bemL6ybp2MMNaRktk",
  authDomain: "kliks-1ce5a.firebaseapp.com",
  projectId: "kliks-1ce5a",
  storageBucket: "kliks-1ce5a.appspot.com",
  messagingSenderId: "368147036405",
  appId: "1:368147036405:web:b1725e9c96b20ea7786dbc",
  measurementId: "G-FV0Z6FJJTF"
}; 

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

console.log("CONFIGURED FIREBASE");

export { auth, firebase, db }
