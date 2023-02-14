import PropTypes from "prop-types";

import { signOut } from "firebase/auth";

import StatusMessage from "components/StatusMessage";
import Button from "components/Button";
import verifyEmail from "imgs/verify-email.svg";
import useTimer from "./useTimer";
import useSendVerification from "./useSendVerification";
import { auth } from "rosie-firebase";

function VerifyEmail({ user, selectedTap, setSelectedTap }) {
  const [timer, isTimerRunning, startTimer] = useTimer(90);
  const [sendVerificationEmail, sendingError] = useSendVerification(
    user,
    isTimerRunning,
    startTimer
  );

  function backToSignInPage() {
    selectedTap === "signup" && setSelectedTap("signin");

    signOut(auth);
  }

  return (
    <>
      {sendingError && (
        <StatusMessage message={sendingError?.code} type="error" />
      )}
      <div className="rounded-2xl bg-primary-100 p-6 text-center dark:bg-primary-800">
        <h1 className="mb-6 text-2xl font-bold text-primary-900 dark:text-primary-200">
          Verify your email
        </h1>
        <h3 className="text-[0.9rem] text-primary-900 dark:text-primary-200">
          You will need to verify your email to compelte registeration
        </h3>
        <img
          src={verifyEmail}
          alt="Verify Email Image"
          className="mx-auto my-6 w-40"
        />
        <p className="text-[0.9rem] ">
          An email has been sent to {user.email} check your spam folder if you
          have not received the email
        </p>
        <div className="my-4">{timer}</div>
        <div className="flex gap-4">
          <Button
            disabled={isTimerRunning}
            onClick={sendVerificationEmail}
            className={`flex-1 ${
              isTimerRunning ? "cursor-not-allowed opacity-30" : ""
            }`}
          >
            Resend Email
          </Button>
          <Button onClick={backToSignInPage} className="flex-1">
            Sign in
          </Button>
        </div>
      </div>
    </>
  );
}

VerifyEmail.propType = {
  user: PropTypes.object.isRequired,
  selectedTap: PropTypes.string,
  setSelectedTap: PropTypes.func,
};

export default VerifyEmail;
