import PropTypes from "prop-types";

import { motion } from "framer-motion";
import { nanoid } from "nanoid";

import Error from "./Error";
import Loading from "./Loading";

const container = {
  hidden: { scale: 0.8, opacity: 0, y: "-10rem" },
  visible: { scale: 1, opacity: 1, y: 0 },
};

const StatusMessage = ({ message, type, location, zIndex }) => {
  const className =
    "flex gap-4 items-center font-medium py-2 px-8 rounded-lg w-fit mx-auto";

  return (
    <motion.div
      key={nanoid()}
      variants={container}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className={`${location} left-0 w-full ${zIndex}`}
    >
      {type === "loading" ? (
        <Loading message={message} className={className} />
      ) : (
        <Error message={message} className={className} />
      )}
    </motion.div>
  );
};

StatusMessage.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string,
  location: PropTypes.string,
  zIndex: PropTypes.string,
};

StatusMessage.defaultProps = {
  location: "fixed top-4",
  zIndex: "z-10",
};

export default StatusMessage;
