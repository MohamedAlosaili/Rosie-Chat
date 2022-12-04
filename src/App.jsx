import { auth } from "./firebase"
import { useAuthState } from "react-firebase-hooks/auth"

import { Home, LogIn, ErrorBoundary } from "./pages"
import { LoadingSpinner } from "./components"

export default function App() {

  const [user, loading, error] = useAuthState(auth)

  if(error) {
    return <ErrorBoundary error={error} />
  }

  if(loading) {
    return <LoadingSpinner />
  }

  return (
    <main>
      {
        user ? <Home /> : <LogIn />
      }
    </main>
  )
}