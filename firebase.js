// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, get, child } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJqW9Bgb0KlN3Vnt8A4cqLVH0z4VBLfdE",
  authDomain: "bj-teacher.firebaseapp.com",
  databaseURL: "https://bj-teacher-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bj-teacher",
  storageBucket: "bj-teacher.appspot.com",
  messagingSenderId: "797110298129",
  appId: "1:797110298129:web:d71acb133449f63aafb3b0",
  measurementId: "G-HZSZGCLVG0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = getAnalytics(app);

export { db, ref, set, get, child };
