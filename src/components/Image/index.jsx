import { useState } from "react";
import PropTypes from "prop-types";

import { AnimatePresence, motion } from "framer-motion";

import { Backdrop } from "components";

function Image({ img, className, borderRadius }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen((isOpen) => !isOpen);

  return (
    <div>
      <AnimatePresence>{isOpen && <Backdrop />}</AnimatePresence>
      <motion.picture
        layout
        animate={
          isOpen
            ? { zIndex: 50 }
            : { zIndex: 10, transition: { zIndex: { delay: 0.3 } } }
        }
        data-isopen={isOpen}
        className={`relative grid cursor-pointer place-items-center
        data-[isopen=true]:fixed data-[isopen=true]:top-0 data-[isopen=true]:left-0 
        data-[isopen=true]:h-screen data-[isopen=true]:w-screen 
        `}
        onClick={toggleOpen}
      >
        <motion.img
          layout
          src={img.url}
          alt={img.name}
          animate={isOpen ? { borderRadius: "0" } : { borderRadius }}
          data-isopen={isOpen}
          onClick={(e) => isOpen && e.stopPropagation()}
          className={`relative aspect-square rounded-xl bg-primary-800 object-cover dark:bg-primary-100 ${
            className ?? ""
          }
          data-[isopen=true]:aspect-auto data-[isopen=true]:max-h-[75vh] data-[isopen=true]:w-[30rem] data-[isopen=true]:cursor-auto 
          `}
        />
      </motion.picture>
    </div>
  );
}

Image.propTypes = {
  img: PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
  }),
  className: PropTypes.string,
  borderRadius: PropTypes.string,
};

Image.defaultProps = {
  borderRadius: "0.75rem",
};

export default Image;
