import PropTypes from "prop-types";

import { AnimatePresence, motion } from "framer-motion";

import { Modal } from "components";
import { useMedia } from "hooks";

function Video({ video }) {
  const [isPlayed, togglePlay, videoRef, variants] = useMedia()

  return (
    <div className="relative">
      {!isPlayed && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
          <motion.div
            onClick={togglePlay}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer bg-accent p-2 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-8 h-8 fill-primary-200 stroke-primary-200 translate-x-[0.12rem]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
              />
            </svg>
          </motion.div>
        </div>
      )}
      <video ref={videoRef}>
        <source src={`${video.url}#t=0.5`} type={`${video.type}`} />
        {/* Here should be fullBack video source */}
        Your browser doesn't support video
      </video>
      <AnimatePresence>
        {isPlayed && (
          <Modal
            closeModal={togglePlay}
            opacity={100}
            customVariants={variants}
            className="fixed flex justify-center items-center max-w-3xl"
          >
            <video controls autoPlay>
              <source src={`${video.url}#t=0.5`} type={`${video.type}`} />
              Your browser doesn't support video
            </video >
          </Modal >
        )}
      </AnimatePresence >
    </div>
  );
}

Video.propTypes = {
  video: PropTypes.shape({
    url: PropTypes.string,
    type: PropTypes.string,
  }),
};

/* 
      
*/

export default Video;
