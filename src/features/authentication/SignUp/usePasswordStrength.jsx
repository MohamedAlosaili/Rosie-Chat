import { useState, useEffect } from "react";

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

export default usePasswordStrength;
