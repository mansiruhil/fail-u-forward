import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD5oN53LGDOg3gytU_tpsJyA7iaqJ0DnGs",
  authDomain: "fail-u-forward-e1f2e.firebaseapp.com",
  projectId: "fail-u-forward-e1f2e",
  storageBucket: "fail-u-forward-e1f2e.firebasestorage.app",
  messagingSenderId: "152769623692",
  appId: "1:152769623692:web:1d86e8d97dfa0329d22da9",
  measurementId: "G-CSQEG099H9"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

export { firebaseApp, db, auth };
