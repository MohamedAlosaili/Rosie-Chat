import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

import firebaseConfig from "./firebaseConfig";

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage();

export async function signWithProviders(providerType = "google") {
  const windowWidth = window.innerWidth;

  const providers = {
    google: new GoogleAuthProvider(),
  };

  const provider = providers[providerType];
  const signMethod = windowWidth <= 768 ? signInWithRedirect : signInWithPopup;
  try {
    await signMethod(auth, provider);
  } catch (error) {
    return { type: "error", ...error };
  }
}

export { auth, db, storage, ref };
