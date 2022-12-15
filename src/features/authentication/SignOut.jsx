import { signOut } from "firebase/auth";

import { auth } from "rosie-firebase";

export default function SignOut() {
  return (
    auth.currentUser && <button onClick={() => signOut(auth)}>Sign Out</button>
  );
}
