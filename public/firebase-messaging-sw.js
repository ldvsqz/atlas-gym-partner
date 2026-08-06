importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyClgcMOlZg5OeL2Cjwg1s0zYaDMS8m1OZg",
  authDomain: "atlas-gym-partner.firebaseapp.com",
  projectId: "atlas-gym-partner",
  storageBucket: "atlas-gym-partner.firebasestorage.app",
  messagingSenderId: "91174508336",
  appId: "1:91174508336:web:f8630c647aec27abf79af5"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message received: ', payload);
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Atlas Gym Partner';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'Tienes un nuevo aviso de membresía.',
    icon: '/atlas.ico',
    badge: '/atlas.ico',
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
