import { useEffect, useState } from "react";

import { auth } from "../../../firebase";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

import { Input, StatusMessage, Button } from "../../../components";
import Check from "./Check";

function SignUp() {
  const regex = {
    email: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
    password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,20}$/g,
  };

  const [signUpValue, setSignUpValue] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const [passwordStrength, setPasswordStrength] = useState({
    lowercase: false,
    uppercase: false,
    specialCharacter: false,
    number: false,
    eightCharacters: false,
  });
  const [submitForm, setSubmitForm] = useState(false);

  useEffect(() => {
    checkPassword();
  }, [signUpValue.password]);

  function checkPassword() {
    const passwordReqex = {
      lowercase: /[a-z]+/g,
      uppercase: /[A-Z]+/g,
      specialCharacter: /\W+/g,
      number: /\d+/g,
    };

    const matches = {
      lowercase: passwordReqex.lowercase.test(signUpValue.password),
      uppercase: passwordReqex.uppercase.test(signUpValue.password),
      specialCharacter: passwordReqex.specialCharacter.test(
        signUpValue.password
      ),
      number: passwordReqex.number.test(signUpValue.password),
      eightCharacters: signUpValue.password.length >= 8,
    };

    setPasswordStrength(matches);
  }

  async function signUserIn(e) {
    e.preventDefault();
    setSubmitForm(true);
    const { email, password } = signUpValue;

    if (regex["email"].test(email) && regex["password"].test(password))
      await createUserWithEmailAndPassword(email, password);
  }

  return (
    <>
      {loading && (
        <StatusMessage message="Creating account..." type="loading" />
      )}
      {error && <StatusMessage message={error?.code} type="error" />}
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
          regex={regex.email}
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
            regex={regex.password}
            submitForm={submitForm}
            setSubmitForm={setSubmitForm}
          />
          <div className="flex flex-wrap mt-4">
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
        <Button disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </>
  );
}

export default SignUp;
