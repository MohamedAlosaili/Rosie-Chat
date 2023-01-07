import { useState } from "react";

import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";

import { auth } from "rosie-firebase";
import { Input, StatusMessage, Button } from "components";
import Authentication from "./Authentication";

function SignIn({ selectedTap, setSelectedTap }) {
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
      <StatusMessage
        message="Signing in..."
        type="loading"
        active={signInLoading}
      />
      <StatusMessage
        message={signInError?.code}
        type="error"
        active={signInError !== undefined}
      />
      <Authentication
        title="Sign in."
        greeting={
          <span>
            Welcome back! 👋 <br /> Please enter your details.
          </span>
        }
        selectedTap={selectedTap}
        setSelectedTap={setSelectedTap}
      >
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
      </Authentication>
    </>
  );
}

export default SignIn;
