import { useSendEmailVerification } from "react-firebase-hooks/auth";

import { SignOut } from "../features/authentication";
import { auth } from "../firebase";

export default function Home() {
  const [sendEmailVerification, sending, error] =
    useSendEmailVerification(auth);

  async function verfiyEmail() {
    try {
      const sendMessage = await sendEmailVerification(auth.currentUser);
      console.log("No Errors");
      console.log(sendMessage);
    } catch (error) {
      console.log(error);
    }
  }

  console.log("sending, error");
  console.log(sending, error);
  console.log(auth.currentUser);
  return (
    <div className="h-100">
      <h1>Home live now</h1>
      <button onClick={verfiyEmail}>Verify my email</button>
      <SignOut />
    </div>
  );
}
