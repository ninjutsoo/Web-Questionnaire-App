import { initializeApp } from "firebase/app";
import {
  getAuth,
  sendPasswordResetEmail,
  updatePassword,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  getDoc,
  updateDoc
} from "firebase/firestore";

// Firebase config should come from environment variables for security
// NEVER commit your keys to source control. Use .env and .gitignore.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export { sendPasswordResetEmail, updatePassword, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile };
export { collection, getDocs, doc, getDoc, setDoc, updateDoc };

// Firestore helper: check if a field value is unique (returns true if no existing doc)
export async function isUnique(field, value) {
  const q = query(collection(db, "Users"), where(field, "==", value));
  const snap = await getDocs(q);
  return snap.empty;
}

// Firestore helper: get email by username or phone (returns null if not found)
export async function getEmailByField(field, value) {
  const q = query(collection(db, "Users"), where(field, "==", value));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data().email;
}
