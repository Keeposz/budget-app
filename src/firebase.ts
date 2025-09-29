// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtaqYxKcuPUoIp6cFXN9k9-dKhYGdt9aU",
  authDomain: "budget-app-koppel.firebaseapp.com",
  projectId: "budget-app-koppel",
  storageBucket: "budget-app-koppel.firebasestorage.app",
  messagingSenderId: "365687631993",
  appId: "1:365687631993:web:a6de1172eca92db36424a8",
  measurementId: "G-872T2HDTXE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
getAnalytics(app);

export { db, auth };