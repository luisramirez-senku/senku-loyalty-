// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
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
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload
    );
    // Customize notification here
    const notificationTitle = "Background Message Title";
    const notificationOptions = {
        body: "Background Message body.",
        icon: "/firebase-logo.png",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});