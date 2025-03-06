import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { initializeAuth, browserLocalPersistence } from "firebase/auth";
// import { Platform } from "react-native";

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
// export const FIREBASE_AUTH =
//   Platform.OS === "web"
//     ? initializeAuth(FIREBASE_APP, { persistence: browserLocalPersistence })
//     : initializeAuth(FIREBASE_APP);
