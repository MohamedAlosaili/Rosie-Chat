import { auth } from "./firebase"
import { useAuthState } from "react-firebase-hooks/auth"

import { Home, UserAuth } from "./pages"
import { StatusMessage } from "./components"

export default function App() {

  const [user, loading, error] = useAuthState(auth)

  if(error) {
    return <StatusMessage message={error?.code} type="loading" />
  }

  if(loading) {
    return <StatusMessage message="loading..." type="loading" />
  }
  console.log(user)
  return (
    <main>
      {
        user?.emailVerified ? <Home /> : <UserAuth user={user} />
      }
    </main>
  )
}