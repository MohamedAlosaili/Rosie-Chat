import PropTypes from "prop-types";

import { motion } from "framer-motion";

import { signWithProviders } from "rosie-firebase";
import Button from "components/Button";
import googleLogo from "imgs/Google_logo.svg";

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
      <h1 className="text-center text-[2.5rem] font-bold text-primary-900 dark:text-primary-200">
        {title}
      </h1>
      <p className="text-center font-medium">{greeting}</p>
      {children}
      <div className="relative before:absolute before:left-0 before:top-[50%] before:-mt-px before:h-px before:w-full before:bg-primary-400 dark:before:bg-primary-700">
        <span className="relative mx-auto block h-full w-16 bg-white text-center dark:bg-primary-900">
          or
        </span>
      </div>
      <Button
        handleClick={signWithProviders.bind(this, "google")}
        bg="empty"
        additionClasses="w-full"
      >
        <img src={googleLogo} alt="Google logo" className="w-5" />
        {selectedTap === "signin" ? "Sign in" : "Sign up"} with Google
      </Button>
      <p className="text-center text-sm">
        {selectedTap === "signin"
          ? "Don't have an account? "
          : "Already have an account? "}
        <a
          onClick={changeTap}
          className="cursor-pointer font-bold text-info transition-colors hover:text-info-600"
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
