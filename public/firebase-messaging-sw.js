
// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
const firebaseConfig = {
    apiKey: "AIzaSyAfsfCflALMh-zbq4dh9jUAu4d3-kLUVTg",
    authDomain: "senku-loyalty.firebaseapp.com",
    projectId: "senku-loyalty",
    storageBucket: "senku-loyalty.appspot.com",
    messagingSenderId: "397386576935",
    appId: "1:397386576935:web:ddcafaae08a10fe63d8a02"
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
