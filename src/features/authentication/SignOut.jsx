import { auth } from "../../firebase";
import { signOut } from "firebase/auth";

export default function SignOut() {
  return (
    auth.currentUser && <button onClick={() => signOut(auth)}>Sign Out</button>
  );
}
