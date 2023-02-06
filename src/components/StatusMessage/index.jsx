import { useId } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";

import { motion } from "framer-motion";

import Error from "./Error";
import Loading from "./Loading";
import Success from "./Success";

const container = {
  hidden: { scale: 0.8, opacity: 0, y: "-10rem" },
  visible: { scale: 1, opacity: 1, y: 0 },
};

const StatusMessage = ({ message, type }) => {
  const key = useId();

  const className =
    "flex items-center gap-4 items-center font-medium py-2 px-8 rounded-lg w-fit mx-auto";

  const statusMessage = () => {
    switch (type) {
      case "loading":
        return <Loading message={message} className={className} />;
      case "error":
        return <Error message={message} className={className} />;
      case "success":
        return <Success message={message} className={className} />;
    }
  };

  return createPortal(
    <motion.div
      key={key}
      variants={container}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed top-4 left-0 z-50 w-full"
    >
      {statusMessage()}
    </motion.div>,
    document.getElementById("status")
  );
};

StatusMessage.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string,
};

export default StatusMessage;
