import PropTypes from "prop-types";

const Loading = ({ message, className }) => {
  return (
    <div
      className={`${className} bg-loading-light dark:bg-loading-dark text-primary-200 dark:text-primary-900`}
    >
      <div className="border-2 border-primary-700 border-t-primary-200 dark:border-primary-300 dark:border-t-primary-900 rounded-50 w-6 h-6 animate-spin"></div>
      <p>{message}</p>
    </div>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
};

export default Loading;
