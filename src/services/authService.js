// src/services/authService.js

import { auth, googleProvider, db, isUnique } from "./firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
let _currentUser = null;

export function getCurrentUser() {
  return _currentUser;
}

/**
 * Signs up a user via Google Popup.
 * - Checks email uniqueness (in Firestore) first.
 * - If unique, writes a minimal Firestore profile under Users/{uid}.
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export async function signUpWithGoogle() {
  try {
    // 1. Open Google popup
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // 2. Check Firestore uniqueness for email
    const emailOK = await isUnique("email", user.email);
    if (!emailOK) {
      // If that email already exists in Firestore, immediately sign out from Auth
      await signOut(auth);
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    // 3. Write to Firestore (Users/{uid})
    //    We store firstName/lastName if available, else blank
    const displayName = user.displayName || "";
    const [firstName = "", ...rest] = displayName.split(" ");
    const lastName = rest.join(" ") || "";

    await setDoc(doc(db, "Users", user.uid), {
      firstName,
      lastName,
      email: user.email,
      phone: user.phoneNumber || "",
      username: "", // let them fill-in later if needed
      age: "",
      caregiverEmail: "",
      createdAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Google sign-up error:", error);
    return {
      success: false,
      message: error.message || "Google sign-up failed.",
    };
  }
}


/**
 * Signs up a user with email/password + Firestore profile.
 * 1) Validates that username/email/phone are each unique.
 * 2) Calls createUserWithEmailAndPassword(auth, email, password).
 * 3) Updates Auth profile to include displayName.
 * 4) Saves a document under Users/{uid} with all profile fields.

 * @param {Object} data
 * @param {string} data.firstName
 * @param {string} data.lastName
 * @param {string} data.email
 * @param {string} data.phone
 * @param {string} data.username
 * @param {string} data.age
 * @param {string} data.caregiverEmail
 * @param {string} data.password
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export async function signUpWithEmail({
  firstName,
  lastName,
  // gender,
  email,
  phone,
  username,
  age,
  caregiverEmail,
  password,
}) {
  try {
    // 1) Check uniqueness of username, email, phone in parallel
    const [usernameOK, emailOK, phoneOK] = await Promise.all([
      isUnique("username", username),
      isUnique("email", email),
      isUnique("phone", phone),
    ]);
    if (!usernameOK) {
      return { success: false, message: "Username is already taken." };
    }
    if (!emailOK) {
      return {
        success: false,
        message: "Email address is already registered.",
      };
    }
    if (!phoneOK) {
      return { success: false, message: "Phone number is already registered." };
    }

    // 2) Create Auth account
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCred.user;

    // 3) Update Auth displayName
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    // 4) Save full profile into Firestore under Users/{uid}
    await setDoc(doc(db, "Users", user.uid), {
      firstName,
      lastName,
      email,
      phone,
      username,
      age: age || "",
      caregiverEmail: caregiverEmail || "",
      createdAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Email sign-up error:", error);
    return { success: false, message: error.message || "Sign-up failed." };
  }
}




/**
 * signInWithEmail({ email, password })
 *   Signs in via Firebase Auth’s email+password. If successful, also
 *   fetches the Firestore “Users” document for that UID (to get firstName, lastName, username, phone, etc.)
 *   and stores the combined info in `_currentUser`.
 * 
 *   Returns { success: true, user: <fullObject> } or { success: false, message: <error> }.
 */
export async function signInWithEmail({ email, password }) {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    // fetch “Users/{uid}” doc from Firestore
    const userDocRef = doc(db, "Users", uid);
    const userSnapshot = await getDoc(userDocRef);

    if (!userSnapshot.exists()) {
      // If no Firestore profile was found, we still set _currentUser minimally:
      _currentUser = {
        uid,
        email: userCred.user.email,
        // stop here if no Firestore profile
      };
      return { success: true, user: _currentUser };
    }

    const userData = userSnapshot.data();
    _currentUser = {
      uid,
      email: userCred.user.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      username: userData.username,
      age: userData.age || "",
      caregiverEmail: userData.caregiverEmail || "",
      createdAt: userData.createdAt?.toDate?.() || null,
      // …spread any other Firestore fields
    };

    return { success: true, user: _currentUser };
  } catch (err) {
    console.error("Email sign-in error:", err);
    return { success: false, message: err.message };
  }
}


