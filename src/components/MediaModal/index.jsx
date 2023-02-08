import { useState, useRef } from "react";
import PropTypes from "prop-types";

import { AnimatePresence, motion } from "framer-motion";
import { AiFillPlayCircle } from "react-icons/ai";

import { Backdrop } from "components";

function MediaModal({ mediaType, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef(null);

  const toggleOpen = (e) => {
    e.stopPropagation();
    setIsOpen((isOpen) => !isOpen);
  };

  if (mediaType === "video") {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0.5;
      videoRef.current.controls = false;
    } else if (isOpen && videoRef.current) {
      videoRef.current.play();
      videoRef.current.controls = true;
    }
  }

  return (
    <div className="relative">
      <AnimatePresence>{isOpen && <Backdrop />}</AnimatePresence>
      <motion.div
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
        {mediaType === "video" && !isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
            data-isplayed={isOpen}
            className={`group absolute inset-0 z-10 grid place-items-center data-[isplayed=true]:invisible`}
          >
            <AiFillPlayCircle
              size={50}
              className={`text-accent transition-all group-hover:scale-125 group-active:scale-90`}
            />
          </motion.div>
        )}
        <motion.div
          layout
          animate={isOpen ? { borderRadius: "0" } : { borderRadius: "0.75rem" }}
          data-isopen={isOpen}
          onClick={(e) => isOpen && e.stopPropagation()}
          className={`relative w-full overflow-hidden rounded-xl data-[isopen=true]:max-h-[75vh] data-[isopen=true]:cursor-auto ${
            mediaType === "image"
              ? "aspect-square object-cover data-[isopen=true]:aspect-auto sm:data-[isopen=true]:w-[30rem]"
              : "aspect-video sm:data-[isopen=true]:w-[40rem]"
          }`}
        >
          {mediaType === "video" ? children(videoRef) : children}
        </motion.div>
      </motion.div>
    </div>
  );
}

MediaModal.propTypes = {
  mediaType: PropTypes.oneOf(["image", "video"]).isRequired,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
};

export default MediaModal;
