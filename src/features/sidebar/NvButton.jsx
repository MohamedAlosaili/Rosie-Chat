import { memo } from "react";
import PropTypes from "prop-types";

import { motion } from "framer-motion";

import { defaultAvatar } from "imgs";
import { buttonMotion } from "util";

const NvButton = ({ handleClick, tap, img, icon: ButtonIcon, btnTap, userName }) => {
  const buttonStyle = `p-4 rounded-xl 
  ${tap === btnTap
      ? "bg-accent dark:text-primary-200"
      : "dark:hover:bg-primary-700"
    }
    dark:hover:text-primary-200
    dark:focus:ring-primary-700 dark:focus:text-primary-200
    `
  const profileButtonStyle = `p-1 rounded-50 ${tap === btnTap ? "ring-accent" : "dark:focus:ring-primary-700"}`

  return (
    <div className="relative">
      <motion.button
        whileHover={buttonMotion.hover}
        whileTap={buttonMotion.tap}
        onClick={handleClick}
        className={`group peer transition-[shadow,background-color,color] focus:outline-none ring-4 ring-transparent 
          ${btnTap === "profile" ? profileButtonStyle : buttonStyle}`
        }
      >
        {
          btnTap === "profile"
            ? (
              <img
                src={img ?? defaultAvatar}
                alt={`${userName} photo`}
                className="w-12 rounded-50 cursor-pointer"
                onError={(e) => (e.target.src = defaultAvatar)}
              />
            ) : (
              ButtonIcon
            )
        }
      </motion.button>
      <span
        className={`
          transition-all absolute left-[150%] top-1/2 -translate-y-1/2 block font-medium py-1 px-4 rounded-lg 
          invisible translate-x-[15%] opacity-0 z-10
          peer-hover:visible peer-hover:opacity-100 peer-hover:translate-x-0 
          peer-focus:visible peer-focus:opacity-100 peer-focus:translate-x-0 
          dark:bg-primary-200 
          dark:text-primary-700    
        `}
      >
        {btnTap[0].toUpperCase() + btnTap.slice(1)}
      </span>
    </div>
  );
};

NvButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  tap: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  btnTap: PropTypes.string.isRequired,
  userName: PropTypes.string,
};

export default memo(NvButton);
