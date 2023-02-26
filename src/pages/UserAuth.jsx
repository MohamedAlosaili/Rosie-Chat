import { useState, lazy, Suspense } from "react";

import { AnimatePresence } from "framer-motion";
import StatusMessage from "../components/StatusMessage";

const SignIn = lazy(() => import("features/authentication/SignIn"));
const SignUp = lazy(() => import("features/authentication/SignUp"));

function UserAuth() {
  const [selectedTap, setSelectedTap] = useState("signin");

  return (
    <div className="grid min-h-screen place-items-center">
      <div className="w-96 max-w-full p-4">
        <Suspense
          fallback={<StatusMessage type="loading" message="loading..." />}
        >
          <AnimatePresence initial={false} mode="wait">
            {selectedTap === "signin" ? (
              <SignIn
                selectedTap={selectedTap}
                setSelectedTap={setSelectedTap}
              />
            ) : (
              <SignUp
                selectedTap={selectedTap}
                setSelectedTap={setSelectedTap}
              />
            )}
          </AnimatePresence>
        </Suspense>
      </div>
    </div>
  );
}

export default UserAuth;
