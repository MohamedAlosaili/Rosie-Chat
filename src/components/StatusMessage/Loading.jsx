import PropTypes from "prop-types";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = ({ message, className }) => {
  return (
    <div
      className={`${className} bg-primary-700 text-white shadow-2xl dark:bg-primary-200 dark:text-primary-900`}
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
