import { memo } from "react";
import PropTypes from "prop-types";

import { motion } from "framer-motion";

import { defaultAvatar } from "imgs";
import { buttonMotion } from "util";

const NvButton = ({ handleClick, tap, img, btnTap, userName }) => {
  const buttonStyle =
    btnTap !== "profile"
      ? `transition-colors p-4 rounded-xl ${tap === btnTap ? "bg-accent active" : "dark:hover:bg-primary-700"
      }`
      : `transition-shadow p-1 rounded-50 ring-4 ${tap === btnTap ? "ring-accent" : "ring-transparent"
      }`;

  const imgStyle =
    btnTap === "profile"
      ? "w-12 rounded-50 cursor-pointer"
      : "invert-[.7] group-hover:invert-[.3] dark:group-hover:invert-[.9] w-6 dark:group-[.active]:invert";

  return (
    <div className="relative">
      <motion.button
        whileHover={buttonMotion.hover}
        whileTap={buttonMotion.tap}
        onClick={handleClick}
        className={`group peer ${buttonStyle}`}
      >
        <img
          src={img ?? (btnTap === "profile" && defaultAvatar)}
          alt={btnTap === "profile" ? `${userName} photo` : `${btnTap} icon`}
          className={`${imgStyle}`}
          onError={(e) => (e.target.src = defaultAvatar)}
        />
      </motion.button>
      <span
        className={`transition-all absolute left-[150%] top-1/2 -translate-y-1/2 block bg-primary-200 text-primary-700 font-medium py-1 px-4 rounded-lg 
                            invisible peer-hover:visible opacity-0 peer-hover:opacity-100 translate-x-[15%] peer-hover:translate-x-0 z-10`}
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
