import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import Auth if needed

// Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "1",
  measurementId: ""
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Get Firestore and Auth
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

// Export Firebase app and services
export { firebaseApp, db, auth };
