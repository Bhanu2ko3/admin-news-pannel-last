import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database"; // Import Firebase Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyAYknoaQMpUBUN06FWsF8CeJqzmOreVugU",
  authDomain: "news-admin-de1af.firebaseapp.com",
  projectId: "news-admin-de1af",
  storageBucket: "news-admin-de1af.appspot.com", // Fix incorrect storage bucket URL
  messagingSenderId: "771782936033",
  appId: "1:771782936033:web:aaec810f95f41759b8bea0",
  measurementId: "G-46LPDQ2K0V",
  databaseURL: "https://news-admin-de1af-default-rtdb.firebaseio.com/", // Add databaseURL
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const database = getDatabase(app); // Export Firebase Realtime Database
