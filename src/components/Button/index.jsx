import { memo } from "react";
import PropTypes from "prop-types";

import { motion } from "framer-motion";

const Button = ({
  children,
  onClick,
  bg,
  padding,
  className,
  disabled,
  type,
  title,
}) => {
  let bgColor;
  if (bg === "full")
    bgColor = `bg-accent ${!disabled && "hover:bg-accent-600"} text-white`;
  else if (bg === "red") {
    bgColor = "bg-error hover:bg-error-600 text-white";
  } else {
    bgColor = `ring-2 ring-primary-300 dark:ring-primary-700 hover:ring-primary-300 hover:bg-primary-300 dark:hover:bg-primary-800`;
  }

  return (
    <motion.button
      whileHover={{ scale: !disabled ? 1.05 : 1 }}
      whileTap={{ scale: !disabled ? 0.95 : 1 }}
      transition={{ type: "spring", duration: 0.3 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={`flex items-center justify-center gap-3 rounded-xl text-sm font-medium transition-colors
                ${bgColor} ${padding} ${className}`}
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
  onClick: PropTypes.func,
  bg: PropTypes.string,
  padding: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  title: PropTypes.string,
};

Button.defaultProps = {
  bg: "full",
  padding: "p-2",
  className: "",
  disabled: false,
  type: "",
  title: "",
};

export default memo(Button);
