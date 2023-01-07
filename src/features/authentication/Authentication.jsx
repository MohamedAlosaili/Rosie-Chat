import PropTypes from "prop-types";
import { motion } from "framer-motion";

import { signWithProviders } from "rosie-firebase";
import { Button } from "components";
import { googleLogo } from "imgs";

const variants = {
  hidden: {
    x: "-25%",
    opacity: 0,
  },
  visible: {
    x: "0%",
    opacity: 1,
  },
};

const Authentication = ({
  title,
  greeting,
  children,
  selectedTap,
  setSelectedTap,
}) => {
  function changeTap() {
    const newTap = selectedTap === "signin" ? "signup" : "signin";

    setSelectedTap(newTap);
  }

  return (
    <motion.section
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="flex flex-col gap-6"
    >
      <h1 className="text-[2.5rem] font-bold text-center text-primary-900 dark:text-primary-200">
        {title}
      </h1>
      <p className="text-center font-medium">{greeting}</p>
      {children}
      <div className="relative before:absolute before:left-0 before:top-[50%] before:-mt-px before:h-px before:w-full before:bg-primary-400 dark:before:bg-primary-700">
        <span className="relative block h-full w-16 bg-white dark:bg-primary-900 mx-auto text-center">
          or
        </span>
      </div>
      <Button
        handleClick={signWithProviders.bind(this, "google")}
        bg="empty"
        additionClasses="w-full"
      >
        <img src={googleLogo} alt="Google logo" className="w-5" />
        Sign {selectedTap === "signin" ? "in" : "up"} with Google
      </Button>
      <p className="text-sm text-center">
        {selectedTap === "signin"
          ? "Don't have an account? "
          : "Already have an account? "}
        <a
          onClick={changeTap}
          className="text-success hover:text-success-600 cursor-pointer font-medium"
        >
          {selectedTap === "signin" ? "Sign up" : "Sign in"}
        </a>
      </p>
    </motion.section>
  );
};

Authentication.propTypes = {
  title: PropTypes.string,
  greeting: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  children: PropTypes.element,
  selectedTap: PropTypes.string,
  setSelectedTap: PropTypes.func,
};

export default Authentication;
