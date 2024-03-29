import { memo, useState } from "react";
import PropTypes from "prop-types";

import { nanoid } from "nanoid";
import { TbFaceIdError } from "react-icons/tb";
import { AiOutlineReload } from "react-icons/ai";

import SkeletonLoader from "components/SkeletonLoader";

function Image({ img, className, style }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadNum, setReloadNum] = useState(0);

  const reload = () => {
    setLoading(true);
    setError(false);
    setReloadNum((prevNum) => prevNum + 1);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <picture
      onClick={(e) =>
        (error || loading) && reloadNum < 3 && e.stopPropagation()
      }
      className={`block h-full overflow-hidden ${className ?? ""} ${
        !loading ? "bg-primary-400/50 dark:bg-primary-700/75" : ""
      } ${error ? "cursor-auto" : ""}`}
    >
      {loading && <SkeletonLoader.Img className={className ?? ""} />}
      {error && (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1">
          <button
            onClick={() => (reloadNum < 3 ? reload() : null)}
            className="relative"
          >
            <TbFaceIdError className="text-[1.5em]" />
            {reloadNum < 3 && (
              <AiOutlineReload className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 transform text-[2em]" />
            )}
          </button>
        </div>
      )}
      <img
        key={nanoid()}
        src={img.url}
        alt={img.name}
        style={style}
        className={`h-full w-full bg-[var(--color)] object-cover ${
          loading || error ? "hidden" : "block"
        }`}
        onLoad={() => setLoading(false)}
        onError={handleError}
      />
    </picture>
  );
}

Image.propTypes = {
  img: PropTypes.shape({
    url: PropTypes.string,
    name: PropTypes.string,
  }),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default memo(Image);
