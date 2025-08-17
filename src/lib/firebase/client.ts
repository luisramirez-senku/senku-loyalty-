
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "senku-loyalty",
  "appId": "1:397386576935:web:ddcafaae08a10fe63d8a02",
  "storageBucket": "senku-loyalty.firebasestorage.app",
  "apiKey": "AIzaSyAfsfCflALMh-zbq4dh9jUAu4d3-kLUVTg",
  "authDomain": "senku-loyalty.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "397386576935"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
