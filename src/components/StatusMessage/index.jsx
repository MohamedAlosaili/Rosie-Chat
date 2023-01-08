import PropTypes from "prop-types";

import { motion } from "framer-motion";
import { nanoid } from "nanoid";

const container = {
  hidden: { scale: 0.8, opacity: 0, y: "-10rem" },
  visible: { scale: 1, opacity: 1, y: 0 },
};

const StatusMessage = ({ message, type, location }) => {
  const msgColor =
    type === "loading"
      ? "bg-loading-light dark:bg-loading-dark text-primary-200 dark:text-primary-900"
      : "text-white bg-error";

  let errorMsg;
  if (type === "error") {
    const cleanedErrorMsg = message
      .slice(message.includes("auth/") ? 5 : 0)
      .replaceAll("-", " ");
    const capitalizedMsg =
      cleanedErrorMsg[0].toUpperCase() + cleanedErrorMsg.slice(1);
    errorMsg = capitalizedMsg;
  }

  return (
    <motion.div
      key={nanoid()}
      variants={container}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className={`${location} left-0 w-full z-10`}
    >
      <div
        className={`${msgColor} flex gap-4 items-center font-medium py-2 px-8 rounded-lg w-fit mx-auto`}
      >
        {type === "loading" ? (
          <>
            <LoadingSpinner />
            <p>{message}</p>
          </>
        ) : (
          <>
            <ExclMark />
            <p>{errorMsg}</p>
          </>
        )}
      </div>
    </motion.div>
  );
};

const ExclMark = () => (
  <div className="border-2 border-primary-200 rounded-50 w-6 h-6 grid place-items-center font-serif text-sm">
    !
  </div>
);

const LoadingSpinner = () => (
  <div className="border-2 border-primary-700 border-t-primary-200 dark:border-primary-300 dark:border-t-primary-900 rounded-50 w-6 h-6 animate-spin"></div>
);

StatusMessage.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string,
  position: PropTypes.string,
};

StatusMessage.defaultProps = {
  message: "Some thing went wrong!",
  location: "fixed top-4",
};

export default StatusMessage;
