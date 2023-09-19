if ("function" === typeof importScripts) {
  importScripts("firebase-app.js");
  importScripts("firebase-messaging.js");
}

const firebaseConfig = {
  apiKey: "AIzaSyAnqwJU3S4AeP8pVpEjPeKUY75SsgxSyOM",
  authDomain: "gestiondealmacenes-3405e.firebaseapp.com",
  projectId: "gestiondealmacenes-3405e",
  storageBucket: "gestiondealmacenes-3405e.appspot.com",
  messagingSenderId: "144402592453",
  appId: "1:144402592453:web:0f4ec6c152ac10f7d0b6ac",
  measurementId: "G-7QFKBTL38M",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

function onBackgroundMessage() {
  messaging.onBackgroundMessage(function (payload) {
    const notificationTitle = payload.data.title;
    const notificationOptions = {
      body: payload.data.body,
      icon: payload.data.icon,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

onBackgroundMessage();
