import PropTypes from "prop-types";

import { signOut } from "firebase/auth";

import { useTimer, useSendVerification } from "hooks";
import { auth } from "rosie-firebase";
import { Button, StatusMessage } from "components";
import { verifyEmail } from "imgs";

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
      <div className="bg-primary-100 dark:bg-primary-800 p-6 rounded-2xl text-center">
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
        <div className="my-4">{timer}</div>
        <div className="flex gap-4">
          <Button
            disabled={isTimerRunning}
            handleClick={sendVerificationEmail}
            additionClasses={`flex-1 text-sm ${
              isTimerRunning ? "cursor-not-allowed opacity-30" : ""
            }`}
          >
            Resend Email
          </Button>
          <Button
            handleClick={backToSignInPage}
            additionClasses="flex-1 text-sm"
          >
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
