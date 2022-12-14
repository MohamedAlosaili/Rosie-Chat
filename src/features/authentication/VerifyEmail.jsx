import PropTypes from "prop-types";
import { useEffect } from "react";

import { signOut } from "firebase/auth";

import { useSendEmailVerification } from "react-firebase-hooks/auth";

import { auth } from "../../firebase";
import { Button, StatusMessage } from "../../components";

import { verifyEmail } from "../../imgs";
import { useState } from "react";

const VerifyEmail = ({ user, selectedTap, setSelectedTap }) => {
  const [sendEmailVerification, sending, error] =
    useSendEmailVerification(auth);
  const [timer, setTimer] = useState(() => {
    const sessionTimer = JSON.parse(sessionStorage.getItem("timer"));
    const verify = JSON.parse(sessionStorage.getItem("email-verify"));

    if (
      sessionTimer &&
      !sessionTimer.isFinished &&
      verify?.email === user.email
    ) {
      return sessionTimer;
    }

    const newTimer = { minutes: "01", seconds: "00", isFinished: false };
    return newTimer;
  });

  let interval;
  useEffect(() => {
    interval = setInterval(countDown, 1000);

    const verify = JSON.parse(sessionStorage.getItem("email-verify"));

    if (!verify?.isSend || verify?.email !== user.email) {
      sendVerificationEmail();
      sessionStorage.setItem(
        "email-verify",
        JSON.stringify({ isSend: true, email: user.email })
      );
    }

    return () => clearInterval(interval);
  }, []);

  // store the remaining timer in sessionStorage if the component unmount
  useEffect(
    () => () => sessionStorage.setItem("timer", JSON.stringify(timer)),
    [timer]
  );

  // change the email-verify state depending on the timer or if rsend clicked
  useEffect(() => {
    timer.isFinished &&
      sessionStorage.setItem(
        "email-verify",
        JSON.stringify({ isSend: false, email: user.email })
      );

    if (+timer.seconds > 0 && !timer.isFinished)
      sessionStorage.setItem(
        "email-verify",
        JSON.stringify({ isSend: true, email: user.email })
      );
  }, [timer.isFinished]);

  async function sendVerificationEmail() {
    if (timer.isFinished) {
      interval = setInterval(countDown, 1000);
      setTimer({
        minutes: "01",
        seconds: "00",
        isFinished: false,
      });
    }
    await sendEmailVerification();
  }

  function countDown() {
    setTimer(({ minutes, seconds, isFinished }) => {
      let newMin = 0;
      let newSec = +seconds === 0 ? 59 : +seconds - 1;

      if (+minutes === 0 && +seconds === 0) {
        clearInterval(interval);
        return { minutes: `00`, seconds: `00`, isFinished: true };
      }

      return {
        minutes: `0${newMin}`,
        seconds: newSec < 10 ? `0${newSec}` : newSec,
        isFinished,
      };
    });
  }

  function backToSignInPage() {
    selectedTap === "signup" && setSelectedTap("signin");

    signOut(auth);
  }

  return (
    <div className="bg-primary-100 dark:bg-primary-800 p-6 rounded-2xl text-center">
      {error && <StatusMessage message={error.code} type="error" />}
      <h1 className="text-2xl font-bold mb-6 text-primary-900 dark:text-primary-200">
        Verify your email
      </h1>
      <h3 className="text-[0.9rem] text-primary-900 dark:text-primary-200">
        You will need to verify your email to compelte registeration
      </h3>
      <img
        src={verifyEmail}
        alt="Verify Email Image"
        className="w-40 mx-auto my-6"
      />
      <p className="text-[0.9rem] ">
        An email has been sent to {user.email} check your spam folder if you
        have not received the email
      </p>
      <div className="my-4">
        {timer.minutes}:{timer.seconds}
      </div>
      <div className="flex gap-4">
        <Button
          disabled={!timer.isFinished}
          handleClick={sendVerificationEmail}
          additionClasses={`flex-1 text-sm ${
            !timer.isFinished ? "cursor-not-allowed opacity-30" : ""
          }`}
        >
          Resend Email
        </Button>
        <Button handleClick={backToSignInPage} additionClasses="flex-1 text-sm">
          Sign in
        </Button>
      </div>
    </div>
  );
};

VerifyEmail.propType = {
  user: PropTypes.object.isRequired,
  selectedTap: PropTypes.string,
  setSelectedTap: PropTypes.func,
};

export default VerifyEmail;
