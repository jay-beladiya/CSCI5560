// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // if you use authentication

const firebaseConfig = {
    apiKey: "AIzaSyCqhd-o_u2hO-KM0rV6iwo8e4DL7eYl8UQ",
  authDomain: "bloodnation-33e53.firebaseapp.com",
  projectId: "bloodnation-33e53",
  storageBucket: "bloodnation-33e53.firebasestorage.app",
  messagingSenderId: "325952426303",
  appId: "1:325952426303:web:b41d567d169092cdcd038a",
  measurementId: "G-PSRGRNMCPM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore and Auth instances
const db = getFirestore(app);
const auth = getAuth(app); // optional, only if you're using auth

export { db, auth };
