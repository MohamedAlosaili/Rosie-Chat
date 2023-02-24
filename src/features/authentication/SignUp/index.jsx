import { useState } from "react";

import { AnimatePresence } from "framer-motion";

import usePasswordStrength from "./usePasswordStrength";
import useSignUp from "./useSignUp";
import Authentication from "../Authentication";
import Check from "./Check";
import Input from "components/Input";
import StatusMessage from "components/StatusMessage";
import Button from "components/Button";

function SignUp({ selectedTap, setSelectedTap }) {
  const [signUpValue, setSignUpValue] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitForm, setSubmitForm] = useState(false);
  const [signUp, signUpLoading, signUpError] = useSignUp();

  const { password, confirmPassword } = signUpValue;
  const [passwordStrength, isPasswordMatched] = usePasswordStrength(
    password,
    confirmPassword
  );

  const regex = {
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,20}$/g,
  };

  // calling .test() multiple times with the flag g or y will cause different results
  // Read: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test#specifications
  const isEmailValid = regex.email.test(signUpValue.email);
  const isPasswordValid = regex.password.test(signUpValue.password);

  async function signUserUp(e) {
    e.preventDefault();
    setSubmitForm(true);
    if (isEmailValid && isPasswordValid && isPasswordMatched) {
      await signUp(signUpValue);
    }
  }

  return (
    <>
      <AnimatePresence>
        {signUpLoading && (
          <StatusMessage message="Creating account..." type="loading" />
        )}
        {signUpError && <StatusMessage message={signUpError} type="error" />}
      </AnimatePresence>
      <Authentication
        title="Sign up."
        greeting="We are excited ✨ that you will be one of us."
        selectedTap={selectedTap}
        setSelectedTap={setSelectedTap}
      >
        <form onSubmit={signUserUp} className="flex flex-col gap-6">
          <Input
            label="Name"
            type="text"
            name="name"
            disabled={signUpLoading}
            value={signUpValue.name}
            setValue={setSignUpValue}
            placeholder="Your name"
            required={true}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            disabled={signUpLoading}
            value={signUpValue.email}
            setValue={setSignUpValue}
            placeholder="example@gmail.com"
            required={true}
            validateValue={true}
            valid={isEmailValid}
            submitForm={submitForm}
            setSubmitForm={setSubmitForm}
          />
          <div>
            <Input
              label="Password"
              type="password"
              name="password"
              disabled={signUpLoading}
              value={signUpValue.password}
              setValue={setSignUpValue}
              placeholder="●●●●●●●●"
              required={true}
              validateValue={true}
              valid={isPasswordValid}
              submitForm={submitForm}
              setSubmitForm={setSubmitForm}
            />
            <div className="flex flex-wrap">
              <Check
                condition="One lowercase character"
                passed={passwordStrength.lowercase}
              />
              <Check
                condition="One uppercase character"
                passed={passwordStrength.uppercase}
              />
              <Check condition="One number" passed={passwordStrength.number} />
              <Check
                condition="One special character"
                passed={passwordStrength.specialCharacter}
              />
              <Check
                condition="8 characters minimum"
                passed={passwordStrength.eightCharacters}
              />
            </div>
          </div>
          <div>
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              disabled={signUpLoading}
              value={signUpValue.confirmPassword}
              setValue={setSignUpValue}
              placeholder="●●●●●●●●"
              required={true}
              validateValue={true}
              valid={isPasswordMatched}
              submitForm={submitForm}
              setSubmitForm={setSubmitForm}
            />
            <Check condition="Password matched" passed={isPasswordMatched} />
          </div>
          <Button disabled={signUpLoading}>
            {signUpLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Authentication>
    </>
  );
}

export default SignUp;
