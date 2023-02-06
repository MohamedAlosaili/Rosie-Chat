import PropTypes from "prop-types";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = ({ message, className }) => {
  return (
    <div
      className={`${className} bg-loading-light text-primary-200 dark:bg-loading-dark dark:text-primary-900`}
    >
      <AiOutlineLoading3Quarters size={20} className="animate-spin" />
      <p>{message}</p>
    </div>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
};

export default Loading;
