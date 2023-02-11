import { useState, lazy, Suspense } from "react";
import PropTypes from "prop-types";

import { AnimatePresence } from "framer-motion";

const SignIn = lazy(() => import("features/authentication/SignIn"));
const SignUp = lazy(() => import("features/authentication/SignUp"));
const VerifyEmail = lazy(() => import("features/authentication/VerifyEmail"));

function UserAuth({ user }) {
  const [selectedTap, setSelectedTap] = useState("signin");

  return (
    <div className="grid min-h-screen place-items-center">
      <div className="w-96 max-w-full p-4">
        <Suspense>
          <AnimatePresence initial={false} mode="wait">
            {user ? (
              <VerifyEmail
                user={user}
                selectedTap={selectedTap}
                setSelectedTap={setSelectedTap}
              />
            ) : selectedTap === "signin" ? (
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

UserAuth.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.symbol]),
};

export default UserAuth;
