// src/firebase.jsx
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 👈 Import de Storage

const firebaseConfig = {
  apiKey: "AIzaSyB53MzdYML9BONQwbmoEUzYvsHFA_Ecw6o",
  authDomain: "famod-ed5f6.firebaseapp.com",
  projectId: "famod-ed5f6",
  storageBucket: "famod-ed5f6.firebasestorage.app",
  messagingSenderId: "694950490185",
  appId: "1:694950490185:web:ecfb0b6c90b7c4551a4f98",
  measurementId: "G-XKFJ8EQLDZ"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app); // 👈 Export de Storage