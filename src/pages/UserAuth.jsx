import { useState } from "react";
import PropTypes from "prop-types";

import {
  Authentication,
  SignIn,
  SignUp,
  VerifyEmail,
} from "../features/authentication";

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
        ) : selectedTap === "signin" ? (
          <Authentication
            title="Sign in."
            greeting={
              <span>
                Welcome back! 👋 <br /> Please enter your details.
              </span>
            }
            selectedTap={selectedTap}
            setSelectedTap={setSelectedTap}
          >
            <SignIn />
          </Authentication>
        ) : (
          <Authentication
            title="Sign up."
            greeting="We are excited ✨ that you will be one of us."
            selectedTap={selectedTap}
            setSelectedTap={setSelectedTap}
          >
            <SignUp />
          </Authentication>
        )}
      </div>
    </div>
  );
}

UserAuth.propTypes = {
  user: PropTypes.oneOfType([PropTypes.object, PropTypes.symbol]),
};

export default UserAuth;
