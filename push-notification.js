// Your web app's Firebase configuration
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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// [START get_messaging_object]
// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();
// [END get_messaging_object]
// [START set_public_vapid_key]
// Add the public key generated from the console here.
messaging.usePublicVapidKey('BKqpa-m7GUPVLteUIOxbCqYKLZMqSkSYli9wlcZHrmzVKtHgebFjSl-E5QskBP-MbYU-QoWy4Mwn04Mv6d1pIPs');
// [END set_public_vapid_key]

messaging
    .requestPermission()
    .then(function() {
        console.log("Notification permission granted.");

        // get the token in the form of promise
        return messaging.getToken();
    })
    .then(function(token) {
        console.log("token is : " + token);

        /*
        fetch("https://fcm.googleapis.com/fcm/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "key=" + "AAAA-oo5-UA:APA91bHW97cZqUOdd4EETRyjwUk_yo0IqIxCjHGuN5Xol2odNGuLOJknQRvtI4DgNIf0-O46Lozy0xgmJ62uIhgAcoAxuUOdjxR6nK7QpPnyFjJU7VlKD959fKav9Z4vW8m1GtfCjjmS"
            },
            body: JSON.stringify(
                {
                    "data": {
                        "notification": {
                            "title": "Cryptosearch",
                            "body": "Bienvenido!",
                        }
                    },
                    "to": token
                }
            )
        }).then(res => {
            console.log("Request complete! response:", res);
        });
        */

    })
    .catch(function(err) {
        console.log("Unable to get permission to notify.", err);
    });

messaging.onMessage(function(payload) {
    console.log("Message received. ", payload);
    console.log(JSON.stringify(payload));
    //kenng - foreground notifications
    const { title, ...options } = payload.notification;
    navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, options);
    });
});

// IDs of divs that display Instance ID token UI or request permission UI.
const tokenDivId = 'token_div';
const permissionDivId = 'permission_div';

// [START refresh_token]
// Callback fired if Instance ID token is updated.
messaging.onTokenRefresh(() => {
    messaging.getToken().then((refreshedToken) => {
        console.log('Token refreshed.');
        // Indicate that the new Instance ID token has not yet been sent to the
        // app server.
        setTokenSentToServer(false);
        // Send Instance ID token to app server.
        sendTokenToServer(refreshedToken);
        // [START_EXCLUDE]
        // Display new Instance ID token and clear UI of all previous messages.
        resetUI();
        // [END_EXCLUDE]
    }).catch((err) => {
        console.log('Unable to retrieve refreshed token ', err);
        showToken('Unable to retrieve refreshed token ', err);
    });
});