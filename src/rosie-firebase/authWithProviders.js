import { auth } from ".";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";

export async function signWithProviders(providerType = "google") {
  const windowWidth = window.innerWidth;

  const providers = {
    google: new GoogleAuthProvider(),
  };

  const provider = providers[providerType];
  console.log(windowWidth);
  const signMethod = windowWidth <= 768 ? signInWithRedirect : signInWithPopup;
  try {
    await signMethod(auth, provider);
  } catch (error) {
    return { type: "error", ...error };
  }
}
