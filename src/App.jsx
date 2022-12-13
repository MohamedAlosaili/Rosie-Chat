import { memo } from "react"
import { auth } from "./firebase"
import { useAuthState } from "react-firebase-hooks/auth"

import { Home, UserAuth } from "./pages"
import { StatusMessage } from "./components"

function App() {
  console.log("<App /> Rendered")
  const [user, loading, error] = useAuthState(auth)

  if(error) {
    return <StatusMessage message={error?.code} type="error" />
  }

  if(loading) {
    return <StatusMessage message="loading..." type="loading" />
  }

  return (
    <main>
      {
        user?.emailVerified ? <Home /> : <UserAuth user={user} />
      }
    </main>
  )
}

export default App