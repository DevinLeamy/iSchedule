import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCOs1hNFAARVk96OafUNScbZXxgs36WQ5A",
  authDomain: "w2m2-3cf4d.firebaseapp.com",
  projectId: "w2m2-3cf4d",
  storageBucket: "w2m2-3cf4d.appspot.com",
  messagingSenderId: "32486449323",
  appId: "1:32486449323:web:28d3bf0ffce9d9abeb97ee",
  measurementId: "G-6CHDKJLNJR"
}; 

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

console.log("CONFIGURED FIREBASE");

export { auth, firebase, db }
