import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

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

export { auth, db, collection, storage, ref, useAuthState, useCollectionData };
