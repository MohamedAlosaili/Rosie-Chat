import { useState } from "react";
import PropTypes from "prop-types";

import { AnimatePresence } from "framer-motion";

import { SignIn, SignUp, VerifyEmail } from "features/authentication";

function UserAuth({ user }) {
  const [selectedTap, setSelectedTap] = useState("signin");

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="w-96 max-w-full p-4">
        {user ? (
          <VerifyEmail
            user={user}
            selectedTap={selectedTap}
            setSelectedTap={setSelectedTap}
          />
        ) : (
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
        )}
      </div>
    </div>
  );
}

UserAuth.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.symbol]),
};

export default UserAuth;
