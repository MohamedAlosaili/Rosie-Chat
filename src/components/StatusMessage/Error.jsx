import PropTypes from "prop-types";

const Error = ({ message, className }) => {
  const cleanedErrorMsg = message.replace(/^(\w+\/)*/, "").replaceAll("-", " ");
  const finalErrorMsg =
    cleanedErrorMsg[0].toUpperCase() + cleanedErrorMsg.slice(1);

  return (
    <div className={`${className} text-white bg-error`}>
      <div className="border-2 border-primary-200 rounded-50 w-6 h-6 grid place-items-center font-serif text-sm">
        !
      </div>
      <p>{finalErrorMsg}</p>
    </div>
  );
};

Error.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
};

Error.defaultProps = {
  message: "Some thing went wrong!",
};

export default Error;
