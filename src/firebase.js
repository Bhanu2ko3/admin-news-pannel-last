import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyB9SmQo5oEFibcqs-JNDE0NjUS-b7o7yf8",
  authDomain: "news-reporting-app-4d009.firebaseapp.com",
  databaseURL: "https://news-reporting-app-4d009-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "news-reporting-app-4d009",
  storageBucket: "news-reporting-app-4d009.firebasestorage.app",
  messagingSenderId: "192509468615",
  appId: "1:192509468615:web:7d39eca79820786a0343e2",
  measurementId: "G-8RW50C2SEC"
};


const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Export Firebase Storage

