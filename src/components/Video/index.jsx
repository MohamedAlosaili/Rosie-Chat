import { memo, useState } from "react";
import PropTypes from "prop-types";

import { nanoid } from "nanoid";
import { TbFaceIdError } from "react-icons/tb";
import { AiOutlineReload } from "react-icons/ai";

import SkeletonLoader from "components/SkeletonLoader";

function Video({ video, className, videoRef, autoPlay }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const reload = () => {
    setLoading(true);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <div
      onClick={(e) => (error || loading) && e.stopPropagation()}
      className={`aspect-video h-full overflow-hidden ${
        error ? "cursor-auto" : ""
      } ${className ?? ""}`}
    >
      {loading && <SkeletonLoader.Img className={className} />}
      {error && (
        <div className="relative z-50 flex h-full w-full flex-col items-center justify-center gap-1 bg-primary-400/50 dark:bg-primary-700/75">
          <button onClick={reload} className="relative">
            <TbFaceIdError className="text-[1.5em]" />
            <AiOutlineReload className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 transform text-[2em]" />
          </button>
        </div>
      )}
      <video
        key={nanoid()}
        ref={videoRef}
        loading="lazy"
        autoPlay={autoPlay}
        muted
        onLoadedData={() => setLoading(false)}
        onError={handleError}
        className={`h-full w-full ${loading || error ? "hidden" : "block"}`}
      >
        <source src={`${video.url}#t=0.5`} type={`${video.type}`} />
        Your browser doesn't support video
      </video>
    </div>
  );
}

Video.propTypes = {
  video: PropTypes.shape({
    url: PropTypes.string,
    type: PropTypes.string,
  }),
  videoRef: PropTypes.object,
  autoPlay: PropTypes.bool,
};

Video.defaultProps = {
  className: "w-full",
  autoPlay: false,
};

export default memo(Video);
