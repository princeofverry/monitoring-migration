import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABh_s0r9-GqaadGaZWvo0BKZufFcPxvkQ",
  authDomain: "ardutofirebase.firebaseapp.com",
  databaseURL:
    "https://ardutofirebase-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ardutofirebase",
  storageBucket: "ardutofirebase.appspot.com",
  messagingSenderId: "785999642428",
  appId: "1:785999642428:web:be55985df216068425a839",
  measurementId: "G-CE2YTNTFQ2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
// Initialize Firestore
export const db = getDatabase(app);
