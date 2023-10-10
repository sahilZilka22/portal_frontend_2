// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC74A2GRtn2ic1koYfgSVqkCR_WokNy-ew",
  authDomain: "dooperportal.firebaseapp.com",
  projectId: "dooperportal",
  storageBucket: "dooperportal.appspot.com",
  messagingSenderId: "745159791982",
  appId: "1:745159791982:web:76bdb1c6c9b31b153c5d7f",
  measurementId: "G-D8SF6PLLFS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
// npm i otp-input-react react-phone-input-2
