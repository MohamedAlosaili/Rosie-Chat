import { useState } from "react";

import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

import { Input, StatusMessage, Button } from "components";
import { auth } from "rosie-firebase";

function SignIn() {
  const [signInValue, setSignInValue] = useState({ email: "", password: "" });
  const [signInWithEmailAndPassword, , signInLoading, signInError] =
    useSignInWithEmailAndPassword(auth);

  async function signUserIn(e) {
    e.preventDefault();

    const { email, password } = signInValue;
    if (email && password) await signInWithEmailAndPassword(email, password);
  }

  return (
    <>
      {signInLoading && (
        <StatusMessage message="Signing in..." type="loading" />
      )}
      {signInError && (
        <StatusMessage message={signInError?.code} type="error" />
      )}
      <form onSubmit={signUserIn} className="flex flex-col gap-6">
        <Input
          label="Email"
          type="email"
          name="email"
          id="email"
          value={signInValue.email}
          setValue={setSignInValue}
          placeholder="example@gmail.com"
          required={true}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          id="password"
          value={signInValue.password}
          setValue={setSignInValue}
          placeholder="●●●●●●●●"
          required={true}
        />
        <Button disabled={signInLoading}>
          {signInLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </>
  );
}

export default SignIn;
