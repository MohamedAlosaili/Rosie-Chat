import PropTypes from "prop-types";

import { AnimatePresence } from "framer-motion"

import { useMedia } from "hooks";
import { Modal } from "components";

function Image({ img, className }) {
  const [isOpened, toggleOpen, imageRef, variants] = useMedia()

  return (
    <div>
      <picture
        ref={imageRef}
        className={`cursor-pointer overflow-hidden relative block ${className ?? ""}`}
        onClick={toggleOpen}
      >
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
