import { useState } from "react";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

import useError from "hooks/useError";
import photoURL from "imgs/default-avatar.png";
import { auth } from "rosie-firebase";

function useSignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useError();

  async function signUserUp(signUpValue) {
    setLoading(true);
    setError(undefined);

    const { name: displayName, password, email } = signUpValue;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, { displayName, photoURL });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error?.code ?? error?.message ?? error);
    }
  }

  return [signUserUp, loading, error];
}

export default useSignUp;