/**
 * signInWithUsername({ username, password })
 *   Since Firebase Auth doesn’t natively let you “sign in with username,”
 *   we do this:
 *     1) query Firestore’s “Users” collection where “username” == the provided username.
 *     2) If exactly one match, pull out that user’s email, then call
 *        signInWithEmailAndPassword(email, password). Otherwise error out.
 * 
 *   Returns { success: true, user: <fullObject> } or { success: false, message: <error> }.
 */
export async function signInWithUsername({ username, password }) {
  try {
    // 1) look up the Firestore Users collection for that username
    const usersCol = collection(db, "Users");
    const q = query(usersCol, where("username", "==", username));
    const querySnap = await getDocs(q);

    if (querySnap.empty) {
      return { success: false, message: "No account found for that username." };
    }
    if (querySnap.size > 1) {
      // unlikely if you enforce uniqueness on signup, but just in case:
      console.warn(`Warning: multiple accounts share username="${username}"`);
    }

    // Grab the first match’s email + UID
    const docSnap = querySnap.docs[0];
    const data = docSnap.data();
    const email = data.email;
    const uid = docSnap.id;

    // 2) Now attempt to sign in with that email + provided password
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    // 3) If success, reconstruct the "_currentUser" exactly as above:
    _currentUser = {
      uid,
      email: userCred.user.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      username: data.username,
      age: data.age || "",
      caregiverEmail: data.caregiverEmail || "",
      createdAt: data.createdAt?.toDate?.() || null,
      // …any other Firestore fields…
    };

    return { success: true, user: _currentUser };
  } catch (err) {
    console.error("Username sign-in error:", err);
    return { success: false, message: err.message };
  }
}


/**
 * watchAuthState(onChange)
 *   A helper to register a listener if you want to know whenever Firebase Auth’s
 *   internal state changes (e.g. page reload, someone manually signed-in elsewhere). 
 *   We’ll still need to rehydrate Firestore data in that callback. 
 *
 *   Usage: 
 *     watchAuthState(async (firebaseUser) => {
 *       if (firebaseUser) { …fetch Firestore doc and set _currentUser… }
 *       else { _currentUser = null; }
 *     });
 */
export function watchAuthState(onChange) {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      _currentUser = null;
      onChange(null);
    } else {
      // pull Firestore profile:
      try {
        const docSnap = await getDoc(doc(db, "Users", fbUser.uid));
        if (docSnap.exists()) {
          const d = docSnap.data();
          _currentUser = {
            uid: fbUser.uid,
            email: fbUser.email,
            firstName: d.firstName,
            lastName: d.lastName,
            phone: d.phone,
            username: d.username,
            age: d.age || "",
            caregiverEmail: d.caregiverEmail || "",
            createdAt: d.createdAt?.toDate?.() || null,
            // …etc
          };
        } else {
          _currentUser = { uid: fbUser.uid, email: fbUser.email };
        }
        onChange(_currentUser);
      } catch (err) {
        console.error("watchAuthState: firestore fetch failed:", err);
        _currentUser = { uid: fbUser.uid, email: fbUser.email };
        onChange(_currentUser);
      }
    }
  });
}

/**
 * signOutUser()
 *   Call firebaseAuth.signOut(), then clear _currentUser.
 */
export async function signOutUser() {
  await auth.signOut();
  _currentUser = null;
}

/**
 * Sends a password reset email to the given email address using Firebase Auth.
 * @param {string} email
 * @returns {Promise<{ success: boolean, message?: string }>}
 */
export async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}