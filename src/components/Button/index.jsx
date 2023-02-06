import { memo } from "react";
import PropTypes from "prop-types";

import { motion } from "framer-motion";

const Button = ({
  children,
  handleClick,
  bg,
  padding,
  additionClasses,
  disabled,
  type,
  title,
}) => {
  let bgColor;
  if (bg === "full")
    bgColor = `bg-accent ${
      !disabled && "hover:bg-accent-600"
    } text-primary-200`;
  else if (bg === "red") {
    bgColor = "bg-error hover:bg-error-600 text-primary-200";
  } else {
    bgColor = `ring-1 ring-primary-400 dark:ring-primary-700 hover:ring-primary-500 hover:bg-primary-100 dark:hover:bg-primary-800`;
  }

  return (
    <motion.button
      whileHover={{ scale: !disabled ? 1.05 : 1 }}
      whileTap={{ scale: !disabled ? 0.95 : 1 }}
      transition={{ type: "spring", duration: 0.3 }}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      title={title}
      className={`flex items-center justify-center gap-3 rounded-xl font-medium transition-colors 
                ${bgColor} ${padding} ${additionClasses}`}
    >
      {children}
    </motion.button>
  );
};

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.element,
  ]).isRequired,
  handleClick: PropTypes.func,
  bg: PropTypes.string,
  padding: PropTypes.string,
  additionClasses: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};

Button.defaultProps = {
  bg: "full",
  padding: "p-2",
  additionClasses: "",
  disabled: false,
  type: "",
};

export default memo(Button);
