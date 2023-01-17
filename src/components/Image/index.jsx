import PropTypes from "prop-types";

import { AnimatePresence } from "framer-motion"

import { useMedia } from "hooks";
import { Modal } from "components";

function Image({ img }) {
  const [isOpened, toggleOpen, imageRef, variants] = useMedia()

  return (
    <div>
      <picture
        ref={imageRef}
        className="cursor-pointer relative block"
        onClick={toggleOpen}
      >
        <div className="transition-all absolute inset-0 flex items-center justify-center gap-2 bg-black opacity-0 hover:opacity-30 text-2xl">
          Expand
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
          </svg>
        </div>
        <img src={img.url} alt={img.name} />
      </picture>
      <AnimatePresence>
        {isOpened && (
          <Modal
            closeModal={toggleOpen}
            opacity={100}
            customVariants={variants}
            className="fixed flex justify-center items-center max-w-3xl"
          >
            <picture>
              <img src={img.url} alt={img.name} />
            </picture>
          </Modal >
        )}
      </AnimatePresence >
    </div>
  );
}

Image.propTypes = {
  img: PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
  }),
};

export default Image;
