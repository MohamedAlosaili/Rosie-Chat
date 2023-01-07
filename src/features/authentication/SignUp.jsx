import { useEffect, useState } from "react";

import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

import { auth } from "rosie-firebase";
import { Input, StatusMessage, Button } from "components";
import Check from "./Check";

function usePasswordStrength(password, confirmPassword) {
  const [passwordStrength, setPasswordStrength] = useState({
    lowercase: false,
    uppercase: false,
    specialCharacter: false,
    number: false,
    eightCharacters: false,
  });
  const [isPasswordMatched, setIsPasswordMatched] = useState(false);

  useEffect(() => {
    const passwordReqex = {
      lowercase: /[a-z]+/g,
      uppercase: /[A-Z]+/g,
      specialCharacter: /\W+/g,
      number: /\d+/g,
    };

    const matches = {
      lowercase: passwordReqex.lowercase.test(password),
      uppercase: passwordReqex.uppercase.test(password),
      specialCharacter: passwordReqex.specialCharacter.test(password),
      number: passwordReqex.number.test(password),
      eightCharacters: password.length >= 8,
    };

    setPasswordStrength(matches);
  }, [password]);

  useEffect(() => {
    if (password !== "") setIsPasswordMatched(password === confirmPassword);
  }, [confirmPassword, password]);

  return [passwordStrength, isPasswordMatched];
}

function SignUp() {
  const [signUpValue, setSignUpValue] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [createUserWithEmailAndPassword, user, singUpLoading, signUpError] =
    useCreateUserWithEmailAndPassword(auth);
  const [submitForm, setSubmitForm] = useState(false);

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

  async function signUserIn(e) {
    e.preventDefault();
    setSubmitForm(true);
    const { name, email, password } = signUpValue;
    if (isEmailValid && isPasswordValid && isPasswordMatched) {
      try {
        await createUserWithEmailAndPassword(email, password);

        sessionStorage.setItem("user-info", JSON.stringify({ name, email }));
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <>
      <StatusMessage
        message="Creating account..."
        type="loading"
        active={singUpLoading}
      />
      <StatusMessage
        message={signUpError?.code}
        type="error"
        active={signUpError !== undefined}
      />
      <form onSubmit={signUserIn} className="flex flex-col gap-6">
        <Input
          label="Name"
          type="text"
          name="name"
          id="name"
          value={signUpValue.name}
          setValue={setSignUpValue}
          placeholder="Your name"
          required={true}
        />
        <Input
          label="Email"
          type="email"
          name="email"
          id="email"
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
            id="password"
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
            id="confirmPassword"
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
        <Button disabled={singUpLoading}>
          {singUpLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </>
  );
}

export default SignUp;
