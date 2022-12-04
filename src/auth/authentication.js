import { auth } from "../firebase";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export async function signWithProviders(providerType = "google") {
  const providers = {
    google: new GoogleAuthProvider(),
  };

  const provider = providers[providerType];

  console.log(provider);
  await signInWithPopup(auth, provider);
}

export async function signUserIn(e) {
  e.preventDefault();

  return;
  const { email, password } = { signInValue };
  if (email && password) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log(user);
    } catch (error) {
      console.error(error);
    }
  }
}

export async function signUserUp(e) {
  e.preventDefault();

  const { email, password } = signInValue;
  if (email && password) {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(user);
    } catch (error) {
      console.error(error);
    }
  }
}
