import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB6H2L5ui_myWD_6RrWcXZNXN-7qyqvWK8",
  authDomain: "logicleap-5cacc.firebaseapp.com",
  projectId: "logicleap-5cacc",
  storageBucket: "logicleap-5cacc.firebasestorage.app",
  messagingSenderId: "743297246824",
  appId: "1:743297246824:web:71ffa80989bf0609f67ddd",
  measurementId: "G-1C19S4JE2W",
};

const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
