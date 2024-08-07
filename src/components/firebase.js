// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_KEY,
  authDomain: "pan-details.firebaseapp.com",
  projectId: "pan-details",
  storageBucket: "pan-details.appspot.com",
  messagingSenderId: "585024920586",
  appId: "1:585024920586:web:2a0b2c0529cfb1343e13f3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
