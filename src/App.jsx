import { useAuthState } from "react-firebase-hooks/auth"

import { auth } from "rosie-firebase"
import { Home, UserAuth } from "pages"
import { StatusMessage } from "components"

function App() {
  const [user, loading, error] = useAuthState(auth)

  if(error) {
    return <StatusMessage message={error?.code} type="error" />
  }

  if(loading) {
    return <StatusMessage message="Loading..." type="loading" />
  }

  return (
    <main>
      {
        user?.emailVerified ? <Home user={user} /> : <UserAuth user={user} />
      }
    </main>
  )
}

export default App