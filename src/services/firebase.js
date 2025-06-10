import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyApmb-GGI3K4kR52uR6BbBCFnCaouneueE",
//   authDomain: "web-questionnaire-app.firebaseapp.com",
//   projectId: "web-questionnaire-app",
//   storageBucket: "web-questionnaire-app.firebasestorage.app",
//   messagingSenderId: "791650373498",
//   appId: "1:791650373498:web:bda484f54c3a908da390c3"
// };

const firebaseConfig = {
  apiKey: "AIzaSyCDy3nyxxCGGhj7jOpv4XrIZWqbqTsqis4",
  authDomain: "web-app-new-efb66.firebaseapp.com",
  projectId: "web-app-new-efb66",
  storageBucket: "web-app-new-efb66.firebasestorage.app",
  messagingSenderId: "699118860544",
  appId: "1:699118860544:web:516f76ad2bbdad31115be5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

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
