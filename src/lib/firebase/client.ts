
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDh0aiWWDOBErlDenlyG2dD-n9Vi1GvNBs",
  authDomain: "senku-loyalty-469317.firebaseapp.com",
  projectId: "senku-loyalty-469317",
  storageBucket: "senku-loyalty-469317.firebasestorage.app",
  messagingSenderId: "887126370737",
  appId: "1:887126370737:web:5d58cd0674eec015f43590",
  measurementId: "G-EEQJ2W2TBH"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = () => {
    if (typeof window !== "undefined" && getApps().length > 0) {
        return getMessaging(app);
    }
    return null;
}

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    (window as any).auth = auth;
}

export { app, db, auth, messaging };
