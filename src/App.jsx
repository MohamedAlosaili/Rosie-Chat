import { lazy, Suspense } from "react";

import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "rosie-firebase";
import StatusMessage from "components/StatusMessage";

const Home = lazy(() => import("pages/Home"));
const UserAuth = lazy(() => import("pages/UserAuth"));

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (error) {
    return <StatusMessage message={error?.code} type="error" />;
  }

  if (loading) {
    return <StatusMessage message="Loading..." type="loading" />;
  }

  return (
    <main>
      <Suspense
        fallback={<StatusMessage message="Loading..." type="loading" />}
      >
        {user ? <Home /> : <UserAuth />}
      </Suspense>
    </main>
  );
}

export default App;
