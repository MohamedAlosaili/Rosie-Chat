import { memo } from "react";
import PropTypes from "prop-types";

import { motion } from "framer-motion";

import { defaultAvatar } from "imgs";
import { buttonMotion } from "util";
import { Tooltip } from "components";

const NvButton = ({
  handleClick,
  tap,
  img,
  icon: ButtonIcon,
  btnTap,
  userName,
}) => {
  const active = tap === btnTap;

  const buttonStyle = `lg:p-4 rounded-xl 
  ${active ? "lg:bg-accent" : "lg:dark:hover:bg-primary-700"}
    dark:hover:text-primary-200
    lg:dark:focus:ring-primary-700 lg:dark:focus:text-primary-200
    `;
  const profileButtonStyle = `p-0.5 lg:p-1 rounded-50 ${
    active ? "ring-accent" : "dark:focus:ring-primary-700"
  }`;

  return (
    <div className="relative flex flex-col items-center gap-2 dark:hover:text-primary-200">
      <motion.button
        whileHover={buttonMotion.hover}
        whileTap={buttonMotion.tap}
        onClick={handleClick}
        className={`group peer ring-2 ring-transparent transition-[shadow,background-color,color] focus:outline-none lg:ring-4
          ${btnTap === "profile" ? profileButtonStyle : buttonStyle}`}
      >
        <div
          className={`grid h-8 place-items-center lg:h-auto ${
            active ? "text-accent lg:text-primary-200" : ""
          }`}
        >
          {btnTap === "profile" ? (
            <img
              src={img ?? defaultAvatar}
              alt={`${userName} photo`}
              className="w-8 cursor-pointer rounded-50 lg:w-12"
              onError={(e) => (e.target.src = defaultAvatar)}
            />
          ) : (
            ButtonIcon
          )}
        </div>
      </motion.button>
      <Tooltip text={btnTap} position="right" className="capitalize" />
      <span
        className={`text-xs font-medium transition-all lg:hidden lg:text-base ${
          active ? "text-accent" : ""
        } capitalize`}
      >
        {btnTap}
      </span>
    </div>
  );
};

NvButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  tap: PropTypes.string.isRequired,
  img: PropTypes.string,
  icon: PropTypes.element,
  btnTap: PropTypes.string.isRequired,
  userName: PropTypes.string,
};

export default memo(NvButton);
