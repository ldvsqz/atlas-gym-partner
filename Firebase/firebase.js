import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getFunctions } from "firebase/functions"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyClgcMOlZg5OeL2Cjwg1s0zYaDMS8m1OZg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "atlas-gym-partner.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://atlas-gym-partner-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "atlas-gym-partner",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "atlas-gym-partner.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "91174508336",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:91174508336:web:f8630c647aec27abf79af5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const functions = getFunctions(app, 'us-central1')

export {db}
export {app}
export {functions}
