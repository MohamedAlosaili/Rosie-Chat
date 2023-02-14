import { memo } from "react";
import PropTypes from "prop-types";

const Tooltip = ({ text, position, className, visibleOnScreen }) => {
  const locations = {
    top: "bottom-[150%] left-1/2 -translate-x-1/2 -translate-y-[15%]",
    bottom: "top-[150%] left-1/2 -translate-x-1/2 translate-y-[15%]",
    right: "top-1/2 left-[150%] translate-x-[15%] -translate-y-1/2",
    left: "top-1/2 right-[150%] -translate-x-[15%] -translate-y-1/2",
  };

  const visible = {
    md: "md:block",
    lg: "lg:block",
    xl: "xl:block",
  };

  return (
    text && (
      <div
        className={`invisible absolute z-10 hidden w-max rounded-lg text-xs text-base font-medium transition-all
              ${locations[position]} py-1 px-4 opacity-0 ${
          visible[visibleOnScreen]
        }  
              peer-hover:visible peer-hover:opacity-100 ${
                position === "top" || position === "bottom"
                  ? "peer-hover:translate-y-0"
                  : "peer-hover:translate-x-0 "
              } 
              peer-focus:visible peer-focus:opacity-100 ${
                position === "top" || position === "bottom"
                  ? "peer-focus:translate-y-0"
                  : "peer-focus:translate-x-0 "
              } 
              dark:bg-primary-200 
              dark:text-primary-700 
              ${className}
        `}
      >
        {text}
      </div>
    )
  );
};

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  position: PropTypes.oneOf(["top", "bottom", "left", "right"]).isRequired,
  className: PropTypes.string,
  visibleOnScreen: PropTypes.oneOf(["md", "lg", "xl"]),
};

Tooltip.defaultProps = {
  visibleOnScreen: "md",
};

export default memo(Tooltip);
