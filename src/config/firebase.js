// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import {getStorage} from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyBHE5112sZlMyH6vBlWx32kmNGStr1jb6k",
  authDomain: "ratemyuni-81275.firebaseapp.com",
  projectId: "ratemyuni-81275",
  storageBucket: "ratemyuni-81275.appspot.com",
  messagingSenderId: "853982234003",
  appId: "1:853982234003:web:1fbfc8926e23c8e8a91466",
  measurementId: "G-XP6ZP963VJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);
export const storage = getStorage(app);