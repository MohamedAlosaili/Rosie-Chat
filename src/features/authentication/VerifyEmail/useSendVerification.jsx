import { useEffect, useRef } from "react";

import { updateProfile } from "firebase/auth";
import { useSendEmailVerification } from "react-firebase-hooks/auth";

import defaultAvatar from "/assets/imgs/default-avatar.png";
import useStorage from "hooks/useStorage";
import { auth } from "rosie-firebase";

function useSendVerification(user, isTimerRunning, startTimer) {
  const [sendEmailVerification, , error] = useSendEmailVerification(auth);
  // TODO: need improvement
  const [getEmailVerify, setEmailVerify] = useStorage(
    "sessionStorage",
    "email-verify"
  );
  const [getUserInfo, , removeUserInfo] = useStorage(
    "sessionStorage",
    "user-info"
  );
  const { current: isEmailSend } = useRef(() => {
    if (getEmailVerify?.isSend && getEmailVerify?.email === user.email)
      return getEmailVerify.isSend;
    else return false;
  });

  useEffect(() => {
    if (getUserInfo && !user.displayName) {
      updateProfile(user, {
        displayName: getUserInfo.name,
        photoURL: defaultAvatar,
      })
        .then(() => {
          sendVerificationEmail();
          removeUserInfo();
          setEmailVerify({ isSend: true, email: user.email });
        })
        .catch((error) => console.log(error));
    } else if (!isEmailSend()) {
      sendVerificationEmail();
      setEmailVerify({ isSend: true, email: user.email });
    }
  }, []);

  async function sendVerificationEmail(event) {
    if (!isTimerRunning && event) {
      startTimer();
    }
    await sendEmailVerification();
  }

  return [sendVerificationEmail, error];
}

export default useSendVerification;
