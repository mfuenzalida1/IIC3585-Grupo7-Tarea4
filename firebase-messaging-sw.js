importScripts('https://www.gstatic.com/firebasejs/7.14.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.3/firebase-messaging.js');
// For an optimal experience using Cloud Messaging, also add the Firebase SDK for Analytics.
importScripts('https://www.gstatic.com/firebasejs/7.14.3/firebase-analytics.js');

var firebaseConfig = {
    apiKey: "AIzaSyCiK6T8cIEyqs-dkLzelgtK4y9dIfouGN4",
    authDomain: "disenoappwebt4.firebaseapp.com",
    databaseURL: "https://disenoappwebt4.firebaseio.com",
    projectId: "disenoappwebt4",
    storageBucket: "disenoappwebt4.appspot.com",
    messagingSenderId: "1076060879168",
    appId: "1:1076060879168:web:927d0561c2e88c8f5962a5",
    measurementId: "G-LNKXE9DH4J"
};

// Initialize the Firebase app in the service worker
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    console.log('[firebase-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/itwonders-web-logo.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});