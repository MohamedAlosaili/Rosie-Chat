import { memo } from "react";
import PropTypes from "prop-types";

import { motion } from "framer-motion";

import { defaultAvatar } from "imgs";
import { buttonMotion } from "util";

const NvButton = ({ handleClick, tap, img, icon: ButtonIcon, btnTap, userName }) => {
  const active = tap === btnTap

  const buttonStyle = `lg:p-4 rounded-xl 
  ${active
      ? "lg:bg-accent"
      : "lg:dark:hover:bg-primary-700"
    }
    dark:hover:text-primary-200
    lg:dark:focus:ring-primary-700 lg:dark:focus:text-primary-200
    `
  const profileButtonStyle = `p-0.5 lg:p-1 rounded-50 ${active ? "ring-accent" : "dark:focus:ring-primary-700"}`

  return (
    <div className="relative flex flex-col items-center gap-2">
      <motion.button
        whileHover={buttonMotion.hover}
        whileTap={buttonMotion.tap}
        onClick={handleClick}
        className={`group peer transition-[shadow,background-color,color] focus:outline-none ring-2 ring-transparent lg:ring-4
          ${btnTap === "profile" ? profileButtonStyle : buttonStyle}`
        }
      >
        <div className={`h-8 lg:h-auto grid place-items-center ${active ? "text-accent lg:text-primary-200" : ""}`}>
          {
            btnTap === "profile"
              ? (
                <img
                  src={img ?? defaultAvatar}
                  alt={`${userName} photo`}
                  className="w-8 lg:w-12 rounded-50 cursor-pointer"
                  onError={(e) => (e.target.src = defaultAvatar)}
                />
              ) : (
                ButtonIcon
              )
          }
        </div>
      </motion.button>
      {/*
         
          
          
      */}
      <span
        className={`transition-all text-xs lg:text-base font-medium ${active ? "text-accent" : ""} rounded-lg z-10
              lg:absolute lg:left-[150%] lg:top-1/2 lg:-translate-y-1/2 lg:py-1 lg:px-4 lg:invisible lg:translate-x-[15%] lg:opacity-0 
              lg:peer-hover:visible lg:peer-hover:opacity-100 lg:peer-hover:translate-x-0 
              lg:peer-focus:visible lg:peer-focus:opacity-100 lg:peer-focus:translate-x-0 
              lg:dark:bg-primary-200 
              lg:dark:text-primary-700 
             
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
