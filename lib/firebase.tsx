import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import Auth if needed

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBB7yE5iP38-103sPc3uxQjVSwLgWqPR7g",
  authDomain: "fail-u-forward-b4f39.firebaseapp.com",
  projectId: "fail-u-forward-b4f39",
  storageBucket: "fail-u-forward-b4f39.firebasestorage.app",
  messagingSenderId: "280044895991",
  appId: "1:280044895991:web:c35e0aca6ef4264c985df2",
  measurementId: "G-THEWTCCHGS"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get Firestore and Auth
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// Export Firebase app and services
export { firebaseApp, db, auth };
