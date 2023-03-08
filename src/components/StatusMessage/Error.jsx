import PropTypes from "prop-types";

import { BsExclamationCircle } from "react-icons/bs";

const Error = ({ message, className }) => {
  const cleanedErrorMsg = message.replace(/^(\w+\/)*/, "").replaceAll("-", " ");
  const finalErrorMsg =
    cleanedErrorMsg[0].toUpperCase() + cleanedErrorMsg.slice(1);

  return (
    <div className={`${className} bg-red-800 text-white`}>
      <BsExclamationCircle size={25} />
      <p>{finalErrorMsg}</p>
    </div>
  );
};

Error.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
};

Error.defaultProps = {
  message: "Some thing went wrong!",
};

export default Error;
