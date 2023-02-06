import PropTypes from "prop-types";

import { BsCheckCircleFill } from "react-icons/bs";

const Success = ({ message, className }) => {
  return (
    <div className={`${className} bg-green-800 text-white`}>
      {/* TODO: Success bg-color need to declare in tailwind config */}
      <BsCheckCircleFill size={20} />
      <p>{message}</p>
    </div>
  );
};

Success.propTypes = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Success;
