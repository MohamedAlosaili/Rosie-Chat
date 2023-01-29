import { useRef, useState } from "react";
import PropTypes from "prop-types";

import { AnimatePresence, motion } from "framer-motion";
import { AiFillPlayCircle } from "react-icons/ai"

import { Backdrop } from "components"

function Video({ video }) {
  const [isPlayed, setIsPlayed] = useState(false);
  const videoRef = useRef(null)

  const togglePlay = (e) => {
    e.stopPropagation()
    setIsPlayed((isPlayed) => !isPlayed);
  }

  if (!isPlayed && videoRef.current) {
    videoRef.current.pause()
    videoRef.current.currentTime = 0
  } else if (isPlayed && videoRef.current) {
    videoRef.current.play()
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {isPlayed && <Backdrop />}
      </AnimatePresence>
      <motion.div
        layout
        animate={isPlayed ? { zIndex: 50 } : { zIndex: 10, transition: { zIndex: { delay: 0.3 } } }}
        data-isplayed={isPlayed}
        className={`relative cursor-pointer grid place-items-center
        data-[isplayed=true]:fixed data-[isplayed=true]:top-0 data-[isplayed=true]:left-0 
        data-[isplayed=true]:h-screen data-[isplayed=true]:w-screen 
        `}
        onClick={togglePlay}
      >
        {!isPlayed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
            data-isplayed={isPlayed}
            className={`absolute inset-0 z-10 group grid place-items-center data-[isplayed=true]:invisible`}
          >
            <AiFillPlayCircle
              size={50}
              className={`transition-all text-accent group-hover:scale-125 group-active:scale-90`}
            />
          </motion.div>
        )}
        <motion.video
          ref={videoRef}
          controls={isPlayed}
          layout
          animate={isPlayed ? { borderRadius: "0" } : { borderRadius: "0.75rem" }}
          data-isplayed={isPlayed}
          onClick={e => isPlayed && e.stopPropagation()}
          className={`relative aspect-video rounded-xl
          data-[isplayed=true]:w-[40rem] data-[isplayed=true]:max-h-[75vh] data-[isplayed=true]:max-w-[100vw] 
          data-[isplayed=true]:cursor-auto 
          `}
        >
          <source src={`${video.url}#t=0.5`} type={`${video.type}`} />
          {/* Here should be fullBack video source */}
          Your browser doesn't support video
        </motion.video>
      </motion.div >
    </div>
  );
}

Video.propTypes = {
  video: PropTypes.shape({
    url: PropTypes.string,
    type: PropTypes.string,
  }),
};

export default Video;
